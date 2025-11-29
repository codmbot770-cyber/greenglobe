import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  AlertTriangle, 
  MapPin, 
  Plus,
  Loader2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Droplets,
  Fish,
  Factory,
  Leaf,
  TreePine,
  Scale,
  Lightbulb,
  TrendingUp,
  Shield,
  Waves,
  Fuel
} from "lucide-react";
import type { Problem } from "@shared/schema";

const categories = [
  { value: "Pollution", label: "Pollution" },
  { value: "Deforestation", label: "Deforestation" },
  { value: "Wildlife", label: "Wildlife Threat" },
  { value: "Water", label: "Water Contamination" },
  { value: "Waste", label: "Illegal Waste Dumping" },
  { value: "Oil", label: "Oil Industry Impact" },
  { value: "Other", label: "Other" },
];

const severities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
];

const statusInfo: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  pending: { label: "Pending Review", icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  investigating: { label: "Under Investigation", icon: AlertCircle, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const caspianSeaProblems = [
  {
    id: 1,
    title: "Oil Spills and Leakages",
    icon: Fuel,
    severity: "critical",
    description: "Offshore oil drilling and transportation activities have led to frequent oil spills and chronic leakages, coating the seabed and shorelines with petroleum residue.",
    impacts: [
      "Destruction of marine habitats and coastal wetlands",
      "Death of fish, seabirds, and marine mammals",
      "Contamination of drinking water sources",
      "Long-term toxic accumulation in the food chain"
    ],
    solutions: [
      "Implement stricter drilling regulations and safety protocols",
      "Use double-hulled tankers for oil transportation",
      "Deploy rapid response oil spill cleanup teams",
      "Invest in real-time monitoring systems for leak detection"
    ]
  },
  {
    id: 2,
    title: "Declining Sturgeon Population",
    icon: Fish,
    severity: "critical",
    description: "The Caspian Sea sturgeon, source of world-famous caviar, faces extinction due to overfishing, habitat destruction, and pollution from oil industry activities.",
    impacts: [
      "90% decline in sturgeon population over 20 years",
      "Loss of ancient species that survived for 250 million years",
      "Economic impact on traditional fishing communities",
      "Disruption of the marine ecosystem food chain"
    ],
    solutions: [
      "Enforce fishing moratoriums during spawning seasons",
      "Create sturgeon breeding and restocking programs",
      "Establish protected marine reserves",
      "Support caviar farming to reduce wild fishing pressure"
    ]
  },
  {
    id: 3,
    title: "Industrial Wastewater Discharge",
    icon: Factory,
    severity: "high",
    description: "Oil refineries, chemical plants, and industrial facilities discharge untreated or partially treated wastewater directly into the Caspian Sea and its tributaries.",
    impacts: [
      "Heavy metal contamination (mercury, lead, cadmium)",
      "Eutrophication causing algae blooms and dead zones",
      "Bioaccumulation of toxins in fish consumed by humans",
      "Destruction of coral-like formations and seagrass beds"
    ],
    solutions: [
      "Mandate advanced wastewater treatment for all industries",
      "Implement 'polluter pays' principle with heavy fines",
      "Create buffer zones around sensitive coastal areas",
      "Develop closed-loop water recycling in refineries"
    ]
  },
  {
    id: 4,
    title: "Sea Level Fluctuations",
    icon: Waves,
    severity: "medium",
    description: "Climate change and water diversion for irrigation have caused dramatic sea level changes, with the Caspian Sea dropping nearly 1.5 meters since 1995.",
    impacts: [
      "Exposure and destruction of shallow-water habitats",
      "Increased salinity harming freshwater species",
      "Stranding of fishing ports and infrastructure",
      "Acceleration of desertification in coastal areas"
    ],
    solutions: [
      "Reduce water extraction from major tributaries like the Volga",
      "Implement sustainable irrigation practices in agriculture",
      "Create adaptive management plans for sea level changes",
      "Restore coastal wetlands to act as natural buffers"
    ]
  }
];

const sustainableSolutions = [
  {
    title: "Green Oil Extraction Technologies",
    icon: Leaf,
    description: "Modern drilling technologies can significantly reduce environmental impact while maintaining production efficiency.",
    details: [
      "Zero-flaring policies to reduce greenhouse gas emissions",
      "Closed-loop drilling systems to prevent chemical discharge",
      "Horizontal drilling to minimize surface disturbance",
      "Bioremediation using microorganisms to clean contaminated soil"
    ]
  },
  {
    title: "Transition to Renewable Energy",
    icon: TrendingUp,
    description: "Azerbaijan can gradually diversify its economy while using oil revenues to build renewable energy infrastructure.",
    details: [
      "Solar farms in the sun-rich Absheron Peninsula",
      "Offshore wind turbines in the Caspian Sea",
      "Investment in hydroelectric power from mountain rivers",
      "Green hydrogen production using renewable electricity"
    ]
  },
  {
    title: "Marine Protected Areas",
    icon: Shield,
    description: "Designating protected zones can preserve biodiversity while allowing sustainable economic activities in other areas.",
    details: [
      "Create no-drilling buffer zones around sensitive habitats",
      "Establish sturgeon spawning sanctuaries",
      "Protect Caspian seal breeding grounds",
      "Develop eco-tourism as alternative income source"
    ]
  },
  {
    title: "International Cooperation",
    icon: Scale,
    description: "The five Caspian nations must work together to protect this shared resource while managing energy resources responsibly.",
    details: [
      "Unified environmental standards for all Caspian states",
      "Shared monitoring and early warning systems",
      "Joint research programs on marine conservation",
      "Coordinated oil spill response capabilities"
    ]
  }
];

const problemFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location must be at least 5 characters").max(255),
  category: z.string().min(1, "Please select a category"),
  severity: z.string().min(1, "Please select severity level"),
});

