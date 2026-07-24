import axios from 'axios';

export interface VerseStreamResult {
  verseNumber: number;
  cached: boolean;
  data: any;
  error?: string;
}

export async function fetchVerseWithCacheStatus(
  chapterId: number,
  verseNumber: number,
  signal?: AbortSignal
): Promise<VerseStreamResult> {
  try {
    const response = await axios.get(
      `/api/chapters/${chapterId}/verses/${verseNumber}`,
      { signal }
    );

    const verseData = response.data?.data || response.data;
    const source = response.data?.source || 'api';

    return {
      verseNumber,
      cached: source === 'cache',
      data: verseData,
    };
  } catch (error: any) {
    if (
      error.name === 'AbortError' ||
      axios.isCancel(error) ||
      error.code === 'ERR_CANCELED' ||
      signal?.aborted
    ) {
      console.log(`[Streaming] Verse ${verseNumber} fetch cancelled`);
      return {
        verseNumber,
        cached: false,
        data: null,
        error: 'Cancelled',
      };
    }

    console.error(
      `[Streaming] Error fetching verse ${verseNumber}:`,
      error.response?.data || error.message || error
    );
    return {
      verseNumber,
      cached: false,
      data: null,
      error: `Failed to fetch verse ${verseNumber}`,
    };
  }
}

export async function streamChapterVerses(
  chapterId: number,
  totalVerses: number,
  onVerse?: (result: VerseStreamResult) => void,
  concurrency: number = 1,
  signal?: AbortSignal
): Promise<VerseStreamResult[]> {
  const results: VerseStreamResult[] = [];

  const verseQueue = Array.from(
    { length: totalVerses },
    (_, i) => i + 1
  );

  while (verseQueue.length > 0) {
    if (signal?.aborted) {
      console.log('[Streaming] Streaming aborted by user navigation');
      break;
    }

    const batch = verseQueue.splice(0, concurrency);

    const batchPromises = batch.map((verseNumber) =>
      fetchVerseWithCacheStatus(chapterId, verseNumber, signal)
    );

    const batchSettled = await Promise.allSettled(batchPromises);

    for (const settled of batchSettled) {
      if (settled.status === 'rejected') {
        console.log('[Streaming] Fetch rejected (likely due to abort):', settled.reason);
        continue;
      }

      const result = settled.value;

      if (result.error === 'Cancelled') {
        continue;
      }

      results.push(result);

      if (onVerse) {
        onVerse(result);
      }
    }

    if (verseQueue.length > 0 && !signal?.aborted) {
      // Increased delay to 500ms to avoid RapidAPI rate limits (429 Too Many Requests)
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}