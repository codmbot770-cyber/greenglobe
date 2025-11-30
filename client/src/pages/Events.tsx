import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
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
  Loader2,
  ArrowRight
} from "lucide-react";
import type { Event, EventRegistration } from "@shared/schema";

import beachCleanupImg from "@assets/stock_images/beach_cleanup_volunt_c6de985f.jpg";
import treePlantingImg from "@assets/stock_images/tree_planting_refore_abf1cea0.jpg";
import wildlifeImg from "@assets/stock_images/birdwatching_wildlif_7096d9cc.jpg";
import educationImg from "@assets/stock_images/environmental_educat_65329b06.jpg";
import awarenessImg from "@assets/stock_images/nature_hiking_trail__73e64e09.jpg";
import coastalCleanupImg from "@assets/stock_images/coastal_ocean_cleanu_66ff535c.jpg";
import forestImg from "@assets/stock_images/forest_reforestation_1c933e07.jpg";
import birdSanctuaryImg from "@assets/stock_images/wildlife_bird_sanctu_8535c03c.jpg";
import workshopImg from "@assets/stock_images/eco_workshop_classro_8e5b0127.jpg";
import riverCleanupImg from "@assets/stock_images/river_cleanup_water__b93f32a5.jpg";
import communityGardenImg from "@assets/stock_images/urban_community_gard_0efa8824.jpg";
import mountainHikingImg from "@assets/stock_images/mountain_hiking_natu_be5ae251.jpg";
import recyclingImg from "@assets/stock_images/recycling_sustainabi_b0971641.jpg";
import solarEnergyImg from "@assets/stock_images/solar_energy_renewab_84102c5e.jpg";
import wetlandImg from "@assets/stock_images/wetland_conservation_62b5a71a.jpg";
import natureCleanup1Img from "@assets/stock_images/nature_conservation__e3a9b41f.jpg";
import natureCleanup2Img from "@assets/stock_images/nature_conservation__47abb51f.jpg";
import natureCleanup3Img from "@assets/stock_images/nature_conservation__28708db9.jpg";
import envCleanup1Img from "@assets/stock_images/environmental_cleanu_5b46db87.jpg";
import envCleanup2Img from "@assets/stock_images/environmental_cleanu_82aa15a5.jpg";
import envCleanup3Img from "@assets/stock_images/environmental_cleanu_6c45cbc6.jpg";

const categoryIcons: Record<string, typeof TreePine> = {
  "Tree Planting": TreePine,
  "Beach Cleanup": Droplets,
  "Wildlife": Bird,
  "Education": Users,
  "Awareness": Leaf,
};

const categoryImages: Record<string, string> = {
  "Tree Planting": treePlantingImg,
  "Beach Cleanup": beachCleanupImg,
  "Wildlife": wildlifeImg,
  "Education": educationImg,
  "Awareness": awarenessImg,
};

const eventImages: Record<number, string> = {
  1: natureCleanup1Img,
  2: forestImg,
  3: birdSanctuaryImg,
  4: workshopImg,
  5: mountainHikingImg,
  6: envCleanup1Img,
  7: communityGardenImg,
  8: solarEnergyImg,
  9: wetlandImg,
  10: recyclingImg,
  11: natureCleanup2Img,
  12: treePlantingImg,
};

