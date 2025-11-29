import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Trophy, 
  Clock,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Medal,
  Target,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import type { Competition, CompetitionQuestion } from "@shared/schema";

type QuizState = "intro" | "playing" | "results";

export default function Quiz() {
  const [, params] = useRoute("/competitions/:id");
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const competitionId = params?.id ? parseInt(params.id) : null;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: t("unauthorized"),
        description: t("pleaseSignIn"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, t]);

  const { data: competition, isLoading: competitionLoading } = useQuery<Competition>({
    queryKey: ["/api/competitions", competitionId],
    enabled: !!competitionId && isAuthenticated,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery<CompetitionQuestion[]>({
    queryKey: ["/api/competitions", competitionId, "questions"],
    enabled: !!competitionId && isAuthenticated && quizState === "playing",
  });

  const submitScoreMutation = useMutation({
    mutationFn: async (data: { competitionId: number; score: number; totalQuestions: number }) => {
      await apiRequest("POST", "/api/user/scores", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/scores"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: t("unauthorized"),
          description: t("pleaseSignInAgain"),
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: t("error"),
        description: t("failedSaveScore"),
        variant: "destructive",
      });
    },
  });

  const handleStartQuiz = () => {
    setQuizState("playing");
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStartTime(new Date());
  };

  const handleSelectAnswer = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowFeedback(true);
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete - answers array already contains all answers including the last one
      const score = calculateScore(answers);
      if (competitionId) {
        submitScoreMutation.mutate({
          competitionId,
          score,
          totalQuestions: questions.length,
        });
      }
      setQuizState("results");
    }
  };

  const calculateScore = (finalAnswers: number[] = answers) => {
    if (!questions) return 0;
    return finalAnswers.reduce((score, answer, index) => {
      if (index < questions.length && answer === questions[index].correctAnswer) {
        return score + (questions[index].points || 10);
      }
      return score;
    }, 0);
  };

  const calculateCorrectAnswers = (finalAnswers: number[] = answers) => {
    if (!questions) return 0;
    return finalAnswers.filter((answer, index) => {
      if (index < questions.length) {
        return answer === questions[index].correctAnswer;
      }
      return false;
    }).length;
  };

  const getScorePercentage = () => {
    if (!questions || questions.length === 0) return 0;
    return Math.round((calculateCorrectAnswers() / questions.length) * 100);
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { label: "Gold", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
    if (percentage >= 70) return { label: "Silver", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
    if (percentage >= 50) return { label: "Bronze", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" };
    return { label: "Try Again", color: "bg-muted text-muted-foreground" };
  };

  if (authLoading || competitionLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!competition) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t("competitionNotFound")}</h2>
              <p className="text-muted-foreground mb-6">{t("competitionNotFoundDesc")}</p>
              <Button onClick={() => setLocation("/competitions")}>
                {t("backToCompetitions")}
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {quizState === "intro" && (
            <Card>
              <CardHeader className="text-center pb-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{competition.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-center text-muted-foreground">
                  {competition.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{competition.questionCount}</p>
                    <p className="text-sm text-muted-foreground">{t("questions")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-secondary" />
                    <p className="text-2xl font-bold">{competition.estimatedMinutes}</p>
                    <p className="text-sm text-muted-foreground">{t("minutes")}</p>
                  </div>
                </div>

                {competition.prizeDescription && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                    <Medal className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-semibold text-primary">{competition.prizeDescription}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setLocation("/competitions")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("back")}
                  </Button>
                  <Button className="flex-1" onClick={handleStartQuiz} data-testid="button-start-quiz">
                    {t("startQuiz")}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {quizState === "playing" && (
            <>
              {questionsLoading ? (
                <Card>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <Skeleton key={i} className="h-12 w-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : questions && questions.length > 0 ? (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">
                        {t("questionOf")} {currentQuestion + 1} {t("of")} {questions.length}
                      </Badge>
                      <Badge variant="secondary">
                        {calculateCorrectAnswers()} {t("correct")}
                      </Badge>
                    </div>
                    <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h2 className="text-xl font-semibold" data-testid="text-question">
                      {questions[currentQuestion].question}
                    </h2>
                    
                    <div className="space-y-3">
                      {(questions[currentQuestion].options as string[]).map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === questions[currentQuestion].correctAnswer;
                        const showCorrect = showFeedback && isCorrect;
                        const showWrong = showFeedback && isSelected && !isCorrect;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectAnswer(index)}
                            disabled={showFeedback}
                            className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-3 ${
                              showCorrect
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : showWrong
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                            data-testid={`option-${index}`}
                          >
                            <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              showCorrect
                                ? "bg-green-500 text-white"
                                : showWrong
                                ? "bg-red-500 text-white"
                                : isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}>
                              {showCorrect ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : showWrong ? (
                                <XCircle className="h-5 w-5" />
                              ) : (
                                String.fromCharCode(65 + index)
                              )}
                            </span>
                            <span className="flex-1">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 pt-4">
                      {!showFeedback ? (
                        <Button 
                          className="w-full" 
                          onClick={handleConfirmAnswer}
                          disabled={selectedAnswer === null}
                          data-testid="button-confirm-answer"
                        >
                          {t("confirmAnswer")}
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={handleNextQuestion}
                          data-testid="button-next-question"
                        >
                          {currentQuestion < questions.length - 1 ? t("nextQuestion") : t("finishQuiz")}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Target className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">{t("noQuestionsAvailable")}</h2>
                    <p className="text-muted-foreground mb-6">{t("noQuestionsDesc")}</p>
                    <Button onClick={() => setLocation("/competitions")}>
                      {t("backToCompetitions")}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {quizState === "results" && questions && (
            <Card>
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mx-auto">
                  <Trophy className="h-10 w-10 text-primary" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t("quizComplete")}</h2>
                  <p className="text-muted-foreground">{competition.title}</p>
                </div>

                <div className="py-6">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {getScorePercentage()}%
                  </div>
                  <Badge className={getScoreBadge(getScorePercentage()).color}>
                    {getScoreBadge(getScorePercentage()).label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">{calculateScore()}</p>
                    <p className="text-sm text-muted-foreground">{t("totalPointsEarned")}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold">{calculateCorrectAnswers()}/{questions.length}</p>
                    <p className="text-sm text-muted-foreground">{t("correctAnswers")}</p>
                  </div>
                </div>

                {competition.prizeDescription && getScorePercentage() >= 50 && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Medal className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Congratulations! {competition.prizeDescription}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleStartQuiz}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("tryAgain")}
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => setLocation("/competitions")}
                  >
                    {t("moreQuizzes")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
