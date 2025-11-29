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
  AlertTriangle, 
  MapPin, 
  Plus,
  Loader2,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User
} from "lucide-react";
import type { Problem } from "@shared/schema";

const categories = [
  { value: "Pollution", label: "Pollution" },
  { value: "Deforestation", label: "Deforestation" },
  { value: "Wildlife", label: "Wildlife Threat" },
  { value: "Water", label: "Water Contamination" },
  { value: "Waste", label: "Illegal Waste Dumping" },
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
        <section className="py-12 sm:py-16 bg-gradient-to-br from-destructive/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive mb-6">
                <AlertTriangle className="h-4 w-4" />
                <span>Community Environmental Reporting</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" data-testid="text-problems-title">
                Report Environmental <span className="text-primary">Problems</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Help protect Azerbaijan's environment by reporting issues in your community.
                Together we can identify, track, and resolve environmental problems.
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
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Recent Reports</h2>
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
                        <Card key={problem.id} className="hover-elevate" data-testid={`card-problem-${problem.id}`}>
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
                      <p className="text-muted-foreground">
                        Be the first to report an environmental problem in your community.
                      </p>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
