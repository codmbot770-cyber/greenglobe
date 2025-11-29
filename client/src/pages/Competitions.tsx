import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, 
  Target,
  Clock,
  Gift,
  Award,
  Medal,
  Star,
  ChevronRight,
  Leaf,
  Play
} from "lucide-react";
import type { Competition, UserScore } from "@shared/schema";

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const mockLeaderboard = [
  { rank: 1, name: "Kamran H.", score: 2850, competitions: 12 },
  { rank: 2, name: "Nigar A.", score: 2720, competitions: 11 },
  { rank: 3, name: "Elchin M.", score: 2680, competitions: 10 },
  { rank: 4, name: "Aygun K.", score: 2540, competitions: 9 },
  { rank: 5, name: "Farid O.", score: 2490, competitions: 11 },
];

export default function Competitions() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: userScores } = useQuery<UserScore[]>({
    queryKey: ["/api/user/scores"],
    enabled: isAuthenticated,
  });

  const getCompetitionScore = (competitionId: number) => {
    return userScores?.find(s => s.competitionId === competitionId);
  };

  const handleStartQuiz = (competition: Competition) => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    setLocation(`/competitions/${competition.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Trophy className="h-4 w-4" />
                <span>Environmental Knowledge Challenge</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" data-testid="text-competitions-title">
                Test Your <span className="text-primary">Eco Knowledge</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Take part in our environmental quizzes, learn about Azerbaijan's ecosystems, 
                and win exciting prizes! The more you know, the more you can help protect our nature.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Competitions Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Available Competitions</h2>
                <Badge variant="outline" className="gap-1">
                  <Leaf className="h-3 w-3" />
                  {competitions?.filter(c => c.isActive).length || 0} Active
                </Badge>
              </div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-10 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : competitions && competitions.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {competitions.map((competition) => {
                    const userScore = getCompetitionScore(competition.id);
                    const isCompleted = !!userScore;
                    
                    return (
                      <Card 
                        key={competition.id} 
                        className={`hover-elevate ${!competition.isActive ? 'opacity-60' : ''}`}
                        data-testid={`card-competition-${competition.id}`}
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg line-clamp-2">{competition.title}</h3>
                            <Badge 
                              className={difficultyColors[competition.difficulty] || difficultyColors.Medium}
                            >
                              {competition.difficulty}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {competition.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Target className="h-4 w-4" />
                              {competition.questionCount} questions
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {competition.estimatedMinutes} min
                            </span>
                          </div>
                          
                          {competition.prizeDescription && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                              <Gift className="h-4 w-4 text-primary shrink-0" />
                              <span className="text-sm font-medium text-primary">
                                {competition.prizeDescription}
                              </span>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                              <span className="text-sm text-muted-foreground">Your Score</span>
                              <Badge variant="secondary" className="gap-1">
                                <Star className="h-3 w-3" />
                                {userScore.score}/{userScore.totalQuestions * 10}
                              </Badge>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full gap-2" 
                            onClick={() => handleStartQuiz(competition)}
                            disabled={!competition.isActive}
                            data-testid={`button-start-quiz-${competition.id}`}
                          >
                            <Play className="h-4 w-4" />
                            {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Competitions Yet</h3>
                    <p className="text-muted-foreground">
                      New environmental quizzes will be added soon. Check back later!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-primary" />
                    Top Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockLeaderboard.map((entry, index) => (
                    <div 
                      key={entry.rank}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`
                        h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : ''}
                        ${index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                        ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {index < 3 ? (
                          <Medal className="h-4 w-4" />
                        ) : (
                          entry.rank
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.competitions} competitions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{entry.score.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, text: "Choose a quiz based on your interest" },
                    { step: 2, text: "Answer questions about environment" },
                    { step: 3, text: "Earn points for correct answers" },
                    { step: 4, text: "Win prizes based on your score!" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Prize Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="h-5 w-5 text-secondary" />
                    Prize Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Gold (90%+)</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Silver (70%+)</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Bronze (50%+)</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
