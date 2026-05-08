import { db } from '@/db';
import { verseContent } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getVerseData } from './api-services/verse.service';
import { fetchChapter } from './api-utils/rapidapi.client';
import { backgroundCacheVerses } from './chapterVerses';

export async function getVerse(chapterId: number, verseNumber: number) {
  const cachedVerse = await db.query.verseContent.findFirst({
    where: and(
      eq(verseContent.chapterId, chapterId),
      eq(verseContent.verseNumber, verseNumber)
    ),
  });

  if (cachedVerse) {
    console.log(
      `[CACHE HIT] Chapter ${chapterId}, Verse ${verseNumber} from database`
    );
    return cachedVerse;
  }

  console.log(
    `[CACHE MISS] Fetching Chapter ${chapterId}, Verse ${verseNumber} from API`
  );

  try {
    const apiVerse = await getVerseData(chapterId.toString(), verseNumber.toString());
    if (!apiVerse || apiVerse.detail === 'Verse not found') {
      return undefined;
    }

    const stored = await db
      .insert(verseContent)
      .values({
        chapterId,
        verseNumber,
        text: apiVerse.text,
        transliteration: apiVerse.transliteration,
        translations: apiVerse.translations as any,
        commentaries: apiVerse.commentaries as any,
      })
      .returning();

    console.log(
      `[STORED] Chapter ${chapterId}, Verse ${verseNumber} saved to database`
    );

    try {
      const chapterData = await fetchChapter(chapterId.toString());
      const verses = chapterData.verses || [];
      if (verses.length > 1) {
        const versesToCache = verses.filter((v: any) => v.verse_number !== verseNumber);
        backgroundCacheVerses(versesToCache, chapterId);
      }
    } catch (err) {
      console.error('[Background Cache] Failed to trigger:', err);
    }

    return stored[0];
  } catch (error: any) {
    if (error?.response?.status === 404 || error?.message?.includes('Verse not found')) {
      return undefined;
    }
    console.error('Error fetching verse from API:', error);
    throw error;
  }
}
