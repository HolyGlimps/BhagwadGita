import { db } from '@/db';
import { readingProgress } from '@/db/schema';
import { eq, and, count, desc } from 'drizzle-orm';

export async function markVerseAsRead(
  userId: string,
  chapterId: number,
  verseNumber: number
) {
  return await db
    .insert(readingProgress)
    .values({
      userId,
      chapterId,
      verseNumber,
      isCompleted: 1,
      readAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [
        readingProgress.userId,
        readingProgress.chapterId,
        readingProgress.verseNumber,
      ],
      set: {
        isCompleted: 1,
        readAt: new Date(),
        updatedAt: new Date(),
      },
    })
    .returning();
}

export async function getTotalVersesRead(userId: string) {
  const result = await db
    .select({ total: count() })
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.isCompleted, 1)
      )
    );

  return result[0]?.total || 0;
}

export async function getUserChapters(userId: string) {
  const chapters = await db
    .selectDistinct({ chapterId: readingProgress.chapterId })
    .from(readingProgress)
    .where(
      and(
        eq(readingProgress.userId, userId),
        eq(readingProgress.isCompleted, 1)
      )
    );

  return chapters.map((ch) => ch.chapterId);
}

export async function getCurrentReadingPosition(userId: string) {
  const lastRead = await db.query.readingProgress.findFirst({
    where: eq(readingProgress.userId, userId),
    orderBy: desc(readingProgress.readAt),
  });

  return lastRead
    ? {
      chapterId: lastRead.chapterId,
      verseNumber: lastRead.verseNumber,
      readAt: lastRead.readAt,
    }
    : null;
}

export async function getUserProgressSummary(userId: string) {
  const totalVerses = await getTotalVersesRead(userId);
  const chapters = await getUserChapters(userId);
  const currentPosition = await getCurrentReadingPosition(userId);

  return {
    totalVersesRead: totalVerses,
    chaptersStarted: chapters.length,
    chaptersCompleted: 0,
    currentPosition,
    lastUpdated: new Date(),
  };
}