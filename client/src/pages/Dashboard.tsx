import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Trophy, 
  Calendar, 
  Medal,
  Star,
  Target,
  TrendingUp,
  Award,
  Clock,
  Zap,
  Heart,
  Shield,
  Leaf
} from "lucide-react";
import type { UserScore, EventRegistration, Competition, Event, Problem } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: t("unauthorized"),
        description: t("loggedOutMessage"),
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast, t]);

  const { data: userScores, isLoading: scoresLoading } = useQuery<UserScore[]>({
    queryKey: ["/api/user/scores"],
    enabled: isAuthenticated,
  });

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
    enabled: isAuthenticated,
  });

  const { data: registrations } = useQuery<EventRegistration[]>({
    queryKey: ["/api/user/registrations"],
    enabled: isAuthenticated,
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    enabled: isAuthenticated,
  });

  const { data: userProblems } = useQuery<Problem[]>({
    queryKey: ["/api/user/problems"],
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 rounded-lg" />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getCompetitionById = (id: number) => competitions?.find(c => c.id === id);
  const getEventById = (id: number) => events?.find(e => e.id === id);

  const totalScore = userScores?.reduce((sum, s) => sum + s.score, 0) || 0;
  const completedQuizzes = userScores?.length || 0;
  const averageScore = completedQuizzes > 0 
    ? Math.round(userScores!.reduce((sum, s) => sum + (s.score / (s.totalQuestions * 10)) * 100, 0) / completedQuizzes)
    : 0;
  const problemsReported = userProblems?.length || 0;
  const hasPerfectScore = userScores?.some(s => s.score === s.totalQuestions * 10) || false;

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-yellow-600 dark:text-yellow-400";
    if (percentage >= 70) return "text-gray-500 dark:text-gray-400";
    if (percentage >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-muted-foreground";
  };

  const achievements = [
    { nameKey: "firstQuiz" as const, descKey: "completeFirstQuiz" as const, icon: Star, unlocked: completedQuizzes >= 1 },
    { nameKey: "quizMaster" as const, descKey: "completeFiveQuizzes" as const, icon: Trophy, unlocked: completedQuizzes >= 5 },
    { nameKey: "highScorer" as const, descKey: "averageScore80" as const, icon: Medal, unlocked: averageScore >= 80 },
    { nameKey: "perfectScore" as const, descKey: "score100" as const, icon: Zap, unlocked: hasPerfectScore },
    { nameKey: "eventJoiner" as const, descKey: "registerForAnEvent" as const, icon: Calendar, unlocked: (registrations?.length || 0) >= 1 },
    { nameKey: "communityHelper" as const, descKey: "reportAProblem" as const, icon: Shield, unlocked: problemsReported >= 1 },
    { nameKey: "ecoChampion" as const, descKey: "score500Points" as const, icon: Leaf, unlocked: totalScore >= 500 },
    { nameKey: "natureLover" as const, descKey: "join3Events" as const, icon: Heart, unlocked: (registrations?.length || 0) >= 3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="transition-all duration-500 hover:shadow-xl group">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ring-4 ring-transparent group-hover:ring-primary/20">
                    <AvatarImage 
                      src={user?.profileImageUrl || undefined} 
                      alt={user?.firstName || "User"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold transition-colors duration-300 group-hover:text-primary" data-testid="text-dashboard-name">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground" data-testid="text-dashboard-email">
                    {user?.email}
                  </p>
                  <Badge className="mt-3 transition-all duration-300 group-hover:scale-105" variant="secondary">
                    {t("ecoWarrior")}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="transition-all duration-500 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("quickStats")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 p-1 rounded hover:bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Trophy className="h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                      {t("totalPoints")}
                    </span>
                    <span className="font-semibold text-primary transition-transform duration-300 group-hover:scale-110">{totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 p-1 rounded hover:bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:text-primary" />
                      {t("quizzesTaken")}
                    </span>
                    <span className="font-semibold transition-transform duration-300 group-hover:scale-110">{completedQuizzes}</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 p-1 rounded hover:bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                      {t("avgScore")}
                    </span>
                    <span className="font-semibold transition-transform duration-300 group-hover:scale-110">{averageScore}%</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 p-1 rounded hover:bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:text-secondary" />
                      {t("eventsJoined")}
                    </span>
                    <span className="font-semibold transition-transform duration-300 group-hover:scale-110">{registrations?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:translate-x-1 p-1 rounded hover:bg-muted/30">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                      {t("problemsReported")}
                    </span>
                    <span className="font-semibold transition-transform duration-300 group-hover:scale-110">{problemsReported}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    {t("achievements")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {achievements.map((achievement, i) => (
                      <div 
                        key={i}
                        className={`p-4 rounded-lg text-center border transition-all duration-500 cursor-pointer group ${
                          achievement.unlocked 
                            ? 'bg-primary/5 border-primary/20 hover:border-primary/50 hover:shadow-lg hover:-translate-y-2 hover:bg-primary/10' 
                            : 'bg-muted/30 border-transparent opacity-50 hover:opacity-70'
                        }`}
                        title={t(achievement.descKey)}
                      >
                        <achievement.icon className={`h-8 w-8 mx-auto mb-2 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 ${
                          achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <p className="text-sm font-medium transition-colors duration-300 group-hover:text-primary">{t(achievement.nameKey)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t(achievement.descKey)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    {t("competitionHistory")}
                  </CardTitle>
                  <Link href="/competitions">
                    <Button variant="outline" size="sm">{t("viewAll")}</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {scoresLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : userScores && userScores.length > 0 ? (
                    <div className="space-y-3">
                      {userScores.slice(0, 5).map((score) => {
                        const competition = getCompetitionById(score.competitionId);
                        const percentage = Math.round((score.score / (score.totalQuestions * 10)) * 100);
                        
                        return (
                          <div 
                            key={score.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 cursor-pointer group hover:shadow-md hover:-translate-x-1"
                          >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                              percentage >= 90 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                              percentage >= 70 ? 'bg-gray-100 dark:bg-gray-800' :
                              percentage >= 50 ? 'bg-orange-100 dark:bg-orange-900/30' :
                              'bg-muted'
                            }`}>
                              <Medal className={`h-5 w-5 transition-transform duration-300 group-hover:rotate-12 ${getScoreColor(percentage)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate transition-colors duration-300 group-hover:text-primary">
                                {competition?.title || `Competition #${score.competitionId}`}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                                {formatDate(score.completedAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold transition-transform duration-300 group-hover:scale-110 ${getScoreColor(percentage)}`}>
                                {percentage}%
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {score.score}/{score.totalQuestions * 10}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground mb-4">{t("noCompetitionsYet")}</p>
                      <Link href="/competitions">
                        <Button>{t("takeFirstQuiz")}</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    {t("registeredEvents")}
                  </CardTitle>
                  <Link href="/events">
                    <Button variant="outline" size="sm">{t("browseEvents")}</Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {registrations && registrations.length > 0 ? (
                    <div className="space-y-3">
                      {registrations.slice(0, 5).map((reg) => {
                        const event = getEventById(reg.eventId);
                        
                        return (
                          <div 
                            key={reg.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 transition-all duration-300 cursor-pointer group hover:bg-muted/50 hover:shadow-md hover:-translate-x-1"
                          >
                            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary/20">
                              <Calendar className="h-5 w-5 text-secondary transition-transform duration-300 group-hover:rotate-12" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate transition-colors duration-300 group-hover:text-secondary">
                                {event?.title || `Event #${reg.eventId}`}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {event?.location}
                              </p>
                            </div>
                            {event && (
                              <Badge variant={event.isPast ? "secondary" : "outline"} className="transition-all duration-300 group-hover:scale-105">
                                {event.isPast ? t("completed") : formatDate(event.eventDate)}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground mb-4">{t("noEventsYet")}</p>
                      <Link href="/events">
                        <Button variant="secondary">{t("browseEvents")}</Button>
                      </Link>
                    </div>
                  )}
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