export default function Events() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPastEvents, setShowPastEvents] = useState(false);

  const categories = [
    { value: "all", labelKey: "allCategories" as const },
    { value: "Tree Planting", labelKey: "treePlanting" as const },
    { value: "Beach Cleanup", labelKey: "beachCleanup" as const },
    { value: "Wildlife", labelKey: "wildlife" as const },
    { value: "Education", labelKey: "educationCat" as const },
    { value: "Awareness", labelKey: "awareness" as const },
  ];

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
        title: t("registrationSuccessful"),
        description: t("registeredForEvent"),
      });
    },
    onError: () => {
      toast({
        title: t("registrationFailed"),
        description: t("registrationError"),
        variant: "destructive",
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await apiRequest("DELETE", `/api/user/registrations/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/registrations"] });
      toast({
        title: t("unregistrationSuccessful"),
        description: t("unregisteredFromEvent"),
      });
    },
    onError: () => {
      toast({
        title: t("unregistrationFailed"),
        description: t("unregistrationError"),
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
    const eventImage = eventImages[event.id] || categoryImages[event.category] || awarenessImg;
    const registered = isRegistered(event.id);
    const isRegistering = registerMutation.isPending;
    const isUnregistering = unregisterMutation.isPending;
    
    return (
      <Card 
        className={`group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 card-hover-lift ${isPast ? 'opacity-75' : ''}`}
        data-testid={`card-event-${event.id}`}
      >
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <div className="aspect-[16/9] relative">
              <img 
                src={eventImage} 
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-lg p-2 text-center min-w-[60px] transition-transform duration-300 group-hover:scale-105">
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
                <Badge variant="secondary" className="backdrop-blur-sm">{t("pastEvent")}</Badge>
              </div>
            )}
            {registered && !isPast && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-600/90 backdrop-blur-sm text-white gap-1 shadow-lg">
                  <CheckCircle className="h-3 w-3" />
                  {t("registered")}
                </Badge>
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm gap-1 shadow-md">
                <CategoryIcon className="h-3 w-3" />
                {event.category}
              </Badge>
            </div>
          </div>
          
          <div className="p-5 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {event.title}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
            
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 shrink-0 text-primary" />
                <span>{formatDate(event.eventDate)} at {formatTime(event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-secondary" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
            
            {!isPast && (
              <div className="pt-3">
                {isAuthenticated ? (
                  registered ? (
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 group/btn"
                      onClick={() => unregisterMutation.mutate(event.id)}
                      disabled={isUnregistering}
                      data-testid={`button-unregister-event-${event.id}`}
                    >
                      {isUnregistering ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("cancelling")}
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          {t("registered")} - {t("clickToCancel")}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gap-2 group/btn btn-glow" 
                      onClick={() => registerMutation.mutate(event.id)}
                      disabled={isRegistering}
                      data-testid={`button-register-event-${event.id}`}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t("registering")}
                        </>
                      ) : (
                        <>
                          {t("registerForEvent")}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                        </>
                      )}
                    </Button>
                  )
                ) : (
                  <a href="/api/login" className="block">
                    <Button variant="outline" className="w-full gap-2 group/btn btn-glow">
                      {t("signInToRegister")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
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
        <section className="py-12 sm:py-16 bg-gradient-to-br from-rose-100/70 via-orange-50/50 to-amber-100/60 dark:from-rose-950/40 dark:via-orange-950/30 dark:to-amber-950/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-orange-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-400/15 to-red-500/15 rounded-full blur-2xl" />
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-500/20 px-5 py-2.5 text-sm font-medium text-rose-700 dark:text-rose-300 mb-6 animate-fade-in border border-rose-300/30 dark:border-rose-700/30 shadow-lg shadow-rose-500/10" style={{ opacity: 0 }}>
                <CalendarIcon className="h-4 w-4 animate-pulse" />
                <span>{t("joinEnvironmentalActivities")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-events-title">
                <span className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">{t("eventsPageTitle")}</span> {t("ecoEventsInAzerbaijan")}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                {t("eventsHeroDesc")}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b bg-gradient-to-r from-rose-50/80 via-orange-50/60 to-amber-50/80 dark:from-rose-950/30 dark:via-orange-950/20 dark:to-amber-950/30 sticky top-16 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                <Input
                  placeholder={t("searchEventsPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-rose-200/50 dark:border-rose-800/50 focus:border-rose-400"
                  data-testid="input-search-events"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px] border-orange-200/50 dark:border-orange-800/50" data-testid="select-category">
                  <Filter className="h-4 w-4 mr-2 text-orange-500" />
                  <SelectValue placeholder={t("category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {t(category.labelKey)}
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
              <h2 className="text-2xl font-bold mb-2">{t("upcomingEvents")}</h2>
              <p className="text-muted-foreground">
                {upcomingEvents.length} {t("eventsScheduled")}
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
                  <h3 className="text-xl font-semibold mb-2">{t("noUpcomingEvents")}</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== "all" 
                      ? t("noEventsMatchCriteria")
                      : t("checkBackSoon")}
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
                      {showPastEvents ? t("hidePastEvents") : t("showPastEvents")} ({pastEvents.length})
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