type ProblemFormValues = z.infer<typeof problemFormSchema>;

export default function Problems() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("caspian");

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      severity: "",
    },
  });

  const { data: problems, isLoading } = useQuery<Problem[]>({
    queryKey: ["/api/problems"],
  });

  const { data: userProblems } = useQuery<Problem[]>({
    queryKey: ["/api/user/problems"],
    enabled: isAuthenticated,
  });

  const createProblemMutation = useMutation({
    mutationFn: async (data: ProblemFormValues) => {
      await apiRequest("POST", "/api/problems", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/problems"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/problems"] });
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting this environmental problem.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProblemFormValues) => {
    createProblemMutation.mutate(data);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityColor = (severity: string) => {
    return severities.find(s => s.value === severity)?.color || "";
  };

  const getStatusInfo = (status: string | null) => {
    return statusInfo[status || "pending"] || statusInfo.pending;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-500/10 via-background to-destructive/5 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 animate-fade-in" style={{ opacity: 0 }}>
                <Droplets className="h-4 w-4" />
                <span>Environmental Challenges</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-problems-title">
                Protecting the <span className="gradient-text">Caspian Sea</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                The Caspian Sea, the world's largest enclosed body of water, faces critical environmental 
                challenges from oil extraction - Azerbaijan's main income source. Discover how we can 
                protect our natural heritage while ensuring economic prosperity.
              </p>
              
              {isAuthenticated ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2" data-testid="button-report-problem">
                      <Plus className="h-5 w-5" />
                      Report a Problem
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Report Environmental Problem</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Brief description of the problem" 
                                  {...field} 
                                  data-testid="input-problem-title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-problem-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="severity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Severity</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-problem-severity">
                                    <SelectValue placeholder="Select severity level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {severities.map((sev) => (
                                    <SelectItem key={sev.value} value={sev.value}>
                                      {sev.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Where is this problem located?" 
                                  {...field}
                                  data-testid="input-problem-location"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide detailed description of the environmental problem..." 
                                  className="min-h-[100px]"
                                  {...field}
                                  data-testid="textarea-problem-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={createProblemMutation.isPending}
                            data-testid="button-submit-problem"
                          >
                            {createProblemMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Report"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              ) : (
                <a href="/api/login">
                  <Button size="lg" className="gap-2">
                    Sign In to Report Problems
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
                <TabsTrigger value="caspian" data-testid="tab-caspian">Caspian Sea Issues</TabsTrigger>
                <TabsTrigger value="solutions" data-testid="tab-solutions">Sustainable Solutions</TabsTrigger>
                <TabsTrigger value="reports" data-testid="tab-reports">Community Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="caspian" className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        <Droplets className="h-6 w-6 text-blue-500" />
                        The Challenge: Oil and Environment
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Azerbaijan's economy has been built on oil wealth, with the Caspian Sea holding 
                        an estimated 48 billion barrels of oil. While this resource has driven economic 
                        growth, decades of extraction have taken a heavy toll on one of the world's most 
                        unique marine ecosystems. The Caspian Sea is home to species found nowhere else 
                        on Earth, including the endangered Caspian seal and the ancient sturgeon.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {caspianSeaProblems.map((problem) => {
                        const IconComponent = problem.icon;
                        return (
                          <Card key={problem.id} className="border-l-4 border-l-destructive" data-testid={`card-problem-${problem.id}`}>
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-destructive/10">
                                    <IconComponent className="h-5 w-5 text-destructive" />
                                  </div>
                                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                                </div>
                                <Badge className={getSeverityColor(problem.severity)}>
                                  {problem.severity}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground">{problem.description}</p>
                              
                              <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="impacts" className="border-none">
                                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                                    <span className="flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                                      Environmental Impacts
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                      {problem.impacts.map((impact, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <span className="text-destructive mt-1">•</span>
                                          {impact}
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="solutions" className="border-none">
                                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                                    <span className="flex items-center gap-2">
                                      <Lightbulb className="h-4 w-4 text-primary" />
                                      Proposed Solutions
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                      {problem.solutions.map((solution, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                          <span className="text-primary mt-1">•</span>
                                          {solution}
                                        </li>
                                      ))}
                                    </ul>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-blue-500/5 to-primary/5 border-blue-200 dark:border-blue-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          Caspian Sea Facts
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">371,000 km²</p>
                          <p className="text-muted-foreground text-xs">Surface area - world's largest lake</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">1,025 meters</p>
                          <p className="text-muted-foreground text-xs">Maximum depth</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">5 Nations</p>
                          <p className="text-muted-foreground text-xs">Azerbaijan, Iran, Kazakhstan, Russia, Turkmenistan</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">850+ Species</p>
                          <p className="text-muted-foreground text-xs">Unique fish and wildlife species</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200 dark:border-amber-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Scale className="h-5 w-5 text-amber-500" />
                          Economic Reality
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          Oil and gas account for approximately <strong>90% of Azerbaijan's exports</strong> and 
                          over <strong>40% of GDP</strong>. Balancing environmental protection with economic 
                          needs requires innovative solutions, not simply stopping production.
                        </p>
                        <p>
                          The key is <strong>responsible extraction</strong> practices combined with 
                          <strong> gradual diversification</strong> into renewable energy and other sectors.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold mb-4">Balancing Economy and Environment</h2>
                  <p className="text-muted-foreground">
                    Protecting the Caspian Sea doesn't mean abandoning oil production overnight. 
                    These sustainable strategies show how Azerbaijan can maintain economic stability 
                    while gradually transitioning to a greener future.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {sustainableSolutions.map((solution, idx) => {
                    const IconComponent = solution.icon;
                    return (
                      <Card key={idx} className="hover-elevate" data-testid={`card-solution-${idx}`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{solution.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{solution.description}</p>
                          <ul className="space-y-2">
                            {solution.details.map((detail, detailIdx) => (
                              <li key={detailIdx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 max-w-3xl mx-auto">
                  <CardContent className="p-8 text-center">
                    <TreePine className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-3">Your Voice Matters</h3>
                    <p className="text-muted-foreground mb-6">
                      Environmental protection starts with awareness. Share your observations, 
                      report problems, and participate in our community to help protect 
                      Azerbaijan's natural heritage for future generations.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {isAuthenticated ? (
                        <Button onClick={() => { setActiveTab("reports"); setIsDialogOpen(true); }}>
                          Report a Problem
                        </Button>
                      ) : (
                        <a href="/api/login">
                          <Button>Sign In to Get Involved</Button>
                        </a>
                      )}
                      <Button variant="outline" asChild>
                        <a href="/community">Join Our Community</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Community Reports</h2>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        {problems?.length || 0} Total
                      </Badge>
                    </div>

                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <Card key={i}>
                            <CardContent className="p-6">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/4 mb-4" />
                              <Skeleton className="h-16 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : problems && problems.length > 0 ? (
                      <div className="space-y-4">
                        {problems.map((problem) => {
                          const status = getStatusInfo(problem.status);
                          const StatusIcon = status.icon;
                          
                          return (
                            <Card key={problem.id} className="hover-elevate" data-testid={`card-report-${problem.id}`}>
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <h3 className="font-semibold text-lg">{problem.title}</h3>
                                  <Badge className={getSeverityColor(problem.severity)}>
                                    {problem.severity}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline">{problem.category}</Badge>
                                  <Badge className={status.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status.label}
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {problem.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{problem.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDate(problem.createdAt)}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-12 text-center">
                          <AlertTriangle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                          <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Be the first to report an environmental problem in your community.
                          </p>
                          {isAuthenticated ? (
                            <Button onClick={() => setIsDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Submit First Report
                            </Button>
                          ) : (
                            <a href="/api/login">
                              <Button>Sign In to Report</Button>
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="space-y-6">
                    {isAuthenticated && userProblems && userProblems.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-primary" />
                            Your Reports
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {userProblems.slice(0, 5).map((problem) => {
                            const status = getStatusInfo(problem.status);
                            
                            return (
                              <div 
                                key={problem.id}
                                className="p-3 rounded-lg bg-muted/50"
                              >
                                <p className="font-medium text-sm truncate mb-1">{problem.title}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {problem.category}
                                  </Badge>
                                  <span className={`text-xs px-2 py-0.5 rounded ${status.color}`}>
                                    {status.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}

                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-lg">How to Report</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { step: 1, text: "Describe the problem clearly" },
                          { step: 2, text: "Select the appropriate category" },
                          { step: 3, text: "Indicate severity level" },
                          { step: 4, text: "Provide exact location" },
                        ].map((item) => (
                          <div key={item.step} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                              {item.step}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Report Categories</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {categories.map((cat) => (
                          <div 
                            key={cat.value}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{cat.label}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
