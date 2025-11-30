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
        <section className="py-12 sm:py-16 bg-gradient-to-br from-cyan-100/80 via-sky-50/50 to-blue-100/60 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-blue-950/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-sky-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-sky-400/15 to-teal-500/15 rounded-full blur-2xl" />
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-5 py-2.5 text-sm font-medium text-cyan-700 dark:text-cyan-300 mb-6 animate-fade-in border border-cyan-300/30 dark:border-cyan-700/30 shadow-lg shadow-cyan-500/10" style={{ opacity: 0 }}>
                <Droplets className="h-4 w-4 animate-pulse" />
                <span>{t("problemsTagline")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-problems-title">
                {t("problemsTitle")} <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-500 bg-clip-text text-transparent">{t("caspianSeaTitle")}</span>
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

        <section className="py-12 bg-gradient-to-b from-cyan-50/30 to-background dark:from-cyan-950/20 dark:to-background">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gradient-to-r from-cyan-100/80 via-sky-100/60 to-blue-100/80 dark:from-cyan-900/40 dark:via-sky-900/30 dark:to-blue-900/40 p-1">
                <TabsTrigger value="caspian" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-sky-500 data-[state=active]:text-white" data-testid="tab-caspian">{t("caspianSeaIssues")}</TabsTrigger>
                <TabsTrigger value="solutions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white" data-testid="tab-solutions">{t("solutions")}</TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white" data-testid="tab-reports">{t("communityReports")}</TabsTrigger>
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
                    <Card className="bg-gradient-to-br from-cyan-100/60 via-sky-50/40 to-blue-100/50 dark:from-cyan-950/40 dark:via-sky-950/30 dark:to-blue-950/40 border-cyan-200/50 dark:border-cyan-800/50 shadow-lg shadow-cyan-500/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 animate-pulse">
                            <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{t("caspianSeaFacts")}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <div 
                          className="group p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-cyan-200/30 dark:border-cyan-800/30 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500 relative overflow-hidden"
                          data-testid="fact-surface-area"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900/50 group-hover:scale-110 transition-transform duration-300">
                              <Waves className="h-5 w-5 text-cyan-600 dark:text-cyan-400 group-hover:animate-bounce" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-600 transition-colors">371,000 km²</p>
                              <p className="text-muted-foreground text-xs group-hover:text-cyan-600/70 transition-colors">{t("surfaceArea")}</p>
                            </div>
                          </div>
                          <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-xs text-cyan-600/80 dark:text-cyan-400/80 pt-2 border-t border-cyan-200/50 dark:border-cyan-700/50">
                              {t("surfaceAreaDetail")}
                            </p>
                          </div>
                        </div>

                        <div 
                          className="group p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-sky-200/30 dark:border-sky-800/30 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-sky-500/20 hover:border-sky-400 dark:hover:border-sky-500 relative overflow-hidden"
                          data-testid="fact-depth"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/10 to-sky-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-full bg-sky-100 dark:bg-sky-900/50 group-hover:scale-110 transition-transform duration-300">
                              <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-sky-700 dark:text-sky-300 group-hover:text-sky-600 transition-colors">1,025 m</p>
                              <p className="text-muted-foreground text-xs group-hover:text-sky-600/70 transition-colors">{t("maximumDepth")}</p>
                            </div>
                          </div>
                          <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-xs text-sky-600/80 dark:text-sky-400/80 pt-2 border-t border-sky-200/50 dark:border-sky-700/50">
                              {t("depthDetail")}
                            </p>
                          </div>
                        </div>

                        <div 
                          className="group p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-blue-200/30 dark:border-blue-800/30 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-400 dark:hover:border-blue-500 relative overflow-hidden"
                          data-testid="fact-nations"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 group-hover:scale-110 transition-transform duration-300">
                              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-blue-700 dark:text-blue-300 group-hover:text-blue-600 transition-colors">{t("fiveNations")}</p>
                              <p className="text-muted-foreground text-xs group-hover:text-blue-600/70 transition-colors">{t("fiveNationsDesc")}</p>
                            </div>
                          </div>
                          <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 pt-2 border-t border-blue-200/50 dark:border-blue-700/50">
                              {t("nationsDetail")}
                            </p>
                          </div>
                        </div>

                        <div 
                          className="group p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-indigo-200/30 dark:border-indigo-800/30 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500 relative overflow-hidden"
                          data-testid="fact-species"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-indigo-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 group-hover:scale-110 transition-transform duration-300">
                              <Fish className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:animate-pulse" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-indigo-700 dark:text-indigo-300 group-hover:text-indigo-600 transition-colors">850+</p>
                              <p className="text-muted-foreground text-xs group-hover:text-indigo-600/70 transition-colors">{t("uniqueSpecies")}</p>
                            </div>
                          </div>
                          <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 pt-2 border-t border-indigo-200/50 dark:border-indigo-700/50">
                              {t("speciesDetail")}
                            </p>
                          </div>
                        </div>

                        <div 
                          className="group p-4 rounded-xl bg-white/60 dark:bg-gray-900/60 border border-teal-200/30 dark:border-teal-800/30 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 hover:border-teal-400 dark:hover:border-teal-500 relative overflow-hidden"
                          data-testid="fact-caviar"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <div className="relative flex items-center gap-3">
                            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/50 group-hover:scale-110 transition-transform duration-300">
                              <Droplets className="h-5 w-5 text-teal-600 dark:text-teal-400 group-hover:animate-bounce" />
                            </div>
                            <div>
                              <p className="font-bold text-xl text-teal-700 dark:text-teal-300 group-hover:text-teal-600 transition-colors">90%</p>
                              <p className="text-muted-foreground text-xs group-hover:text-teal-600/70 transition-colors">{t("worldCaviar")}</p>
                            </div>
                          </div>
                          <div className="mt-2 max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-xs text-teal-600/80 dark:text-teal-400/80 pt-2 border-t border-teal-200/50 dark:border-teal-700/50">
                              {t("caviarDetail")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-100/60 via-orange-50/40 to-yellow-100/50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-yellow-950/40 border-amber-200/50 dark:border-amber-800/50 shadow-lg shadow-amber-500/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                            <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{t("economicReality")}</span>
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
                  <h2 className="text-2xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-500 bg-clip-text text-transparent">{t("balancingEconomyEnvironment")}</span>
                  </h2>
                  <p className="text-muted-foreground">
                    {t("balancingDescription")}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {sustainableSolutions.map((solution, idx) => {
                    const IconComponent = solution.icon;
                    const colors = [
                      { bg: "from-emerald-500/20 to-green-500/20", text: "text-emerald-600 dark:text-emerald-400", card: "from-emerald-50/60 to-green-50/40 dark:from-emerald-950/40 dark:to-green-950/30" },
                      { bg: "from-teal-500/20 to-cyan-500/20", text: "text-teal-600 dark:text-teal-400", card: "from-teal-50/60 to-cyan-50/40 dark:from-teal-950/40 dark:to-cyan-950/30" },
                      { bg: "from-sky-500/20 to-blue-500/20", text: "text-sky-600 dark:text-sky-400", card: "from-sky-50/60 to-blue-50/40 dark:from-sky-950/40 dark:to-blue-950/30" },
                      { bg: "from-violet-500/20 to-purple-500/20", text: "text-violet-600 dark:text-violet-400", card: "from-violet-50/60 to-purple-50/40 dark:from-violet-950/40 dark:to-purple-950/30" },
                    ];
                    const color = colors[idx % colors.length];
                    return (
                      <Card key={idx} className={`bg-gradient-to-br ${color.card} transition-all duration-500 hover:shadow-xl hover:-translate-y-1`} data-testid={`card-solution-${idx}`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${color.bg}`}>
                              <IconComponent className={`h-6 w-6 ${color.text}`} />
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
