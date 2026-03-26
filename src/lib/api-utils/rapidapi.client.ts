import axios from 'axios';

/**
 * RapidAPI Client
 * Centralized HTTP client for all external API calls to RapidAPI
 * Handles headers, authentication, and base configuration
 */

const RAPID_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = process.env.RAPID_API_HOST;

interface RapidAPIConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

/**
 * Make authenticated request to RapidAPI
 * @param config - Request configuration with URL and method
 * @returns API response data
 */
export async function rapidAPIRequest<T = any>(config: RapidAPIConfig): Promise<T> {
  if (!RAPID_API_BASE_URL || !RAPID_API_KEY || !RAPID_API_HOST) {
    throw new Error('RapidAPI credentials not configured');
  }

  const response = await axios.request({
    method: config.method || 'GET',
    url: config.url,
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': RAPID_API_HOST,
    },
  });

  return response.data;
}

/**
 * Fetch chapter data from RapidAPI
 * @param chapterId - ID of the chapter
 * @returns Chapter data including chapter_number, name, verses_count, etc.
 */
export async function fetchChapter(chapterId: string | string[]): Promise<any> {
  return rapidAPIRequest({
    url: `${RAPID_API_BASE_URL}/v2/chapters/${chapterId}/`,
  });
}

/**
 * Fetch specific verse from RapidAPI
 * @param chapterId - ID of the chapter
 * @param verseNumber - Number of the verse
 * @returns Verse data including text, transliteration, translations, commentaries
 */
export async function fetchVerse(
  chapterId: string | string[],
  verseNumber: string | string[]
): Promise<any> {
  return rapidAPIRequest({
    url: `${RAPID_API_BASE_URL}/v2/chapters/${chapterId}/verses/${verseNumber}/`,
  });
}
