import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notices = pgTable("notices", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<{
    noticeType?: string;
    issueDate?: string;
    deadlineDate?: string;
    daysRemaining?: number;
    rentOwed?: number;
    landlordName?: string;
    tenantName?: string;
    complianceIssues?: string[];
    actionChecklist?: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const letters = pgTable("letters", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(), // 'repair_request', 'rent_dispute', etc.
  recipient: text("recipient").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timelineEvents = pgTable("timeline_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: text("session_id").notNull(),
  eventDate: text("event_date").notNull(), // Store as string for flexibility YYYY-MM-DD
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // 'notice', 'repair', 'communication', 'payment', 'other'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
