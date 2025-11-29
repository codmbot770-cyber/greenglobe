import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
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
  Clock
} from "lucide-react";
import type { UserScore, EventRegistration, Competition, Event } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage 
                      src={user?.profileImageUrl || undefined} 
                      alt={user?.firstName || "User"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials(user?.firstName, user?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold" data-testid="text-dashboard-name">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground" data-testid="text-dashboard-email">
                    {user?.email}
                  </p>
                  <Badge className="mt-3" variant="secondary">
                    Eco Warrior
                  </Badge>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Total Points
                    </span>
                    <span className="font-semibold text-primary">{totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Quizzes Taken
                    </span>
                    <span className="font-semibold">{completedQuizzes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Avg. Score
                    </span>
                    <span className="font-semibold">{averageScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Events Joined
                    </span>
                    <span className="font-semibold">{registrations?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { name: "First Quiz", icon: Star, unlocked: completedQuizzes >= 1 },
                      { name: "Quiz Master", icon: Trophy, unlocked: completedQuizzes >= 5 },
                      { name: "High Scorer", icon: Medal, unlocked: averageScore >= 80 },
                      { name: "Event Joiner", icon: Calendar, unlocked: (registrations?.length || 0) >= 1 },
                    ].map((achievement, i) => (
                      <div 
                        key={i}
                        className={`p-4 rounded-lg text-center border ${
                          achievement.unlocked 
                            ? 'bg-primary/5 border-primary/20' 
                            : 'bg-muted/30 border-transparent opacity-50'
                        }`}
                      >
                        <achievement.icon className={`h-8 w-8 mx-auto mb-2 ${
                          achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <p className="text-sm font-medium">{achievement.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Competition History */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Competition History
                  </CardTitle>
                  <Link href="/competitions">
                    <Button variant="outline" size="sm">View All</Button>
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
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              percentage >= 90 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                              percentage >= 70 ? 'bg-gray-100 dark:bg-gray-800' :
                              percentage >= 50 ? 'bg-orange-100 dark:bg-orange-900/30' :
                              'bg-muted'
                            }`}>
                              <Medal className={`h-5 w-5 ${getScoreColor(percentage)}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {competition?.title || `Competition #${score.competitionId}`}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDate(score.completedAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${getScoreColor(percentage)}`}>
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
                      <p className="text-muted-foreground mb-4">No competitions completed yet</p>
                      <Link href="/competitions">
                        <Button>Take Your First Quiz</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event Registrations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    Registered Events
                  </CardTitle>
                  <Link href="/events">
                    <Button variant="outline" size="sm">Browse Events</Button>
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
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                          >
                            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {event?.title || `Event #${reg.eventId}`}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {event?.location}
                              </p>
                            </div>
                            {event && (
                              <Badge variant={event.isPast ? "secondary" : "outline"}>
                                {event.isPast ? "Completed" : formatDate(event.eventDate)}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground mb-4">No events registered yet</p>
                      <Link href="/events">
                        <Button variant="secondary">Browse Events</Button>
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
