import {
  users,
  events,
  competitions,
  competitionQuestions,
  userScores,
  eventRegistrations,
  type User,
  type UpsertUser,
  type Event,
  type InsertEvent,
  type Competition,
  type InsertCompetition,
  type CompetitionQuestion,
  type InsertQuestion,
  type UserScore,
  type InsertUserScore,
  type EventRegistration,
  type InsertEventRegistration,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Event operations
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;

  // Competition operations
  getCompetitions(): Promise<Competition[]>;
  getCompetition(id: number): Promise<Competition | undefined>;
  createCompetition(competition: InsertCompetition): Promise<Competition>;

  // Competition questions
  getQuestionsByCompetition(competitionId: number): Promise<CompetitionQuestion[]>;
  createQuestion(question: InsertQuestion): Promise<CompetitionQuestion>;

  // User scores
  getUserScores(userId: string): Promise<UserScore[]>;
  createUserScore(score: InsertUserScore): Promise<UserScore>;

  // Event registrations
  getUserRegistrations(userId: string): Promise<EventRegistration[]>;
  createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.eventDate));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  // Competition operations
  async getCompetitions(): Promise<Competition[]> {
    return db.select().from(competitions).orderBy(desc(competitions.createdAt));
  }

  async getCompetition(id: number): Promise<Competition | undefined> {
    const [competition] = await db.select().from(competitions).where(eq(competitions.id, id));
    return competition;
  }

  async createCompetition(competition: InsertCompetition): Promise<Competition> {
    const [newCompetition] = await db.insert(competitions).values(competition).returning();
    return newCompetition;
  }

  // Competition questions
  async getQuestionsByCompetition(competitionId: number): Promise<CompetitionQuestion[]> {
    return db.select().from(competitionQuestions).where(eq(competitionQuestions.competitionId, competitionId));
  }

  async createQuestion(question: InsertQuestion): Promise<CompetitionQuestion> {
    const [newQuestion] = await db.insert(competitionQuestions).values(question).returning();
    return newQuestion;
  }

  // User scores
  async getUserScores(userId: string): Promise<UserScore[]> {
    return db.select().from(userScores).where(eq(userScores.userId, userId)).orderBy(desc(userScores.completedAt));
  }

  async createUserScore(score: InsertUserScore): Promise<UserScore> {
    const [newScore] = await db.insert(userScores).values(score).returning();
    return newScore;
  }

  // Event registrations
  async getUserRegistrations(userId: string): Promise<EventRegistration[]> {
    return db.select().from(eventRegistrations).where(eq(eventRegistrations.userId, userId)).orderBy(desc(eventRegistrations.registeredAt));
  }

  async createEventRegistration(registration: InsertEventRegistration): Promise<EventRegistration> {
    const [newRegistration] = await db.insert(eventRegistrations).values(registration).returning();
    return newRegistration;
  }
}

export const storage = new DatabaseStorage();
