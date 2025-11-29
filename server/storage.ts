import {
  users,
  events,
  competitions,
  competitionQuestions,
  userScores,
  eventRegistrations,
  problems,
  communityPosts,
  postLikes,
  postComments,
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
  type Problem,
  type InsertProblem,
  type CommunityPost,
  type InsertCommunityPost,
  type PostLike,
  type InsertPostLike,
  type PostComment,
  type InsertPostComment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

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

  // Problems
  getProblems(): Promise<Problem[]>;
  getProblem(id: number): Promise<Problem | undefined>;
  getUserProblems(userId: string): Promise<Problem[]>;
  createProblem(problem: InsertProblem): Promise<Problem>;

  // Leaderboard
  getAllScores(): Promise<UserScore[]>;
  getLeaderboard(): Promise<{ userId: string; totalScore: number; quizCount: number }[]>;

  // Community posts
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPost(id: number): Promise<CommunityPost | undefined>;
  getUserCommunityPosts(userId: string): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  deleteCommunityPost(id: number): Promise<void>;

  // Post likes
  getPostLikes(postId: number): Promise<PostLike[]>;
  getUserPostLike(postId: number, userId: string): Promise<PostLike | undefined>;
  createPostLike(like: InsertPostLike): Promise<PostLike>;
  deletePostLike(postId: number, userId: string): Promise<void>;

  // Post comments
  getPostComments(postId: number): Promise<PostComment[]>;
  createPostComment(comment: InsertPostComment): Promise<PostComment>;
  deletePostComment(id: number): Promise<void>;
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

  // Problems
  async getProblems(): Promise<Problem[]> {
    return db.select().from(problems).orderBy(desc(problems.createdAt));
  }

  async getProblem(id: number): Promise<Problem | undefined> {
    const [problem] = await db.select().from(problems).where(eq(problems.id, id));
    return problem;
  }

  async getUserProblems(userId: string): Promise<Problem[]> {
    return db.select().from(problems).where(eq(problems.userId, userId)).orderBy(desc(problems.createdAt));
  }

  async createProblem(problem: InsertProblem): Promise<Problem> {
    const [newProblem] = await db.insert(problems).values(problem).returning();
    return newProblem;
  }

  // Leaderboard
  async getAllScores(): Promise<UserScore[]> {
    return db.select().from(userScores).orderBy(desc(userScores.score));
  }

  async getLeaderboard(): Promise<{ userId: string; totalScore: number; quizCount: number }[]> {
    const result = await db
      .select({
        userId: userScores.userId,
        totalScore: sql<number>`sum(${userScores.score})::int`,
        quizCount: sql<number>`count(*)::int`,
      })
      .from(userScores)
      .groupBy(userScores.userId)
      .orderBy(desc(sql`sum(${userScores.score})`))
      .limit(10);
    return result;
  }

  // Community posts
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return db.select().from(communityPosts).where(eq(communityPosts.isPublished, true)).orderBy(desc(communityPosts.createdAt));
  }

  async getCommunityPost(id: number): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post;
  }

  async getUserCommunityPosts(userId: string): Promise<CommunityPost[]> {
    return db.select().from(communityPosts).where(eq(communityPosts.userId, userId)).orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db.insert(communityPosts).values(post).returning();
    return newPost;
  }

  async deleteCommunityPost(id: number): Promise<void> {
    await db.delete(communityPosts).where(eq(communityPosts.id, id));
  }

  // Post likes
  async getPostLikes(postId: number): Promise<PostLike[]> {
    return db.select().from(postLikes).where(eq(postLikes.postId, postId));
  }

  async getUserPostLike(postId: number, userId: string): Promise<PostLike | undefined> {
    const [like] = await db.select().from(postLikes).where(
      sql`${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId}`
    );
    return like;
  }

  async createPostLike(like: InsertPostLike): Promise<PostLike> {
    const [newLike] = await db.insert(postLikes).values(like).returning();
    await db.update(communityPosts).set({
      likesCount: sql`${communityPosts.likesCount} + 1`
    }).where(eq(communityPosts.id, like.postId));
    return newLike;
  }

  async deletePostLike(postId: number, userId: string): Promise<void> {
    await db.delete(postLikes).where(
      sql`${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId}`
    );
    await db.update(communityPosts).set({
      likesCount: sql`${communityPosts.likesCount} - 1`
    }).where(eq(communityPosts.id, postId));
  }

  // Post comments
  async getPostComments(postId: number): Promise<PostComment[]> {
    return db.select().from(postComments).where(eq(postComments.postId, postId)).orderBy(desc(postComments.createdAt));
  }

  async createPostComment(comment: InsertPostComment): Promise<PostComment> {
    const [newComment] = await db.insert(postComments).values(comment).returning();
    await db.update(communityPosts).set({
      commentsCount: sql`${communityPosts.commentsCount} + 1`
    }).where(eq(communityPosts.id, comment.postId));
    return newComment;
  }

  async deletePostComment(id: number): Promise<void> {
    const [comment] = await db.select().from(postComments).where(eq(postComments.id, id));
    if (comment) {
      await db.delete(postComments).where(eq(postComments.id, id));
      await db.update(communityPosts).set({
        commentsCount: sql`${communityPosts.commentsCount} - 1`
      }).where(eq(communityPosts.id, comment.postId));
    }
  }
}

export const storage = new DatabaseStorage();
