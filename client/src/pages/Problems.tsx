import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Construction, 
  Bell, 
  MapPin, 
  Camera, 
  MessageSquare,
  Shield,
  ArrowRight
} from "lucide-react";

const plannedFeatures = [
  {
    icon: MapPin,
    title: "Location-Based Reporting",
    description: "Pin environmental issues on an interactive map of Azerbaijan",
  },
  {
    icon: Camera,
    title: "Photo Documentation",
    description: "Upload photos to document environmental problems in your area",
  },
  {
    icon: MessageSquare,
    title: "Community Discussion",
    description: "Discuss issues and solutions with other environmentally-conscious citizens",
  },
  {
    icon: Shield,
    title: "Authority Notification",
    description: "Reports will be forwarded to relevant environmental authorities",
  },
];

export default function Problems() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-accent/20" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%22.03%22%3E%3Cpath%20d%3D%22M0%200h20L0%2020z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Coming Soon Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground mb-8">
                <Construction className="h-4 w-4" />
                <span>Coming Soon</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-problems-title">
                Report Environmental <span className="text-primary">Problems</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10">
                We're building a powerful tool for citizens to report and track environmental 
                issues across Azerbaijan. Help us protect our natural heritage by documenting 
                problems in your community.
              </p>
              
              {/* Illustration */}
              <div className="relative w-48 h-48 mx-auto mb-10">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Construction className="h-20 w-20 text-primary/50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Planned Features */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">What to Expect</h2>
              <p className="text-muted-foreground">
                Here's what we're working on for the Problems section
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plannedFeatures.map((feature, index) => (
                <Card key={index} className="text-center border-dashed">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-muted mx-auto">
                      <feature.icon className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-primary/20">
              <CardContent className="p-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-6">
                  <Bell className="h-7 w-7 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Get Notified When It Launches</h2>
                <p className="text-muted-foreground mb-8">
                  Be the first to know when the Problems section goes live. 
                  We'll send you an email when it's ready.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    data-testid="input-notify-email"
                  />
                  <Button type="submit" className="gap-2" data-testid="button-notify-submit">
                    Notify Me
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
                
                <p className="text-xs text-muted-foreground mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Other Ways to Help */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">In the Meantime...</h2>
              <p className="text-muted-foreground mb-8">
                While we're building this feature, there are other ways you can contribute 
                to environmental protection in Azerbaijan.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/competitions">
                  <Button variant="outline" size="lg" className="min-w-[180px]">
                    Take a Quiz
                  </Button>
                </a>
                <a href="/events">
                  <Button size="lg" className="min-w-[180px]">
                    Join an Event
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
