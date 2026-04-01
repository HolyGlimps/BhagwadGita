import { db } from '@/db';
import { verseContent } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getVerseData } from './api-services/verse.service';
import { fetchChapter } from './api-utils/rapidapi.client';

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
    return stored[0];
  } catch (error) {
    console.error('Error fetching verse from API:', error);
    throw error;
  }
}

// REMOVED: getChapterVerses - unused function (logic moved to API endpoint)
async function _REMOVED_getChapterVerses(chapterId: number) {
  try {
    const chapterData = await fetchChapter(chapterId.toString());
    const versesCount = chapterData.verses_count || chapterData.verses?.length || 0;

    const cachedVerses = await db.query.verseContent.findMany({
      where: eq(verseContent.chapterId, chapterId),
    });

    console.log(
      `[INFO] Chapter ${chapterId}: ${cachedVerses.length}/${versesCount} verses in cache`
    );

    return {
      chapterId,
      totalVerses: versesCount,
      cachedCount: cachedVerses.length,
      cachedVerses,
    };
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    throw error;
  }
}