import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertEventSchema, insertCompetitionSchema, insertUserScoreSchema, insertEventRegistrationSchema, insertProblemSchema } from "@shared/schema";

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

  return httpServer;
}
