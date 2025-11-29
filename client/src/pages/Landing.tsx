import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  TreePine, 
  Users, 
  Trophy, 
  Calendar, 
  Mountain,
  Droplets,
  Bird,
  ArrowRight,
  Shield
} from "lucide-react";

const stats = [
  { icon: Calendar, value: "50+", label: "Events Hosted" },
  { icon: Users, value: "2,500+", label: "Participants" },
  { icon: TreePine, value: "10", label: "Protected Areas" },
  { icon: Trophy, value: "100+", label: "Competitions" },
];

const features = [
  {
    icon: Trophy,
    title: "Environmental Competitions",
    description: "Test your knowledge about ecology and win exciting prizes through our interactive quizzes.",
  },
  {
    icon: Calendar,
    title: "Eco Events",
    description: "Join tree planting, beach cleanups, and awareness campaigns across Azerbaijan.",
  },
  {
    icon: Shield,
    title: "Report Problems",
    description: "Help identify and report environmental issues in your community for quick action.",
  },
];

const ecosystems = [
  {
    icon: Mountain,
    title: "Caucasus Mountains",
    description: "Home to diverse wildlife including the Caucasian leopard and brown bear.",
  },
  {
    icon: Droplets,
    title: "Caspian Sea",
    description: "The world's largest enclosed body of water with unique marine species.",
  },
  {
    icon: Bird,
    title: "Migratory Birds",
    description: "Critical stopover for millions of birds traveling between Europe and Asia.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M54.627%200l.83.828-1.415%201.415L51.8%200h2.827zM5.373%200l-.83.828L5.96%202.243%208.2%200H5.374zM48.97%200l3.657%203.657-1.414%201.414L46.143%200h2.828zM11.03%200L7.372%203.657%208.787%205.07%2013.857%200H11.03zm32.284%200L49.8%206.485%2048.384%207.9l-7.9-7.9h2.83zM16.686%200L10.2%206.485%2011.616%207.9l7.9-7.9h-2.83zm20.97%200l9.315%209.314-1.414%201.414L34.828%200h2.83zM22.344%200L13.03%209.314l1.414%201.414L25.172%200h-2.83zM32%200l12.142%2012.142-1.414%201.414L30%20.828%2017.272%2013.556l-1.414-1.414L28%200h4zM.284%200l28%2028-1.414%201.414L0%202.544V0h.284zM0%205.373l25.456%2025.455-1.414%201.415L0%208.2V5.374zm0%205.656l22.627%2022.627-1.414%201.414L0%2013.86v-2.83zm0%205.656l19.8%2019.8-1.415%201.413L0%2019.514v-2.83zm0%205.657l16.97%2016.97-1.414%201.415L0%2025.172v-2.83zM0%2028l14.142%2014.142-1.414%201.414L0%2030.828V28zm0%205.657L11.314%2044.97%209.9%2046.386l-9.9-9.9v-2.828zm0%205.657L8.485%2047.8%207.07%2049.212%200%2042.143v-2.83zm0%205.657l5.657%205.657-1.414%201.415L0%2047.8v-2.83zm0%205.657l2.828%202.83-1.414%201.413L0%2053.456v-2.83zM54.627%2060L30%2035.373%205.373%2060H8.2L30%2038.2%2051.8%2060h2.827zm-5.656%200L30%2041.03%2011.03%2060h2.828L30%2043.858%2046.142%2060h2.83zm-5.656%200L30%2046.686%2016.686%2060h2.83L30%2049.515%2040.485%2060h2.83zm-5.657%200L30%2052.343%2022.343%2060h2.83L30%2055.172%2034.828%2060h2.83zM32%2060l-2-2-2%202h4zM59.716%2060l-28-28%201.414-1.414L60%2057.456V60h-.284zM60%2054.627L34.544%2029.172l1.414-1.415L60%2051.8v2.827zm0-5.656L37.373%2026.344l1.414-1.414L60%2046.143v2.828zm0-5.656L40.2%2023.515l1.415-1.414L60%2040.485v2.83zm0-5.657L43.03%2020.687l1.414-1.414L60%2034.828v2.83zM60%2032L45.858%2017.858l1.414-1.414L60%2029.172V32zm0-5.657L48.686%2015.03l1.414-1.415L60%2023.515v2.828zm0-5.657L51.515%2012.2l1.414-1.414L60%2017.857v2.83zm0-5.657L54.343%209.372l1.414-1.414L60%2012.2v2.83zm0-5.657L57.172%206.544l1.414-1.415L60%206.543v2.83z%22%20fill%3D%22%2322c55e%22%20fill-opacity%3D%22.03%22%20fill-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <TreePine className="h-4 w-4" />
                <span>Protecting Azerbaijan's Natural Heritage</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight" data-testid="text-hero-title">
                Together for a{" "}
                <span className="text-primary">Greener</span>{" "}
                <span className="text-secondary">Azerbaijan</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join our community in preserving Azerbaijan's stunning biodiversity through environmental competitions, 
                eco events, and community action. Your participation makes a difference.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/competitions">
                  <Button size="lg" className="min-w-[180px] gap-2" data-testid="button-hero-competitions">
                    <Trophy className="h-5 w-5" />
                    Join Competitions
                  </Button>
                </Link>
                <Link href="/events">
                  <Button size="lg" variant="outline" className="min-w-[180px] gap-2" data-testid="button-hero-events">
                    <Calendar className="h-5 w-5" />
                    View Events
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How You Can Help</h2>
              <p className="text-muted-foreground text-lg">
                Multiple ways to contribute to environmental protection in Azerbaijan
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate group">
                  <CardContent className="p-6 space-y-4">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <Link href={feature.title.includes("Competition") ? "/competitions" : feature.title.includes("Event") ? "/events" : "/problems"}>
                      <Button variant="ghost" size="sm" className="gap-1 -ml-2 mt-2">
                        Learn more
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ecosystems Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Natural Treasures</h2>
              <p className="text-muted-foreground text-lg">
                Azerbaijan's diverse ecosystems that we strive to protect
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {ecosystems.map((ecosystem, index) => (
                <Card key={index} className="border-primary/20 hover-elevate">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto">
                      <ecosystem.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{ecosystem.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{ecosystem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
              <CardContent className="p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Join thousands of environmentally conscious citizens working together 
                  to protect Azerbaijan's natural heritage. Sign in to get started.
                </p>
                <a href="/api/login">
                  <Button size="lg" className="min-w-[200px]" data-testid="button-cta-signin">
                    Get Started Today
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
