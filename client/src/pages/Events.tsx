import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
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
  Leaf
} from "lucide-react";
import type { Event } from "@shared/schema";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

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
    
    return (
      <Card 
        className={`hover-elevate overflow-visible ${isPast ? 'opacity-75' : ''}`}
        data-testid={`card-event-${event.id}`}
      >
        <CardContent className="p-0">
          {/* Date Badge */}
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
                  <Button className="w-full" data-testid={`button-register-event-${event.id}`}>
                    Register for Event
                  </Button>
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
        {/* Hero Section */}
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

        {/* Filters */}
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

        {/* Events Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Upcoming Events */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <Badge variant="secondary">{upcomingEvents.length}</Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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
                      : "New events will be added soon. Check back later!"}
                  </p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <Collapsible open={showPastEvents} onOpenChange={setShowPastEvents}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full gap-2 mb-6">
                  <ChevronDown className={`h-4 w-4 transition-transform ${showPastEvents ? 'rotate-180' : ''}`} />
                  Past Events ({pastEvents.length})
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
          )}
        </div>

        {/* Join CTA */}
        <section className="py-16 bg-card border-t">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 border-secondary/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Want to Organize an Event?</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Have an idea for an environmental activity in your community? 
                  We'd love to help you organize and promote it!
                </p>
                <a href="/api/login">
                  <Button size="lg" variant="secondary" className="min-w-[200px]">
                    Get in Touch
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
