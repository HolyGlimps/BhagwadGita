import { getCachedVerse, clearVerseCache } from '@/lib/cache/verseOfTheDayCache';

export function getCacheStatus() {
  const cached = getCachedVerse();

  if (!cached) {
    return {
      isCached: false,
      expiresIn: null,
      expiresAt: null,
      message: 'No verse in cache',
    };
  }

  try {
    const storageData = window.localStorage.getItem('bhagavad_gita_verse_of_day');
    if (!storageData) {
      return { isCached: false, message: 'Cache corrupted' };
    }

    const { timestamp } = JSON.parse(storageData);
    const now = Date.now();
    const cacheAge = now - timestamp;
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
    const timeRemaining = CACHE_DURATION_MS - cacheAge;

    const hoursRemaining = Math.round(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.round((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const expiresAt = new Date(timestamp + CACHE_DURATION_MS);

    return {
      isCached: true,
      cachedVerse: cached,
      hoursRemaining,
      minutesRemaining,
      expiresAt: expiresAt.toLocaleString(),
      message: `Expires in ${hoursRemaining}h ${minutesRemaining}m`,
    };
  } catch (error) {
    return {
      isCached: false,
      message: 'Cache read error',
      error,
    };
  }
}

export function refreshVerse() {
  try {
    clearVerseCache();
    console.log('[CACHE] Verse cache cleared. Reload page to fetch fresh verse.');
    return true;
  } catch (error) {
    console.error('[CACHE ERROR] Failed to clear cache:', error);
    return false;
  }
}

if (typeof window !== 'undefined') {
  (window as any).__verseCache = {
    status: getCacheStatus,
    refresh: refreshVerse,
    clear: clearVerseCache,
    getStatus: getCacheStatus,
    refreshVerse: refreshVerse,
  };
}

export { clearVerseCache };