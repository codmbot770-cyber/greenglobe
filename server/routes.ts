import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema, insertCompetitionSchema, insertUserScoreSchema, insertEventRegistrationSchema, insertProblemSchema, insertCommunityPostSchema, insertPostCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Events routes
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Failed to create event" });
    }
  });

  // Competitions routes
  app.get("/api/competitions", async (_req, res) => {
    try {
      const competitions = await storage.getCompetitions();
      res.json(competitions);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      res.status(500).json({ message: "Failed to fetch competitions" });
    }
  });

  app.get("/api/competitions/:id", async (req, res) => {
    try {
      const competition = await storage.getCompetition(parseInt(req.params.id));
      if (!competition) {
        return res.status(404).json({ message: "Competition not found" });
      }
      res.json(competition);
    } catch (error) {
      console.error("Error fetching competition:", error);
      res.status(500).json({ message: "Failed to fetch competition" });
    }
  });

  app.get("/api/competitions/:id/questions", isAuthenticated, async (req, res) => {
    try {
      const questions = await storage.getQuestionsByCompetition(parseInt(req.params.id));
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post("/api/competitions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertCompetitionSchema.parse(req.body);
      const competition = await storage.createCompetition(validatedData);
      res.status(201).json(competition);
    } catch (error) {
      console.error("Error creating competition:", error);
      res.status(400).json({ message: "Failed to create competition" });
    }
  });

  // User scores routes
  app.get("/api/user/scores", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const scores = await storage.getUserScores(userId);
      res.json(scores);
    } catch (error) {
      console.error("Error fetching user scores:", error);
      res.status(500).json({ message: "Failed to fetch scores" });
    }
  });

  app.post("/api/user/scores", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserScoreSchema.parse({
        ...req.body,
        userId,
      });
      const score = await storage.createUserScore(validatedData);
      res.status(201).json(score);
    } catch (error) {
      console.error("Error creating user score:", error);
      res.status(400).json({ message: "Failed to save score" });
    }
  });

  // Event registrations routes
  app.get("/api/user/registrations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const registrations = await storage.getUserRegistrations(userId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.post("/api/user/registrations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertEventRegistrationSchema.parse({
        ...req.body,
        userId,
      });
      const registration = await storage.createEventRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(400).json({ message: "Failed to register for event" });
    }
  });

  // Problems routes
  app.get("/api/problems", async (_req, res) => {
    try {
      const problems = await storage.getProblems();
      res.json(problems);
    } catch (error) {
      console.error("Error fetching problems:", error);
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  app.get("/api/problems/:id", async (req, res) => {
    try {
      const problem = await storage.getProblem(parseInt(req.params.id));
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      console.error("Error fetching problem:", error);
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  app.get("/api/user/problems", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const problems = await storage.getUserProblems(userId);
      res.json(problems);
    } catch (error) {
      console.error("Error fetching user problems:", error);
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  app.post("/api/problems", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProblemSchema.parse({
        ...req.body,
        userId,
      });
      const problem = await storage.createProblem(validatedData);
      res.status(201).json(problem);
    } catch (error) {
      console.error("Error creating problem:", error);
      res.status(400).json({ message: "Failed to report problem" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (_req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Blog posts routes (feedback and ideas - separate from community)
  app.get("/api/blogs", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/blogs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { title, content, postType } = req.body;
      
      if (!['feedback', 'idea'].includes(postType)) {
        return res.status(400).json({ message: "Blog post type must be 'feedback' or 'idea'" });
      }
      
      const validatedData = insertCommunityPostSchema.parse({
        title,
        content,
        postType,
        userId,
      });
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  // Community posts routes (general, review, wish - separate from blogs)
  app.get("/api/community/posts", async (_req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/community/posts/:id", async (req, res) => {
    try {
      const post = await storage.getCommunityPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.get("/api/user/community/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const posts = await storage.getUserCommunityPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/community/posts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postType } = req.body;
      
      // Community posts only accept general, review, wish types (not feedback/idea which are for blogs)
      if (postType && ['feedback', 'idea'].includes(postType)) {
        return res.status(400).json({ message: "Use /api/blogs endpoint for feedback and idea posts" });
      }
      
      const validatedData = insertCommunityPostSchema.parse({
        ...req.body,
        userId,
      });
      const post = await storage.createCommunityPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.delete("/api/community/posts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const post = await storage.getCommunityPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      if (post.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this post" });
      }
      
      await storage.deleteCommunityPost(postId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Post likes routes
  app.get("/api/community/posts/:id/likes", async (req, res) => {
    try {
      const likes = await storage.getPostLikes(parseInt(req.params.id));
      res.json(likes);
    } catch (error) {
      console.error("Error fetching likes:", error);
      res.status(500).json({ message: "Failed to fetch likes" });
    }
  });

  app.get("/api/community/posts/:id/user-like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const like = await storage.getUserPostLike(parseInt(req.params.id), userId);
      res.json({ liked: !!like });
    } catch (error) {
      console.error("Error checking like:", error);
      res.status(500).json({ message: "Failed to check like" });
    }
  });

  app.post("/api/community/posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      
      const existingLike = await storage.getUserPostLike(postId, userId);
      if (existingLike) {
        return res.status(400).json({ message: "Already liked" });
      }
      
      const like = await storage.createPostLike({ postId, userId });
      res.status(201).json(like);
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete("/api/community/posts/:id/like", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.deletePostLike(postId, userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Post comments routes
  app.get("/api/community/posts/:id/comments", async (req, res) => {
    try {
      const comments = await storage.getPostComments(parseInt(req.params.id));
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/community/posts/:id/comments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const validatedData = insertPostCommentSchema.parse({
        ...req.body,
        postId,
        userId,
      });
      const comment = await storage.createPostComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: "Failed to create comment" });
    }
  });

  app.delete("/api/community/comments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commentId = parseInt(req.params.id);
      const comment = await storage.getPostComment(commentId);
      
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      
      if (comment.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
      
      await storage.deletePostComment(commentId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Users endpoint for community (to get user details for posts)
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  return httpServer;
}
