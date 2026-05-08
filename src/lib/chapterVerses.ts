import { db } from '@/db';
import { verseContent } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getVerseData } from './api-services/verse.service';
import { fetchChapter } from './api-utils/rapidapi.client';

export async function backgroundCacheVerses(verses: any[], chapterId: number) {
  try {
    const versesToCache = [];

    for (const verse of verses) {
      try {
        const existing = await db.query.verseContent.findFirst({
          where: eq(verseContent.chapterId, chapterId) &&
            eq(verseContent.verseNumber, verse.verse_number),
        });

        if (!existing) {
          versesToCache.push({
            chapterId,
            verseNumber: verse.verse_number,
            text: verse.text,
            transliteration: verse.transliteration,
            translations: verse.translations as any,
            commentaries: verse.commentaries as any,
          });
        }
      } catch (error) {
        console.error(
          `[Background Cache Error] Verse ${verse.verse_number}:`,
          error
        );
      }
    }

    if (versesToCache.length > 0) {
      await db.insert(verseContent).values(versesToCache);
    }
  } catch (error) {
    console.error(`[Background Cache Failed]:`, error);
  }
}

export async function getChapterAllVerses(chapterId: number) {
  try {
    const chapterData = await fetchChapter(chapterId.toString());
    const totalVerses = chapterData.verses_count || 0;

    const cachedVerses = await db.query.verseContent.findMany({
      where: eq(verseContent.chapterId, chapterId),
    });

    console.log(`[DB Cache] Chapter ${chapterId}: Found ${cachedVerses.length}/${totalVerses} verses in cache`);

    const result = {
      chapterId,
      totalVerses,
      verses: cachedVerses.sort((a, b) => a.verseNumber - b.verseNumber),
      cached: true,
      source: cachedVerses.length === totalVerses ? 'full-cache' : 'partial-cache',
    };

    if (cachedVerses.length < totalVerses) {
      const cachedNumbers = new Set(cachedVerses.map(v => v.verseNumber));
      const missingVerses = [];

      for (let i = 1; i <= totalVerses; i++) {
        if (!cachedNumbers.has(i)) {
          missingVerses.push(i);
        }
      }

      console.log(`[Background Fetch] Starting background fetch of ${missingVerses.length} missing verses`);

      backgroundFetchMissingVerses(chapterId, missingVerses).catch(err =>
        console.error('Background fetch failed:', err)
      );
    }

    return result;
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    throw error;
  }
}

async function backgroundFetchMissingVerses(chapterId: number, verseNumbers: number[]) {
  const batchSize = 5;
  const delayBetweenBatches = 100; // ms delay between batches

  for (let i = 0; i < verseNumbers.length; i += batchSize) {
    const batch = verseNumbers.slice(i, i + batchSize);
    const batchPromises = batch.map((verseNum) =>
      getVerseData(chapterId.toString(), verseNum.toString())
        .then(verseData => ({
          chapterId,
          verseNumber: verseData.verse_number || verseNum,
          text: verseData.text,
          transliteration: verseData.transliteration,
          translations: verseData.translations as any,
          commentaries: verseData.commentaries as any,
        }))
        .catch(error => {
          console.error(`[Background Fetch] Failed to fetch verse ${verseNum}:`, error);
          return null;
        })
    );

    try {
      const verseDataBatch = await Promise.all(batchPromises);
      const validVerses = verseDataBatch.filter(v => v !== null);

      // Batch insert
      if (validVerses.length > 0) {
        await db.insert(verseContent).values(validVerses as any);
        console.log(`[Background Fetch] Cached ${validVerses.length} verses (batch ${i / batchSize + 1})`);
      }

      // Delay before next batch to be nice to the API
      if (i + batchSize < verseNumbers.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    } catch (error) {
      console.error('[Background Fetch] Batch insert failed:', error);
    }
  }

  console.log(`[Background Fetch] Completed fetching all ${verseNumbers.length} missing verses`);
}