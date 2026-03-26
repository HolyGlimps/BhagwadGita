import { fetchVerse } from '../api-utils/rapidapi.client';
import { validateChapterId, validateVerseNumber } from '../api-utils/validation';

/**
 * Verse Service
 * Business logic for verse-related operations
 * Handles verse fetching, validation, and transformation
 */

/**
 * Get specific verse data
 * @param chapterId - ID of the chapter containing the verse
 * @param verseNumber - Number of the verse to fetch
 * @returns Verse data from RapidAPI including text, translations, commentaries
 * @throws Error if parameters are invalid or API call fails
 */
export async function getVerseData(
  chapterId: string | string[],
  verseNumber: string | string[]
): Promise<any> {
  // Validate inputs
  validateChapterId(chapterId);
  validateVerseNumber(verseNumber);

  // Fetch from external API
  const verse = await fetchVerse(chapterId, verseNumber);

  return verse;
}

/**
 * Transform verse data for client response (if needed)
 * Currently passes through, but useful for future transformations
 * Such as filtering translations, normalizing commentary data, etc.
 */
export function transformVerseResponse(data: any): any {
  return {
    ...data,
    // Can add computed fields, filter data, reformat, etc.
  };
}

/**
 * Validate verse exists in chapter
 * Could be extended to check against chapter's verse count
 * @param verseNumber - Verse number to check
 * @param versesCount - Total verses in chapter
 * @returns true if verse is valid, throws error if not
 */
export function validateVerseInChapter(
  verseNumber: number | string,
  versesCount: number | string
): boolean {
  const verse = parseInt(verseNumber as string, 10);
  const count = parseInt(versesCount as string, 10);

  if (verse < 1 || verse > count) {
    throw new Error(
      `Verse number must be between 1 and ${count}`
    );
  }

  return true;
}
