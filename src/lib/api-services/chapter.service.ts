import { fetchChapter } from '../api-utils/rapidapi.client';
import { validateChapterId } from '../api-utils/validation';

/**
 * Chapter Service
 * Business logic for chapter-related operations
 * Handles data fetching, validation, and transformation
 */

/**
 * Get chapter data
 * @param chapterId - ID of the chapter to fetch
 * @returns Chapter data from RapidAPI
 * @throws Error if chapter ID is invalid or API call fails
 */
export async function getChapterData(chapterId: string | string[]): Promise<any> {
  // Validate input
  validateChapterId(chapterId);

  // Fetch from external API
  const chapter = await fetchChapter(chapterId);

  return chapter;
}

/**
 * Get chapter verses metadata
 * Returns chapter data which includes verses_count
 * Used by the verse dropdown selector to know how many verses exist
 * 
 * @param chapterId - ID of the chapter
 * @returns Chapter data with verses_count
 * @throws Error if API call fails
 */
export async function getChapterVersesMetadata(chapterId: string | string[]): Promise<any> {
  // Same as getChapterData - RapidAPI returns full chapter info
  // which includes verses_count at the top level
  return getChapterData(chapterId);
}

/**
 * Transform chapter data for client response (if needed)
 * Currently passes through, but useful for future transformations
 */
export function transformChapterResponse(data: any): any {
  return {
    ...data,
    // Can add computed fields here, reformat data, etc.
  };
}
