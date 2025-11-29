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
  Leaf
} from "lucide-react";
import type { CommunityPost, User } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import communityHeroImg from "@assets/stock_images/community_volunteer__3e2f3d83.jpg";

type PostType = "general" | "review" | "wish";

const postTypeLabels: Record<PostType, { label: string; color: string; icon: any }> = {
  general: { label: "Discussion", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: MessageCircle },
  review: { label: "Review", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200", icon: Sparkles },
  wish: { label: "Event Wish", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: Calendar }
};

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={communityHeroImg} 
            alt="Community" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-community-title">
                Community Hub
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto px-4 text-white/90">
                Share your experiences, review events, and suggest new eco-activities for our community
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {isAuthenticated && (
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getUserInitials(user?.firstName, user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-muted-foreground">Share with the community</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {(Object.keys(postTypeLabels) as PostType[]).map((type) => {
                        const { label, icon: Icon } = postTypeLabels[type];
                        return (
                          <Button
                            key={type}
                            variant={postType === type ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPostType(type)}
                            className="gap-1"
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
                      <div className="space-y-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
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
                        onClick={handleSubmitPost}
                        disabled={createPostMutation.isPending || !content.trim()}
                        className="gap-2"
                        data-testid="button-submit-post"
                      >
                        <Send className="h-4 w-4" />
                        {createPostMutation.isPending ? "Posting..." : "Post"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                  <TabsTrigger value="general" data-testid="tab-general">Discussions</TabsTrigger>
                  <TabsTrigger value="review" data-testid="tab-reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="wish" data-testid="tab-wishes">Event Wishes</TabsTrigger>
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
                    <PenSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share something with the community!
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
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Posts</span>
                    <Badge variant="secondary">{posts?.length || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Event Wishes</span>
                    <Badge variant="secondary">
                      {posts?.filter(p => p.postType === "wish").length || 0}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reviews</span>
                    <Badge variant="secondary">
                      {posts?.filter(p => p.postType === "review").length || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Leaf className="h-5 w-5 text-primary" />
                    Community Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-primary">1.</span>
                    Be respectful and supportive of other community members
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">2.</span>
                    Share authentic experiences from eco-events
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">3.</span>
                    Suggest realistic and achievable event ideas
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">4.</span>
                    Keep discussions focused on environmental topics
                  </p>
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
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Calendar className="h-4 w-4" />
                      View Events
                    </Button>
                  </Link>
                  <Link href="/competitions" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Sparkles className="h-4 w-4" />
                      Take a Quiz
                    </Button>
                  </Link>
                  <Link href="/problems" className="block">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      Report an Issue
                    </Button>
                  </Link>
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
  fetchUserInfo
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

  const { label, color, icon: TypeIcon } = postTypeLabels[post.postType as PostType] || postTypeLabels.general;

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
    <Card className="hover-elevate" data-testid={`card-post-${post.id}`}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={userInfo?.profileImageUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
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
              {currentUserId === post.userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="text-muted-foreground hover:text-destructive"
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
              <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {post.eventWishTitle}
                </p>
                {post.eventWishDescription && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {post.eventWishDescription}
                  </p>
                )}
              </div>
            )}

            <p className="mt-3 text-foreground whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isAuthenticated && onLike((userLikeData as { liked?: boolean })?.liked || false)}
                disabled={!isAuthenticated}
                className={`gap-1 ${(userLikeData as { liked?: boolean })?.liked ? "text-red-500" : ""}`}
                data-testid={`button-like-post-${post.id}`}
              >
                <Heart className={`h-4 w-4 ${(userLikeData as { liked?: boolean })?.liked ? "fill-current" : ""}`} />
                {post.likesCount || 0}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpand}
                className="gap-1"
                data-testid={`button-comments-post-${post.id}`}
              >
                <MessageCircle className="h-4 w-4" />
                {post.commentsCount || 0}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1" disabled>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {isExpanded && isAuthenticated && (
              <div className="mt-4 pt-4 border-t">
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
                    data-testid={`input-comment-post-${post.id}`}
                  />
                  <Button
                    size="icon"
                    onClick={() => commentInput.trim() && onComment(commentInput)}
                    disabled={!commentInput.trim()}
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
