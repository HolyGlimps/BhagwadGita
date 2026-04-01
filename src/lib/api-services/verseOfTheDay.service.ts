import { db } from '@/db';
import { verseOfTheDay } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getVerseData } from './verse.service';

export interface VerseOfTheDayResponse {
  id: number;
  chapterId: number;
  verseNumber: number;
  verseText: string;
  transliteration: string | null;
  meaning: string | null;
  author: string | null;
  expiresAt: Date;
  createdAt: Date;
  isCurrent: number;
}

export async function getVerseOfTheDay(): Promise<VerseOfTheDayResponse> {
  const now = new Date();

  try {
    const currentVerse = await db.query.verseOfTheDay.findFirst({
      where: eq(verseOfTheDay.isCurrent, 1),
    });

    if (currentVerse && new Date(currentVerse.expiresAt) > now) {
      console.log(
        `[VERSE OF DAY] Using current verse: Chapter ${currentVerse.chapterId}, Verse ${currentVerse.verseNumber}`
      );
      return currentVerse;
    }

    console.log('[VERSE OF DAY] Verse Expired or not found, generating new one...');

    const randomChapter = Math.floor(Math.random() * 18) + 1;
    const randomVerseNum = Math.floor(Math.random() * 20) + 1;

    console.log(
      `[VERSE OF DAY] Fetching: Chapter ${randomChapter}, Verse ${randomVerseNum}`
    );

    const apiVerse = await getVerseData(
      randomChapter.toString(),
      randomVerseNum.toString()
    );

    const firstTranslation = apiVerse.translations?.[0] || null;
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await db
      .update(verseOfTheDay)
      .set({ isCurrent: 0 })
      .where(eq(verseOfTheDay.isCurrent, 1));

    const savedVerse = await db
      .insert(verseOfTheDay)
      .values({
        chapterId: randomChapter,
        verseNumber: randomVerseNum,
        verseText: apiVerse.text || '',
        transliteration: apiVerse.transliteration || null,
        meaning: firstTranslation?.description || null,
        author: firstTranslation?.author_name || 'Unknown',
        translations: apiVerse.translations as any,
        expiresAt,
        isCurrent: 1,
      })
      .returning();

    const newVerse = savedVerse[0];

    console.log(
      `[VERSE OF DAY] Created new current verse for Chapter ${randomChapter}, Verse ${randomVerseNum}`
    );

    return newVerse;
  } catch (error) {
    console.error('[VERSE OF DAY ERROR] Failed to get/create verse:', error);

    const fallbackExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return {
      id: 0,
      chapterId: 2,
      verseNumber: 47,
      verseText: 'Karmanye vadhikaraste Ma Phaleshu Kadachana',
      transliteration: 'You have the right to perform your duty, but not the right to the fruits.',
      meaning:
        'You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.',
      author: 'Bhagavad Gita',
      createdAt: now,
      expiresAt: fallbackExpiresAt,
      isCurrent: 0,
    };
  }
}

export async function getHistoricalVerses(limit: number = 7) {
  try {
    const historicalVerses = await db.query.verseOfTheDay.findMany({
      where: eq(verseOfTheDay.isCurrent, 0),
      limit,
    });

    const sorted = [...historicalVerses].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log(
      `[VERSE OF DAY] Retrieved ${sorted.length} historical verses`
    );

    return sorted;
  } catch (error) {
    console.error('[VERSE OF DAY ERROR] Failed to get historical verses:', error);
    throw error;
  }
}

export async function forceRefreshVerseOfTheDay(): Promise<VerseOfTheDayResponse> {
  try {
    await db
      .update(verseOfTheDay)
      .set({ isCurrent: 0 })
      .where(eq(verseOfTheDay.isCurrent, 1));

    return getVerseOfTheDay();
  } catch (error) {
    console.error('[VERSE OF DAY ERROR] Failed to force refresh:', error);
    throw error;
  }
}