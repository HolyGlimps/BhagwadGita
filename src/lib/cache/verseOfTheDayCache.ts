import { VerseOfTheDayData } from '@/store/store';

interface CachedVerseData {
  verse: VerseOfTheDayData;
  timestamp: number;
}

const VERSE_CACHE_KEY = 'bhagavad_gita_verse_of_day';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getCachedVerse(): VerseOfTheDayData | null {
  if (!isLocalStorageAvailable()) {
    console.log('[CACHE] localStorage unavailable (server-side render?)');
    return null;
  }

  try {
    const cachedData = window.localStorage.getItem(VERSE_CACHE_KEY);

    if (!cachedData) {
      console.log('[CACHE MISS] No verse cached in localStorage');
      return null;
    }

    const parsedData: CachedVerseData = JSON.parse(cachedData);

    const now = Date.now();
    const cacheAge = now - parsedData.timestamp;

    if (cacheAge < CACHE_DURATION_MS) {
      const hoursRemaining = Math.round((CACHE_DURATION_MS - cacheAge) / (60 * 60 * 1000));
      console.log(
        `[CACHE HIT] Verse valid for ${hoursRemaining} more hours`
      );
      return parsedData.verse;
    } else {
      const hoursSinceExpiry = Math.round((cacheAge - CACHE_DURATION_MS) / (60 * 60 * 1000));
      console.log(
        `[CACHE EXPIRED] Verse is ${hoursSinceExpiry} hours old (need fresh one)`
      );
      return null;
    }
  } catch (error) {
    console.error('[CACHE ERROR] Failed to read cached verse:', error);
    return null;
  }
}

export function setCachedVerse(verse: VerseOfTheDayData): void {
  if (!isLocalStorageAvailable()) {
    console.log('[CACHE] Cannot save - localStorage unavailable');
    return;
  }

  try {
    const cacheData: CachedVerseData = {
      verse,
      timestamp: Date.now(),
    };

    const jsonData = JSON.stringify(cacheData);

    window.localStorage.setItem(VERSE_CACHE_KEY, jsonData);
    console.log('[CACHE SAVED] Verse of the day cached (24-hour validity)');
  } catch (error) {
    console.error('[CACHE ERROR] Failed to save verse:', error);
  }
}

export function clearVerseCache(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    window.localStorage.removeItem(VERSE_CACHE_KEY);
    console.log('[CACHE CLEARED] Verse of the day cleared');
  } catch (error) {
    console.error('[CACHE ERROR] Failed to clear cache:', error);
  }
}