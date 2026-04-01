import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { db } from '@/db';
import { readingProgress, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getTotalVersesRead,
  getCurrentReadingPosition,
  markVerseAsRead,
} from '@/lib/progressTracker';

type ResponseData = {
  error?: string;
  success?: boolean;
  message?: string;
  completedVerses?: Array<{ chapter: number; verse: number }>;
  lastChapter?: number;
  lastVerse?: number;
  totalRead?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET: Fetch user's reading progress
  if (req.method === 'GET') {
    try {
      const userRecord = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });

      if (!userRecord) {
        return res.status(200).json({
          completedVerses: [],
          lastChapter: 1,
          lastVerse: 1,
          totalRead: 0,
        });
      }

      const progress = await db
        .select()
        .from(readingProgress)
        .where(
          and(
            eq(readingProgress.userId, userRecord.id),
            eq(readingProgress.isCompleted, 1)
          )
        );

      const totalRead = await getTotalVersesRead(userRecord.id);
      const currentPosition = await getCurrentReadingPosition(userRecord.id);

      return res.status(200).json({
        completedVerses: progress.map((p) => ({
          chapter: p.chapterId,
          verse: p.verseNumber,
        })),
        lastChapter: currentPosition?.chapterId || 1,
        lastVerse: currentPosition?.verseNumber || 1,
        totalRead,
      });
    } catch (error) {
      console.error('Failed to fetch reading progress:', error);
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  // POST: Mark verse as read
  if (req.method === 'POST') {
    try {
      const { chapterId, verseNumber } = req.body;

      if (!chapterId || !verseNumber) {
        return res.status(400).json({
          error: 'chapterId and verseNumber are required',
        });
      }

      let userRecord = await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      });

      // Create user if doesn't exist
      if (!userRecord) {
        const userId = `user_${Date.now()}`;
        await db.insert(users).values({
          id: userId,
          email: session.user.email!,
          name: session.user.name || undefined,
          image: session.user.image || undefined,
        });

        userRecord = await db.query.users.findFirst({
          where: eq(users.email, session.user.email),
        });
      }

      if (!userRecord) {
        return res.status(500).json({ error: 'Failed to create user record' });
      }

      await markVerseAsRead(userRecord.id, chapterId, verseNumber);

      return res.status(200).json({ success: true, message: 'Progress saved' });
    } catch (error) {
      console.error('Failed to save reading progress:', error instanceof Error ? error.message : String(error));
      console.error('Full error:', error);
      return res.status(500).json({ error: 'Failed to save progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}