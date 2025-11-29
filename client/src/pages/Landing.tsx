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
  Shield,
  Sparkles
} from "lucide-react";

import heroImage from "@assets/stock_images/azerbaijan_landscape_1c7523c3.jpg";
import beachCleanupImg from "@assets/stock_images/beach_cleanup_volunt_c6de985f.jpg";
import treePlantingImg from "@assets/stock_images/tree_planting_refore_abf1cea0.jpg";
import wildlifeImg from "@assets/stock_images/birdwatching_wildlif_7096d9cc.jpg";
import mountainHikingImg from "@assets/stock_images/mountain_hiking_natu_be5ae251.jpg";
import recyclingImg from "@assets/stock_images/recycling_sustainabi_b0971641.jpg";
import solarEnergyImg from "@assets/stock_images/solar_energy_renewab_84102c5e.jpg";

const stats = [
  { icon: Calendar, value: "50+", label: "Events Hosted", color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { icon: Users, value: "2,500+", label: "Active Members", color: "text-amber-500", bgColor: "bg-amber-500/10" },
  { icon: TreePine, value: "2,500+", label: "Trees Planted", color: "text-green-500", bgColor: "bg-green-500/10" },
  { icon: Trophy, value: "8", label: "Quiz Challenges", color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const features = [
  {
    icon: Trophy,
    title: "Environmental Competitions",
    description: "Test your knowledge about ecology and win exciting prizes through our interactive quizzes.",
    image: recyclingImg,
    link: "/competitions",
    gradient: "from-purple-500/90 to-indigo-600/80",
    iconBg: "bg-purple-500",
  },
  {
    icon: Calendar,
    title: "Eco Events",
    description: "Join tree planting, beach cleanups, and awareness campaigns across Azerbaijan.",
    image: mountainHikingImg,
    link: "/events",
    gradient: "from-blue-500/90 to-cyan-600/80",
    iconBg: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Report Problems",
    description: "Help identify and report environmental issues in your community for quick action.",
    image: solarEnergyImg,
    link: "/problems",
    gradient: "from-amber-500/90 to-orange-600/80",
    iconBg: "bg-amber-500",
  },
];

const ecosystems = [
  {
    icon: Mountain,
    title: "Caucasus Mountains",
    description: "Home to diverse wildlife including the Caucasian leopard and brown bear.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Droplets,
    title: "Caspian Sea",
    description: "The world's largest enclosed body of water with unique marine species.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Bird,
    title: "Migratory Birds",
    description: "Critical stopover for millions of birds traveling between Europe and Asia.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Azerbaijan landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span>Protecting Azerbaijan's Natural Heritage</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white drop-shadow-lg" data-testid="text-hero-title">
                Together for a{" "}
                <span className="text-green-400">Greener</span>{" "}
                <span className="text-blue-400">Azerbaijan</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow">
                Join our community in preserving Azerbaijan's stunning biodiversity through environmental competitions, 
                eco events, and community action. Your participation makes a difference.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
                <Link href="/competitions">
                  <Button size="lg" className="min-w-[200px] gap-2 group shadow-xl text-base h-12 btn-glow" data-testid="button-hero-competitions">
                    <Trophy className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    Join Competitions
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
                <Link href="/events">
                  <Button size="lg" variant="outline" className="min-w-[200px] gap-2 group bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl text-base h-12 btn-glow" data-testid="button-hero-events">
                    <Calendar className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    View Events
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className={`text-center group animate-fade-in-up stagger-${index + 1}`} style={{ opacity: 0 }}>
                  <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.bgColor} border border-current/10`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold ${stat.color}`} data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-background via-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">How You Can <span className="text-primary">Help</span></h2>
              <p className="text-muted-foreground text-lg">
                Multiple ways to contribute to environmental protection in Azerbaijan
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 border-0 card-hover-lift animate-fade-in-up" style={{ opacity: 0, animationDelay: `${0.1 * (index + 1)}s` }}>
                  <div className="relative overflow-hidden">
                    <div className="aspect-[16/10]">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-60 group-hover:opacity-75 transition-opacity`} />
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${feature.iconBg} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="text-white text-sm font-semibold drop-shadow-lg bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">{feature.title}</span>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <Link href={feature.link}>
                      <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 mt-2 group/btn text-primary font-medium">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
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
                <Card key={index} className="border-primary/20 group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto transition-transform duration-300 group-hover:scale-110">
                      <ecosystem.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{ecosystem.title}</h3>
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
            <Card className="relative overflow-hidden border-0">
              <div className="absolute inset-0">
                <img 
                  src={treePlantingImg} 
                  alt="Join us"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
              </div>
              <CardContent className="relative p-8 sm:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white drop-shadow-lg">Ready to Make a Difference?</h2>
                <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto drop-shadow">
                  Join thousands of environmentally conscious citizens working together 
                  to protect Azerbaijan's natural heritage. Sign in to get started.
                </p>
                <a href="/api/login">
                  <Button size="lg" variant="secondary" className="min-w-[200px] gap-2 group shadow-xl text-base h-12 btn-glow" data-testid="button-cta-signin">
                    Get Started Today
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
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
