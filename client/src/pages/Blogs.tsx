import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Lightbulb,
  ThumbsUp,
  Star,
  PenSquare,
  TrendingUp,
  Leaf,
  Users,
  Sparkles
} from "lucide-react";
import type { CommunityPost, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

type BlogType = "feedback" | "idea";

const blogTypeLabels: Record<BlogType, { label: string; color: string; icon: any }> = {
  feedback: { label: "Feedback", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", icon: ThumbsUp },
  idea: { label: "Idea", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", icon: Lightbulb }
};

export default function Blogs() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [blogType, setBlogType] = useState<BlogType>("feedback");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [usersCache, setUsersCache] = useState<Record<string, User | null>>({});

  const { data: posts, isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ["/api/blogs"],
  });

  const fetchUserInfo = async (userId: string) => {
    if (usersCache[userId] !== undefined) return usersCache[userId];
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const user = await response.json();
        setUsersCache(prev => ({ ...prev, [userId]: user }));
        return user;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setUsersCache(prev => ({ ...prev, [userId]: null }));
    return null;
  };

  const createBlogMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      title?: string;
      postType: string;
    }) => {
      return apiRequest("POST", "/api/blogs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
      setContent("");
      setTitle("");
      toast({
        title: "Blog posted!",
        description: "Your feedback/idea has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/community/posts/${postId}/like`);
      } else {
        return apiRequest("POST", `/api/community/posts/${postId}/like`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blogs"] });
    }
  });

  const handleSubmitBlog = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    createBlogMutation.mutate({
      content,
      title: title || undefined,
      postType: blogType,
    });
  };

  const filteredPosts = posts?.filter(post => {
    if (activeTab === "all") return true;
    if (activeTab === "feedback") return post.postType === "feedback";
    if (activeTab === "idea") return post.postType === "idea";
    return true;
  }) || [];

  const getUserInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-500/10 via-background to-amber-500/10 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 mb-6 animate-fade-in" style={{ opacity: 0 }}>
                <PenSquare className="h-4 w-4" />
                <span>User Blogs & Ideas</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-blogs-title">
                Community <span className="gradient-text">Voices</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
                Share your feedback, ideas, and experiences about environmental protection in Azerbaijan.
                Your voice matters in shaping a sustainable future.
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {isAuthenticated && (
                <Card className="border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                          {getUserInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground">Share your thoughts</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {(Object.keys(blogTypeLabels) as BlogType[]).map((type) => {
                        const { label, icon: Icon } = blogTypeLabels[type];
                        return (
                          <Button
                            key={type}
                            variant={blogType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBlogType(type)}
                            className="gap-1"
                            data-testid={`button-blog-type-${type}`}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </Button>
                        );
                      })}
                    </div>

                    <Input
                      placeholder={blogType === "feedback" ? "What's your feedback about?" : "What's your idea?"}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      data-testid="input-blog-title"
                    />

                    <Textarea
                      placeholder={
                        blogType === "feedback" 
                          ? "Share your experience or feedback about our environmental initiatives..." 
                          : "Describe your idea for improving environmental protection..."
                      }
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[120px]"
                      data-testid="input-blog-content"
                    />

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSubmitBlog}
                        disabled={createBlogMutation.isPending || !content.trim()}
                        className="gap-2"
                        data-testid="button-submit-blog"
                      >
                        <Send className="h-4 w-4" />
                        {createBlogMutation.isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" data-testid="tab-all-blogs">All</TabsTrigger>
                  <TabsTrigger value="feedback" data-testid="tab-feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="idea" data-testid="tab-ideas">Ideas</TabsTrigger>
                </TabsList>
              </Tabs>

              {postsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-full bg-muted" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your feedback or ideas!
                    </p>
                    {!isAuthenticated && (
                      <Button asChild>
                        <Link href="/api/login">Sign in to Post</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      isAuthenticated={isAuthenticated}
                      onLike={(isLiked) => likePostMutation.mutate({ postId: post.id, isLiked })}
                      fetchUserInfo={fetchUserInfo}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-500/5 to-amber-500/5 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    Blog Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Posts</span>
                    <Badge variant="secondary">{posts?.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Feedback Posts</span>
                    <Badge variant="secondary">
                      {posts?.filter(p => p.postType === "review").length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ideas Shared</span>
                    <Badge variant="secondary">
                      {posts?.filter(p => p.postType === "general").length || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5 text-amber-500" />
                    Featured Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">Caspian Sea Protection</p>
                    <p className="text-xs text-muted-foreground">Share ideas for marine conservation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">Forest Conservation</p>
                    <p className="text-xs text-muted-foreground">Azerbaijan's mountain forests</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">Clean Energy Transition</p>
                    <p className="text-xs text-muted-foreground">From oil to renewable energy</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Why Share?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <Leaf className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Your ideas can inspire real environmental action
                  </p>
                  <p className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Connect with like-minded eco-activists
                  </p>
                  <p className="flex items-start gap-2">
                    <ThumbsUp className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    Help improve our community programs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface BlogCardProps {
  post: CommunityPost;
  isAuthenticated: boolean;
  onLike: (isLiked: boolean) => void;
  fetchUserInfo: (userId: string) => Promise<User | null>;
}

function BlogCard({ post, isAuthenticated, onLike, fetchUserInfo }: BlogCardProps) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useState(() => {
    fetchUserInfo(post.userId).then(setUserInfo);
  });

  const postType = post.postType === "feedback" ? "feedback" : "idea";
  const { label, color, icon: TypeIcon } = blogTypeLabels[postType as BlogType] || blogTypeLabels.feedback;

  const getUserInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const handleLike = () => {
    if (!isAuthenticated) return;
    setIsLiked(!isLiked);
    onLike(isLiked);
  };

  return (
    <Card className="hover-elevate" data-testid={`card-blog-${post.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={userInfo?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              {getUserInitials(userInfo?.firstName, userInfo?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="font-semibold">
                  {userInfo?.firstName} {userInfo?.lastName || "Community Member"}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </span>
                  <Badge className={`${color} text-xs`}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {label}
                  </Badge>
                </div>
              </div>
            </div>
            
            {post.title && (
              <h3 className="font-semibold mt-3 mb-1">{post.title}</h3>
            )}
            <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 border-t flex gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`gap-1 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
          disabled={!isAuthenticated}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likesCount || 0}</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.commentsCount || 0}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
