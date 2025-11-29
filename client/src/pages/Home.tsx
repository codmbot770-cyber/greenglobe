import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Trophy, 
  Calendar, 
  Medal,
  ArrowRight,
  Target,
  Clock,
  MapPin,
  Sparkles
} from "lucide-react";
import type { Competition, Event, UserScore } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: competitions } = useQuery<Competition[]>({
    queryKey: ["/api/competitions"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: userScores } = useQuery<UserScore[]>({
    queryKey: ["/api/user/scores"],
  });

  const upcomingEvents = events?.filter(e => !e.isPast).slice(0, 3) || [];
  const activeCompetitions = competitions?.filter(c => c.isActive).slice(0, 3) || [];
  const recentScores = userScores?.slice(0, 3) || [];

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Welcome Section */}
        <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-welcome">
                  Welcome back, {user?.firstName || "Eco Warrior"}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Continue your journey to protect Azerbaijan's environment
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/competitions">
                  <Button className="gap-2">
                    <Trophy className="h-4 w-4" />
                    Take a Quiz
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Active Competitions */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Active Competitions</h2>
                  </div>
                  <Link href="/competitions">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {activeCompetitions.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCompetitions.map((competition) => (
                      <Card key={competition.id} className="hover-elevate">
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-2">{competition.title}</h3>
                            <Badge variant="secondary" className="shrink-0">
                              {competition.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {competition.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {competition.questionCount} questions
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {competition.estimatedMinutes} min
                            </span>
                          </div>
                          <Link href={`/competitions/${competition.id}`}>
                            <Button size="sm" className="w-full mt-2">
                              Start Quiz
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No active competitions at the moment</p>
                      <p className="text-sm text-muted-foreground mt-1">Check back soon for new challenges!</p>
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* Upcoming Events */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  </div>
                  <Link href="/events">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="hover-elevate">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-secondary/10 flex flex-col items-center justify-center">
                              <span className="text-xs font-medium text-secondary uppercase">
                                {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span className="text-lg font-bold text-secondary">
                                {new Date(event.eventDate).getDate()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold">{event.title}</h3>
                                <Badge variant="outline">{event.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No upcoming events scheduled</p>
                      <p className="text-sm text-muted-foreground mt-1">Stay tuned for new environmental activities!</p>
                    </CardContent>
                  </Card>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentScores.length > 0 ? (
                    <>
                      {recentScores.map((score, index) => (
                        <div key={score.id} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Medal className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Competition #{score.competitionId}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(score.completedAt!)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {score.score}/{score.totalQuestions * 10}
                          </Badge>
                        </div>
                      ))}
                      <Link href="/dashboard">
                        <Button variant="outline" size="sm" className="w-full">
                          View All Results
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No completed competitions yet</p>
                      <Link href="/competitions">
                        <Button size="sm" className="mt-3">
                          Start Your First Quiz
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/competitions" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Trophy className="h-4 w-4" />
                      Take a Quiz
                    </Button>
                  </Link>
                  <Link href="/events" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      Register for Event
                    </Button>
                  </Link>
                  <Link href="/about" className="block">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      Learn About Us
                    </Button>
                  </Link>
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
