"use server";

import { db, notices, letters, timelineEvents } from "@/db";
import { eq, desc } from "drizzle-orm";

// Helper to check if database is configured
function isDbAvailable() {
  return !!process.env.DATABASE_URL;
}

// ---------------- Notice Actions ----------------

export async function saveNoticeAction(
  sessionId: string,
  title: string,
  content: string,
  metadata: any
) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const result = await db.insert(notices).values({
      sessionId,
      title,
      content,
      metadata,
    }).returning();
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("saveNoticeAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getNoticesAction(sessionId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const list = await db
      .select()
      .from(notices)
      .where(eq(notices.sessionId, sessionId))
      .orderBy(desc(notices.createdAt));
    return { success: true, data: list };
  } catch (error: any) {
    console.error("getNoticesAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteNoticeAction(noticeId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    await db.delete(notices).where(eq(notices.id, noticeId));
    return { success: true };
  } catch (error: any) {
    console.error("deleteNoticeAction error:", error);
    return { success: false, error: error.message };
  }
}

// ---------------- Letter Actions ----------------

export async function saveLetterAction(
  sessionId: string,
  type: string,
  recipient: string,
  subject: string,
  content: string
) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const result = await db.insert(letters).values({
      sessionId,
      type,
      recipient,
      subject,
      content,
    }).returning();
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("saveLetterAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getLettersAction(sessionId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const list = await db
      .select()
      .from(letters)
      .where(eq(letters.sessionId, sessionId))
      .orderBy(desc(letters.createdAt));
    return { success: true, data: list };
  } catch (error: any) {
    console.error("getLettersAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLetterAction(letterId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    await db.delete(letters).where(eq(letters.id, letterId));
    return { success: true };
  } catch (error: any) {
    console.error("deleteLetterAction error:", error);
    return { success: false, error: error.message };
  }
}

// ---------------- Timeline Actions ----------------

export async function saveTimelineEventAction(
  sessionId: string,
  eventDate: string,
  title: string,
  description: string,
  category: string
) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const result = await db.insert(timelineEvents).values({
      sessionId,
      eventDate,
      title,
      description,
      category,
    }).returning();
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error("saveTimelineEventAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function getTimelineEventsAction(sessionId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    const list = await db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.sessionId, sessionId))
      .orderBy(desc(timelineEvents.eventDate));
    return { success: true, data: list };
  } catch (error: any) {
    console.error("getTimelineEventsAction error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTimelineEventAction(eventId: string) {
  if (!isDbAvailable()) {
    return { success: false, error: "Database not configured" };
  }
  try {
    await db.delete(timelineEvents).where(eq(timelineEvents.id, eventId));
    return { success: true };
  } catch (error: any) {
    console.error("deleteTimelineEventAction error:", error);
    return { success: false, error: error.message };
  }
}
