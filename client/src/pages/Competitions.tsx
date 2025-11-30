import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n";
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
  Play,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";
import type { Competition, UserScore, User } from "@shared/schema";

import biodiversityImg from "@assets/stock_images/birdwatching_wildlif_7096d9cc.jpg";
import caspianImg from "@assets/stock_images/caspian_sea_azerbaij_4431da8e.jpg";
import climateImg from "@assets/stock_images/climate_change_globa_29918192.jpg";
import forestImg from "@assets/stock_images/forest_conservation__cbc0a547.jpg";
import wildlifeImg from "@assets/stock_images/wildlife_protection__b4061850.jpg";
import renewableImg from "@assets/stock_images/renewable_energy_sol_202bbb8c.jpg";
import oceanImg from "@assets/stock_images/water_conservation_r_1aab0f53.jpg";
import sustainableImg from "@assets/stock_images/sustainable_living_e_d6e3e80f.jpg";

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  Hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const competitionImages: Record<number, string> = {
  1: biodiversityImg,
  2: caspianImg,
  3: climateImg,
  4: forestImg,
  5: wildlifeImg,
  6: renewableImg,
  7: oceanImg,
  8: sustainableImg,
};

type LeaderboardEntry = {
  userId: string;
  totalScore: number;
  quizCount: number;
};

export default function Competitions() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const { data: competitions, isLoading } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: userScores } = useQuery<UserScore[]>({
    queryKey: ["/api/user/scores"],
    enabled: isAuthenticated,
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
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

  const howItWorksSteps = [
    { step: 1, textKey: "step1" as const },
    { step: 2, textKey: "step2" as const },
    { step: 3, textKey: "step3" as const },
    { step: 4, textKey: "step4" as const },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-gradient-to-br from-indigo-100/80 via-violet-50/50 to-purple-100/60 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-purple-950/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-violet-500/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-gradient-to-br from-violet-400/15 to-indigo-500/15 rounded-full blur-2xl" />
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 px-5 py-2.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-6 animate-fade-in border border-indigo-300/30 dark:border-indigo-700/30 shadow-lg shadow-indigo-500/10" style={{ opacity: 0 }}>
                <Trophy className="h-4 w-4 animate-pulse" />
                <span>{t("environmentalKnowledgeChallenge")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-competitions-title">
                {t("testYourEcoKnowledge")} <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent">{t("ecoKnowledge")}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                {t("competitionsHeroDesc")}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{t("availableCompetitions")}</h2>
                <Badge variant="outline" className="gap-1">
                  <Leaf className="h-3 w-3" />
                  {competitions?.filter(c => c.isActive).length || 0} {t("active")}
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
                <div className="grid sm:grid-cols-2 gap-6">
                  {competitions.map((competition) => {
                    const userScore = getCompetitionScore(competition.id);
                    const isCompleted = !!userScore;
                    const competitionImage = competitionImages[competition.id] || biodiversityImg;
                    
                    return (
                      <Card 
                        key={competition.id} 
                        className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!competition.isActive ? 'opacity-60' : ''}`}
                        data-testid={`card-competition-${competition.id}`}
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <div className="aspect-[16/9] relative">
                              <img 
                                src={competitionImage} 
                                alt={competition.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge 
                                className={`${difficultyColors[competition.difficulty] || difficultyColors.Medium} shadow-lg`}
                              >
                                {competition.difficulty}
                              </Badge>
                            </div>
                            {isCompleted && (
                              <div className="absolute top-3 left-3">
                                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm gap-1 shadow-md">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {userScore.score}/{userScore.totalQuestions * 10}
                                </Badge>
                              </div>
                            )}
                            <div className="absolute bottom-3 left-3 right-3">
                              <h3 className="font-bold text-lg text-white drop-shadow-lg line-clamp-2">
                                {competition.title}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="p-5 space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {competition.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Target className="h-4 w-4 text-primary" />
                                {competition.questionCount} {t("questions")}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4 text-secondary" />
                                {competition.estimatedMinutes} {t("minutes")}
                              </span>
                            </div>
                            
                            {competition.prizeDescription && (
                              <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                                <Gift className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium text-primary">
                                  {t("winEcoMerchandise")}
                                </span>
                              </div>
                            )}
                            
                            <Button 
                              className="w-full gap-2 group/btn btn-glow" 
                              onClick={() => handleStartQuiz(competition)}
                              disabled={!competition.isActive}
                              data-testid={`button-start-quiz-${competition.id}`}
                            >
                              <Play className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                              {isCompleted ? t("retakeQuiz") : t("startQuiz")}
                              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("noCompetitionsMessage")}</h3>
                    <p className="text-muted-foreground">
                      {t("noCompetitionsMessage")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-primary" />
                    {t("topParticipants")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {leaderboardLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-4 w-12" />
                        </div>
                      ))}
                    </>
                  ) : leaderboard && leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                      <div 
                        key={entry.userId}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-sm"
                      >
                        <div className={`
                          h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 group-hover:scale-110
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                          ${index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : ''}
                          ${index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                          ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
                        `}>
                          {index < 3 ? (
                            <Medal className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate transition-colors duration-300 group-hover:text-primary">
                            {user?.id === entry.userId ? t("you") : `${t("participant")} ${index + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.quizCount} {entry.quizCount !== 1 ? t("quizzes") : t("quiz")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary transition-transform duration-300 group-hover:scale-110">{entry.totalScore.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{t("points")}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Users className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground">{t("noParticipantsYet")}</p>
                      <p className="text-xs text-muted-foreground">{t("beTheFirst")}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 transition-all duration-500 hover:shadow-lg hover:border-primary/40">
                <CardHeader>
                  <CardTitle className="text-lg">{t("howItWorks")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {howItWorksSteps.map((item) => (
                    <div key={item.step} className="flex items-start gap-3 group cursor-pointer transition-all duration-300 hover:translate-x-1">
                      <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{t(item.textKey)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="h-5 w-5 text-secondary" />
                    {t("prizeCategories")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md hover:border-yellow-400 group">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-yellow-700 dark:group-hover:text-yellow-400">{t("gold")}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md hover:border-gray-400 group">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">{t("silver")}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-md hover:border-orange-400 group">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-orange-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />
                      <span className="font-medium transition-colors duration-300 group-hover:text-orange-700 dark:group-hover:text-orange-400">{t("bronze")}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
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
