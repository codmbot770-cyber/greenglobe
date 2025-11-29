import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Calendar as CalendarIcon, 
  MapPin,
  Search,
  Filter,
  ChevronDown,
  Users,
  TreePine,
  Droplets,
  Bird,
  Leaf,
  CheckCircle,
  Loader2
} from "lucide-react";
import type { Event, EventRegistration } from "@shared/schema";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Tree Planting", label: "Tree Planting" },
  { value: "Beach Cleanup", label: "Beach Cleanup" },
  { value: "Wildlife", label: "Wildlife Conservation" },
  { value: "Education", label: "Environmental Education" },
  { value: "Awareness", label: "Awareness Campaign" },
];

const categoryIcons: Record<string, typeof TreePine> = {
  "Tree Planting": TreePine,
  "Beach Cleanup": Droplets,
  "Wildlife": Bird,
  "Education": Users,
  "Awareness": Leaf,
};

export default function Events() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: registrations } = useQuery<EventRegistration[]>({
    queryKey: ["/api/user/registrations"],
    enabled: isAuthenticated,
  });

  const registerMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("POST", "/api/user/registrations", { eventId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/registrations"] });
      toast({
        title: "Registration Successful",
        description: "You have been registered for this event!",
      });
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for the event.",
        variant: "destructive",
      });
    },
  });

  const isRegistered = (eventId: number) => {
    return registrations?.some(r => r.eventId === eventId) || false;
  };

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const upcomingEvents = filteredEvents.filter(e => !e.isPast);
  const pastEvents = filteredEvents.filter(e => e.isPast);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const EventCard = ({ event, isPast = false }: { event: Event; isPast?: boolean }) => {
    const CategoryIcon = categoryIcons[event.category] || Leaf;
    const registered = isRegistered(event.id);
    const isRegistering = registerMutation.isPending;
    
    return (
      <Card 
        className={`hover-elevate overflow-visible ${isPast ? 'opacity-75' : ''}`}
        data-testid={`card-event-${event.id}`}
      >
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-t-lg flex items-center justify-center">
              <CategoryIcon className="h-16 w-16 text-primary/30" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-background rounded-lg shadow-md p-2 text-center min-w-[60px]">
                <div className="text-xs font-semibold text-primary uppercase">
                  {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-xl font-bold">
                  {new Date(event.eventDate).getDate()}
                </div>
              </div>
            </div>
            {isPast && (
              <div className="absolute top-3 left-3">
                <Badge variant="secondary">Past Event</Badge>
              </div>
            )}
            {registered && !isPast && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-600 text-white gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Registered
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            </div>
            
            <Badge variant="outline" className="gap-1">
              <CategoryIcon className="h-3 w-3" />
              {event.category}
            </Badge>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 shrink-0" />
                <span>{formatDate(event.eventDate)} at {formatTime(event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            
            {!isPast && (
              <div className="pt-3">
                {isAuthenticated ? (
                  registered ? (
                    <Button variant="secondary" className="w-full gap-2" disabled>
                      <CheckCircle className="h-4 w-4" />
                      Already Registered
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => registerMutation.mutate(event.id)}
                      disabled={isRegistering}
                      data-testid={`button-register-event-${event.id}`}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register for Event"
                      )}
                    </Button>
                  )
                ) : (
                  <a href="/api/login" className="block">
                    <Button variant="outline" className="w-full">
                      Sign In to Register
                    </Button>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-gradient-to-br from-secondary/10 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary mb-6">
                <CalendarIcon className="h-4 w-4" />
                <span>Join Environmental Activities</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" data-testid="text-events-title">
                <span className="text-secondary">Eco Events</span> in Azerbaijan
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover and participate in environmental events happening across Azerbaijan. 
                From tree planting to beach cleanups, find activities that match your passion for nature.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b bg-card sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-events"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-category">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">
                {upcomingEvents.length} event{upcomingEvents.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-0">
                      <Skeleton className="aspect-[16/9] rounded-t-lg" />
                      <div className="p-5 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "all" 
                      ? "No events match your search criteria. Try adjusting your filters."
                      : "Check back soon for new environmental events!"}
                  </p>
                </CardContent>
              </Card>
            )}

            {pastEvents.length > 0 && (
              <div className="mt-12">
                <Collapsible open={showPastEvents} onOpenChange={setShowPastEvents}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="mb-6 gap-2">
                      <ChevronDown className={`h-4 w-4 transition-transform ${showPastEvents ? 'rotate-180' : ''}`} />
                      {showPastEvents ? 'Hide' : 'Show'} Past Events ({pastEvents.length})
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastEvents.map((event) => (
                        <EventCard key={event.id} event={event} isPast />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
