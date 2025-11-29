import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";
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

export default function Problems() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const problemFormSchema = z.object({
    title: z.string().min(5, t("titleMinLength")).max(255),
    description: z.string().min(20, t("descriptionMinLength")),
    location: z.string().min(5, t("locationMinLength")).max(255),
    category: z.string().min(1, t("pleaseSelectCategory")),
    severity: z.string().min(1, t("pleaseSelectSeverity")),
  });

  type ProblemFormValues = z.infer<typeof problemFormSchema>;
  const [activeTab, setActiveTab] = useState("caspian");

  const categories = [
    { value: "Pollution", label: t("pollutionCat") },
    { value: "Deforestation", label: t("deforestation") },
    { value: "Wildlife", label: t("wildlifeThreat") },
    { value: "Water", label: t("waterContamination") },
    { value: "Waste", label: t("illegalWasteDumping") },
    { value: "Oil", label: t("oilIndustryImpact") },
    { value: "Other", label: t("other") },
  ];

  const severities = [
    { value: "low", label: t("low"), color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    { value: "medium", label: t("medium"), color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    { value: "high", label: t("high"), color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
    { value: "critical", label: t("critical"), color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  ];

  const statusInfo: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
    pending: { label: t("pendingReview"), icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    investigating: { label: t("underInvestigation"), icon: AlertCircle, color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    resolved: { label: t("resolved"), icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    rejected: { label: t("rejected"), icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  };

  const caspianSeaProblems = [
    {
      id: 1,
      title: t("oilSpillsTitle"),
      icon: Fuel,
      severity: "critical",
      description: t("oilSpillsDesc"),
      impacts: [
        t("oilSpillsImpact1"),
        t("oilSpillsImpact2"),
        t("oilSpillsImpact3"),
        t("oilSpillsImpact4")
      ],
      solutions: [
        t("oilSpillsSolution1"),
        t("oilSpillsSolution2"),
        t("oilSpillsSolution3"),
        t("oilSpillsSolution4")
      ]
    },
    {
      id: 2,
      title: t("sturgeonTitle"),
      icon: Fish,
      severity: "critical",
      description: t("sturgeonDesc"),
      impacts: [
        t("sturgeonImpact1"),
        t("sturgeonImpact2"),
        t("sturgeonImpact3"),
        t("sturgeonImpact4")
      ],
      solutions: [
        t("sturgeonSolution1"),
        t("sturgeonSolution2"),
        t("sturgeonSolution3"),
        t("sturgeonSolution4")
      ]
    },
    {
      id: 3,
      title: t("wastewaterTitle"),
      icon: Factory,
      severity: "high",
      description: t("wastewaterDesc"),
      impacts: [
        t("wastewaterImpact1"),
        t("wastewaterImpact2"),
        t("wastewaterImpact3"),
        t("wastewaterImpact4")
      ],
      solutions: [
        t("wastewaterSolution1"),
        t("wastewaterSolution2"),
        t("wastewaterSolution3"),
        t("wastewaterSolution4")
      ]
    },
    {
      id: 4,
      title: t("seaLevelTitle"),
      icon: Waves,
      severity: "medium",
      description: t("seaLevelDesc"),
      impacts: [
        t("seaLevelImpact1"),
        t("seaLevelImpact2"),
        t("seaLevelImpact3"),
        t("seaLevelImpact4")
      ],
      solutions: [
        t("seaLevelSolution1"),
        t("seaLevelSolution2"),
        t("seaLevelSolution3"),
        t("seaLevelSolution4")
      ]
    }
  ];

  const sustainableSolutions = [
    {
      title: t("greenOilTitle"),
      icon: Leaf,
      description: t("greenOilDesc"),
      details: [
        t("greenOilDetail1"),
        t("greenOilDetail2"),
        t("greenOilDetail3"),
        t("greenOilDetail4")
      ]
    },
    {
      title: t("renewableTitle"),
      icon: TrendingUp,
      description: t("renewableDesc"),
      details: [
        t("renewableDetail1"),
        t("renewableDetail2"),
        t("renewableDetail3"),
        t("renewableDetail4")
      ]
    },
    {
      title: t("marineProtectedTitle"),
      icon: Shield,
      description: t("marineProtectedDesc"),
      details: [
        t("marineProtectedDetail1"),
        t("marineProtectedDetail2"),
        t("marineProtectedDetail3"),
        t("marineProtectedDetail4")
      ]
    },
    {
      title: t("internationalCoopTitle"),
      icon: Scale,
      description: t("internationalCoopDesc"),
      details: [
        t("internationalCoopDetail1"),
        t("internationalCoopDetail2"),
        t("internationalCoopDetail3"),
        t("internationalCoopDetail4")
      ]
    }
  ];

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
        title: t("reportSubmitted"),
        description: t("thankYouReport"),
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t("submissionFailed"),
        description: t("submissionFailedDesc"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProblemFormValues) => {
    createProblemMutation.mutate(data);
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return t("unknown");
    const localeMap: Record<string, string> = {
      en: 'en-US',
      az: 'az-AZ',
      ru: 'ru-RU'
    };
    const locale = localeMap[localStorage.getItem('language') || 'en'] || 'en-US';
    return new Date(date).toLocaleDateString(locale, {
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
                <span>{t("problemsTagline")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-problems-title">
                {t("problemsTitle")} <span className="gradient-text">{t("caspianSeaTitle")}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                {t("problemsDescription")}
              </p>
              
              {isAuthenticated ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="gap-2 btn-glow group" data-testid="button-report-problem">
                      <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                      {t("reportProblem")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{t("reportEnvironmentalProblem")}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("reportTitle")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("briefDescription")} 
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
                              <FormLabel>{t("category")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-problem-category">
                                    <SelectValue placeholder={t("selectCategory")} />
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
                              <FormLabel>{t("severity")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-problem-severity">
                                    <SelectValue placeholder={t("selectSeverityLevel")} />
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
                              <FormLabel>{t("location")}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={t("whereIsProblem")} 
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
                              <FormLabel>{t("description")}</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={t("provideDetailedDescription")} 
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
                            {t("cancel")}
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
                                {t("submitting")}
                              </>
                            ) : (
                              t("submitReport")
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
                    {t("signInToReportProblems")}
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
                <TabsTrigger value="caspian" data-testid="tab-caspian">{t("caspianSeaIssues")}</TabsTrigger>
                <TabsTrigger value="solutions" data-testid="tab-solutions">{t("solutions")}</TabsTrigger>
                <TabsTrigger value="reports" data-testid="tab-reports">{t("communityReports")}</TabsTrigger>
              </TabsList>

              <TabsContent value="caspian" className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                        <Droplets className="h-6 w-6 text-blue-500" />
                        {t("challengeOilEnvironment")}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {t("oilEnvironmentDescription")}
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
                                      {t("environmentalImpacts")}
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
                                      {t("proposedSolutions")}
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
                          {t("caspianSeaFacts")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">371,000 km²</p>
                          <p className="text-muted-foreground text-xs">{t("surfaceArea")}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">1,025 meters</p>
                          <p className="text-muted-foreground text-xs">{t("maximumDepth")}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">{t("fiveNations")}</p>
                          <p className="text-muted-foreground text-xs">{t("fiveNationsDesc")}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background">
                          <p className="font-semibold">850+</p>
                          <p className="text-muted-foreground text-xs">{t("uniqueSpecies")}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-amber-200 dark:border-amber-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Scale className="h-5 w-5 text-amber-500" />
                          {t("economicReality")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>{t("economicRealityDesc")}</p>
                        <p>{t("responsibleExtraction")}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="space-y-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold mb-4">{t("balancingEconomyEnvironment")}</h2>
                  <p className="text-muted-foreground">
                    {t("balancingDescription")}
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
                    <h3 className="text-xl font-bold mb-3">{t("yourVoiceMattersProblems")}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t("voiceMattersDescription")}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {isAuthenticated ? (
                        <Button onClick={() => { setActiveTab("reports"); setIsDialogOpen(true); }}>
                          {t("reportProblem")}
                        </Button>
                      ) : (
                        <a href="/api/login">
                          <Button>{t("signInToGetInvolved")}</Button>
                        </a>
                      )}
                      <Button variant="outline" asChild>
                        <a href="/community">{t("joinOurCommunity")}</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">{t("communityReports")}</h2>
                      <Badge variant="outline" className="gap-1">
                        <FileText className="h-3 w-3" />
                        {problems?.length || 0} {t("totalReports")}
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
                          <h3 className="text-xl font-semibold mb-2">{t("noReportsYet")}</h3>
                          <p className="text-muted-foreground mb-4">
                            {t("beFirstToReport")}
                          </p>
                          {isAuthenticated ? (
                            <Button onClick={() => setIsDialogOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              {t("submitFirstReport")}
                            </Button>
                          ) : (
                            <a href="/api/login">
                              <Button>{t("signInToReport")}</Button>
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
                            {t("yourReports")}
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
                        <CardTitle className="text-lg">{t("howToReport")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { step: 1, text: t("step1Report") },
                          { step: 2, text: t("step2Report") },
                          { step: 3, text: t("step3Report") },
                          { step: 4, text: t("step4Report") },
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
                        <CardTitle className="text-lg">{t("reportCategories")}</CardTitle>
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
