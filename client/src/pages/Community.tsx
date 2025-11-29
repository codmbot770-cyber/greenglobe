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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Image as ImageIcon, 
  Video,
  Sparkles,
  Calendar,
  PenSquare,
  Trash2,
  Users,
  TrendingUp,
  Leaf,
  Star,
  ThumbsUp,
  Award,
  Zap,
  ArrowRight
} from "lucide-react";
import type { CommunityPost, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import communityHeroImg from "@assets/stock_images/community_volunteer__3e2f3d83.jpg";
import reviewImg from "@assets/stock_images/community_event_revi_cf66a1d1.jpg";
import discussionImg from "@assets/stock_images/group_discussion_mee_2dd7d143.jpg";
import wishImg from "@assets/stock_images/wish_hope_dream_futu_5c3cc0cd.jpg";
import plantingImg from "@assets/stock_images/people_planting_tree_523c9fa4.jpg";

type PostType = "general" | "review" | "wish";

const postTypeLabels: Record<PostType, { label: string; color: string; bgColor: string; icon: any }> = {
  general: { 
    label: "Discussion", 
    color: "text-blue-700 dark:text-blue-300", 
    bgColor: "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20", 
    icon: MessageCircle 
  },
  review: { 
    label: "Review", 
    color: "text-amber-700 dark:text-amber-300", 
    bgColor: "bg-gradient-to-r from-amber-100 to-orange-50 dark:from-amber-900/40 dark:to-orange-800/20", 
    icon: Star 
  },
  wish: { 
    label: "Event Wish", 
    color: "text-emerald-700 dark:text-emerald-300", 
    bgColor: "bg-gradient-to-r from-emerald-100 to-green-50 dark:from-emerald-900/40 dark:to-green-800/20", 
    icon: Sparkles 
  }
};

const sectionFeatures = [
  {
    type: "review" as PostType,
    title: "Event Reviews",
    description: "Share your experiences from eco-events and help others learn",
    image: reviewImg,
    gradient: "from-amber-500 to-orange-500",
    stats: "Rate & Review"
  },
  {
    type: "general" as PostType,
    title: "Discussions",
    description: "Connect with eco-warriors and discuss environmental topics",
    image: discussionImg,
    gradient: "from-blue-500 to-cyan-500",
    stats: "Join the Talk"
  },
  {
    type: "wish" as PostType,
    title: "Event Wishes",
    description: "Suggest new eco-events you'd like to see in your community",
    image: wishImg,
    gradient: "from-emerald-500 to-teal-500",
    stats: "Dream Big"
  }
];

interface PostWithUser extends CommunityPost {
  userInfo?: {
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  userHasLiked?: boolean;
}

export default function Community() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [postType, setPostType] = useState<PostType>("general");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [eventWishTitle, setEventWishTitle] = useState("");
  const [eventWishDescription, setEventWishDescription] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: posts, isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community/posts"],
  });

  const [usersCache, setUsersCache] = useState<Record<string, User | null>>({});

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

  const createPostMutation = useMutation({
    mutationFn: async (data: {
      content: string;
      title?: string;
      postType: string;
      eventWishTitle?: string;
      eventWishDescription?: string;
    }) => {
      return apiRequest("POST", "/api/community/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setContent("");
      setTitle("");
      setEventWishTitle("");
      setEventWishDescription("");
      setIsCreateDialogOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
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
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: number; content: string }) => {
      return apiRequest("POST", `/api/community/posts/${postId}/comments`, { content });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setCommentInputs(prev => ({ ...prev, [variables.postId]: "" }));
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest("DELETE", `/api/community/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    }
  });

  const handleSubmitPost = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content,
      title: title || undefined,
      postType,
      eventWishTitle: postType === "wish" ? eventWishTitle : undefined,
      eventWishDescription: postType === "wish" ? eventWishDescription : undefined,
    });
  };

  const filteredPosts = posts?.filter(post => {
    if (activeTab === "all") return true;
    return post.postType === activeTab;
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

  const handleFeatureClick = (type: PostType) => {
    setPostType(type);
    setActiveTab(type);
    if (isAuthenticated) {
      setIsCreateDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative h-72 md:h-96 overflow-hidden">
          <img 
            src={communityHeroImg} 
            alt="Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 pattern-dots opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/20 mb-4 animate-fade-in" style={{ opacity: 0 }}>
                <Users className="h-4 w-4" />
                <span>Join 850+ Eco-Warriors</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in-up stagger-1" style={{ opacity: 0 }} data-testid="text-community-title">
                Community <span className="gradient-text text-glow">Hub</span>
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 drop-shadow animate-fade-in-up stagger-2 mb-6" style={{ opacity: 0 }}>
                Share experiences, review events, and wish for new eco-activities
              </p>
              {isAuthenticated ? (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="btn-glow gap-2 animate-fade-in-up stagger-3" style={{ opacity: 0 }} data-testid="button-create-post">
                      <PenSquare className="h-5 w-5" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <PenSquare className="h-5 w-5 text-primary" />
                        Create New Post
                      </DialogTitle>
                    </DialogHeader>
                    <CreatePostForm 
                      postType={postType}
                      setPostType={setPostType}
                      content={content}
                      setContent={setContent}
                      title={title}
                      setTitle={setTitle}
                      eventWishTitle={eventWishTitle}
                      setEventWishTitle={setEventWishTitle}
                      eventWishDescription={eventWishDescription}
                      setEventWishDescription={setEventWishDescription}
                      onSubmit={handleSubmitPost}
                      isPending={createPostMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              ) : (
                <a href="/api/login">
                  <Button size="lg" className="btn-glow gap-2 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
                    Sign In to Join
                  </Button>
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 animate-fade-in" style={{ opacity: 0 }}>
                Explore <span className="gradient-text">Community Features</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
                Choose how you want to engage with our eco-community
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sectionFeatures.map((feature, idx) => (
                <Card 
                  key={feature.type}
                  className={`group cursor-pointer card-hover-lift overflow-hidden border-2 border-transparent hover:border-primary/30 animate-fade-in-up`}
                  style={{ opacity: 0, animationDelay: `${0.1 * (idx + 1)}s` }}
                  onClick={() => handleFeatureClick(feature.type)}
                  data-testid={`card-feature-${feature.type}`}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-60`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <feature.type === "review" ? Star : feature.type === "general" ? MessageCircle : Sparkles
                        }
                        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 mx-auto icon-container">
                          {feature.type === "review" && <Star className="h-6 w-6" />}
                          {feature.type === "general" && <MessageCircle className="h-6 w-6" />}
                          {feature.type === "wish" && <Sparkles className="h-6 w-6" />}
                        </div>
                        <Badge className="badge-gradient-primary">{feature.stats}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span>Get Started</span>
                      <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="gradient-divider" />

        <section className="py-12 animated-gradient-bg">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 p-1 h-auto">
                    <TabsTrigger value="all" className="py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" data-testid="tab-all">
                      <Zap className="h-4 w-4 mr-1.5" />
                      All
                    </TabsTrigger>
                    <TabsTrigger value="general" className="py-2.5 data-[state=active]:bg-blue-500 data-[state=active]:text-white" data-testid="tab-general">
                      <MessageCircle className="h-4 w-4 mr-1.5" />
                      Discussions
                    </TabsTrigger>
                    <TabsTrigger value="review" className="py-2.5 data-[state=active]:bg-amber-500 data-[state=active]:text-white" data-testid="tab-reviews">
                      <Star className="h-4 w-4 mr-1.5" />
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="wish" className="py-2.5 data-[state=active]:bg-emerald-500 data-[state=active]:text-white" data-testid="tab-wishes">
                      <Sparkles className="h-4 w-4 mr-1.5" />
                      Wishes
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {postsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-muted" />
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
                  <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                        <PenSquare className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl mb-2">No posts yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Be the first to share something with the community! Your voice matters.
                      </p>
                      {!isAuthenticated ? (
                        <a href="/api/login">
                          <Button size="lg" className="btn-glow">
                            Sign in to Post
                          </Button>
                        </a>
                      ) : (
                        <Button size="lg" className="btn-glow" onClick={() => setIsCreateDialogOpen(true)}>
                          Create First Post
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post, idx) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={user?.id}
                        isAuthenticated={isAuthenticated}
                        onLike={(isLiked) => likePostMutation.mutate({ postId: post.id, isLiked })}
                        onDelete={() => deletePostMutation.mutate(post.id)}
                        onComment={(content) => createCommentMutation.mutate({ postId: post.id, content })}
                        commentInput={commentInputs[post.id] || ""}
                        onCommentInputChange={(value) => setCommentInputs(prev => ({ ...prev, [post.id]: value }))}
                        isExpanded={expandedComments.has(post.id)}
                        onToggleExpand={() => {
                          setExpandedComments(prev => {
                            const next = new Set(prev);
                            if (next.has(post.id)) {
                              next.delete(post.id);
                            } else {
                              next.add(post.id);
                            }
                            return next;
                          });
                        }}
                        fetchUserInfo={fetchUserInfo}
                        animationDelay={idx * 0.05}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border-primary/20 overflow-hidden">
                  <div className="h-2 section-header-primary" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Community Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-cool">
                      <span className="font-medium">Total Posts</span>
                      <Badge className="badge-gradient-primary">{posts?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-sunset">
                      <span className="font-medium">Event Reviews</span>
                      <Badge className="badge-gradient-warning">
                        {posts?.filter(p => p.postType === "review").length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-nature">
                      <span className="font-medium">Event Wishes</span>
                      <Badge className="badge-gradient-primary">
                        {posts?.filter(p => p.postType === "wish").length || 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-ocean">
                      <span className="font-medium">Discussions</span>
                      <Badge className="badge-gradient-secondary">
                        {posts?.filter(p => p.postType === "general").length || 0}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-32">
                    <img src={plantingImg} alt="Community" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  </div>
                  <CardContent className="space-y-3 text-sm -mt-6 relative">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg">Top Contributors</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "Eco Champion", badge: "🌿", color: "from-emerald-500 to-green-600" },
                        { name: "Green Warrior", badge: "💚", color: "from-blue-500 to-cyan-600" },
                        { name: "Nature Lover", badge: "🌍", color: "from-amber-500 to-orange-600" }
                      ].map((contributor, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover-elevate">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${contributor.color} flex items-center justify-center text-white text-xs font-bold`}>
                            #{idx + 1}
                          </div>
                          <span className="font-medium flex-1">{contributor.name}</span>
                          <span className="text-lg">{contributor.badge}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Leaf className="h-5 w-5 text-primary" />
                      Community Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    {[
                      "Be respectful and supportive of other members",
                      "Share authentic experiences from eco-events",
                      "Suggest realistic and achievable event ideas",
                      "Keep discussions focused on environmental topics"
                    ].map((guideline, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary text-xs font-bold">{idx + 1}</span>
                        </div>
                        <p>{guideline}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5 text-secondary" />
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/events" className="block">
                      <Button variant="outline" className="w-full justify-start gap-2 btn-glow">
                        <Calendar className="h-4 w-4 text-primary" />
                        View Events
                      </Button>
                    </Link>
                    <Link href="/competitions" className="block">
                      <Button variant="outline" className="w-full justify-start gap-2 btn-glow">
                        <Award className="h-4 w-4 text-secondary" />
                        Take a Quiz
                      </Button>
                    </Link>
                    <Link href="/problems" className="block">
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <ThumbsUp className="h-4 w-4 text-emerald-500" />
                        Report an Issue
                      </Button>
                    </Link>
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

interface CreatePostFormProps {
  postType: PostType;
  setPostType: (type: PostType) => void;
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  eventWishTitle: string;
  setEventWishTitle: (title: string) => void;
  eventWishDescription: string;
  setEventWishDescription: (desc: string) => void;
  onSubmit: () => void;
  isPending: boolean;
}

function CreatePostForm({
  postType,
  setPostType,
  content,
  setContent,
  title,
  setTitle,
  eventWishTitle,
  setEventWishTitle,
  eventWishDescription,
  setEventWishDescription,
  onSubmit,
  isPending
}: CreatePostFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(postTypeLabels) as PostType[]).map((type) => {
          const { label, icon: Icon, bgColor } = postTypeLabels[type];
          return (
            <Button
              key={type}
              variant={postType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setPostType(type)}
              className={`gap-1.5 ${postType === type ? '' : 'hover-elevate'}`}
              data-testid={`button-post-type-${type}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          );
        })}
      </div>

      {(postType === "general" || postType === "review") && (
        <Input
          placeholder="Add a title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-testid="input-post-title"
        />
      )}

      {postType === "wish" && (
        <div className={`space-y-3 p-4 rounded-lg ${postTypeLabels.wish.bgColor} border border-emerald-200 dark:border-emerald-800`}>
          <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4" />
            Suggest a new eco-event for our community!
          </p>
          <Input
            placeholder="Event name (e.g., Beach Cleanup at Sumgait)"
            value={eventWishTitle}
            onChange={(e) => setEventWishTitle(e.target.value)}
            data-testid="input-event-wish-title"
          />
          <Textarea
            placeholder="Describe the event you'd like to see..."
            value={eventWishDescription}
            onChange={(e) => setEventWishDescription(e.target.value)}
            className="min-h-[80px]"
            data-testid="input-event-wish-description"
          />
        </div>
      )}

      <Textarea
        placeholder={
          postType === "review" 
            ? "Share your experience at an eco-event..." 
            : postType === "wish"
            ? "Tell us why this event would be great..."
            : "What's on your mind about the environment?"
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
        data-testid="input-post-content"
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" disabled className="opacity-50">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" disabled className="opacity-50">
            <Video className="h-5 w-5" />
          </Button>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={isPending || !content.trim()}
          className="gap-2 btn-glow"
          data-testid="button-submit-post"
        >
          <Send className="h-4 w-4" />
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}

interface PostCardProps {
  post: CommunityPost;
  currentUserId?: string;
  isAuthenticated: boolean;
  onLike: (isLiked: boolean) => void;
  onDelete: () => void;
  onComment: (content: string) => void;
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  fetchUserInfo: (userId: string) => Promise<User | null>;
  animationDelay?: number;
}

function PostCard({
  post,
  currentUserId,
  isAuthenticated,
  onLike,
  onDelete,
  onComment,
  commentInput,
  onCommentInputChange,
  isExpanded,
  onToggleExpand,
  fetchUserInfo,
  animationDelay = 0
}: PostCardProps) {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const { data: userLikeData } = useQuery({
    queryKey: ["/api/community/posts", post.id, "user-like"],
    enabled: isAuthenticated,
  });

  useState(() => {
    fetchUserInfo(post.userId).then(setUserInfo);
  });

  const postTypeInfo = postTypeLabels[post.postType as PostType] || postTypeLabels.general;
  const { label, color, bgColor, icon: TypeIcon } = postTypeInfo;

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
    <Card 
      className="card-hover-lift animate-fade-in-up border-l-4 border-l-transparent hover:border-l-primary transition-all"
      style={{ opacity: 0, animationDelay: `${animationDelay}s` }}
      data-testid={`card-post-${post.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="ring-2 ring-primary/20">
            <AvatarImage src={userInfo?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
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
                  <Badge className={`${bgColor} ${color} text-xs border-0`}>
                    <TypeIcon className="h-3 w-3 mr-1" />
                    {label}
                  </Badge>
                </div>
              </div>
              {currentUserId === post.userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  data-testid={`button-delete-post-${post.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {post.title && (
              <h3 className="font-semibold text-lg mt-3">{post.title}</h3>
            )}

            {post.postType === "wish" && post.eventWishTitle && (
              <div className={`mt-3 p-4 rounded-lg ${bgColor} border border-emerald-200 dark:border-emerald-800`}>
                <p className="font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {post.eventWishTitle}
                </p>
                {post.eventWishDescription && (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    {post.eventWishDescription}
                  </p>
                )}
              </div>
            )}

            <p className="mt-3 text-foreground whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isAuthenticated && onLike((userLikeData as { liked?: boolean })?.liked || false)}
                disabled={!isAuthenticated}
                className={`gap-1.5 rounded-full ${(userLikeData as { liked?: boolean })?.liked ? "text-red-500 bg-red-50 dark:bg-red-900/20" : "hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"}`}
                data-testid={`button-like-post-${post.id}`}
              >
                <Heart className={`h-4 w-4 ${(userLikeData as { liked?: boolean })?.liked ? "fill-current" : ""}`} />
                <span className="font-medium">{post.likesCount || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="gap-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500"
                data-testid={`button-comments-post-${post.id}`}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{post.commentsCount || 0}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 rounded-full" disabled>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {isExpanded && isAuthenticated && (
              <div className="mt-4 pt-4 border-t bg-muted/30 -mx-5 -mb-5 p-4 rounded-b-lg">
                <div className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => onCommentInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && commentInput.trim()) {
                        onComment(commentInput);
                      }
                    }}
                    className="bg-background"
                    data-testid={`input-comment-post-${post.id}`}
                  />
                  <Button
                    size="icon"
                    onClick={() => commentInput.trim() && onComment(commentInput)}
                    disabled={!commentInput.trim()}
                    className="btn-glow"
                    data-testid={`button-submit-comment-${post.id}`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
