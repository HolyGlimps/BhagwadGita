import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { chapterStreamingState } from '@/store/store';
import { streamChapterVerses, VerseStreamResult } from '@/lib/api-services/verseStreaming.service';

interface Verse {
  id?: number;
  chapterId: number;
  verseNumber: number;
  text: string;
  transliteration?: string;
  translations?: any;
  commentaries?: any;
}

interface UseStreamingVersesReturn {
  verses: Verse[];
  totalVerses: number;
  loading: boolean;
  streaming: boolean;
  error: string | null;
  progress: number;
  versesLoaded: number;
}

export const useStreamingVerses = (
  chapterId: string | number | undefined
): UseStreamingVersesReturn => {
  const [globalStreaming, setGlobalStreaming] = useRecoilState(chapterStreamingState);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentChapterRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const numChapterId = chapterId ? Number(chapterId) : 0;

  const chapterStreaming = globalStreaming[numChapterId];

  const verses = chapterStreaming?.verses || [];
  const totalVerses = chapterStreaming?.totalVerses || 0;
  const versesLoaded = chapterStreaming?.versesLoaded || 0;
  const isStreaming = chapterStreaming?.isStreaming || false;
  const error = chapterStreaming?.error || null;
  const [loading, setLoading] = useState(false);

  const progress =
    totalVerses > 0
      ? Math.min(100, Math.round((versesLoaded / totalVerses) * 100))
      : 0;

  const startStreaming = useCallback(async () => {
    if (!chapterId) return;

    const numId = Number(chapterId);

    try {
      const currentGlobalState = globalStreaming;
      const existingState = currentGlobalState[numId];

      if (existingState && existingState.totalVerses > 0) {
        console.log(`[Streaming] Resuming verses for chapter ${numId} (${existingState.versesLoaded}/${existingState.totalVerses})`);
        setLoading(false);

        if (existingState.isStreaming || existingState.versesLoaded < existingState.totalVerses) {
          continueStreaming(numId, existingState.totalVerses);
        }
        return;
      }

      abortControllerRef.current = new AbortController();
      currentChapterRef.current = numId;
      const abortSignal = abortControllerRef.current.signal;

      if (!isMountedRef.current) return;

      setLoading(true);

      setGlobalStreaming((prev) => ({
        ...prev,
        [numId]: {
          chapterId: numId,
          verses: [],
          totalVerses: 0,
          versesLoaded: 0,
          isStreaming: true,
          error: null,
        },
      }));

      console.log(`[Streaming] Fetching metadata for chapter ${numId}`);
      const metaResponse = await axios.get(`/api/chapters/${numId}`, { signal: abortSignal });
      const total = metaResponse.data.verses_count || 0;

      if (total === 0) {
        if (isMountedRef.current) {
          setGlobalStreaming((prev) => ({
            ...prev,
            [numId]: {
              ...prev[numId],
              error: 'Chapter has no verses',
              isStreaming: false,
            },
          }));
          setLoading(false);
        }
        return;
      }

      if (isMountedRef.current) {
        setGlobalStreaming((prev) => ({
          ...prev,
          [numId]: {
            ...prev[numId],
            totalVerses: total,
          },
        }));
        console.log(`[Streaming] Chapter ${numId} has ${total} verses. Starting stream...`);
      }

      const onVerseReceived = (result: VerseStreamResult) => {
        if (!isMountedRef.current || currentChapterRef.current !== numId) return;

        console.log(
          `[Streaming] Verse ${result.verseNumber} received`,
          result.cached ? '(cached)' : '(api)'
        );

        setGlobalStreaming((prev) => {
          const current = prev[numId];
          if (!current) return prev;

          const exists = current.verses.some((v) => v.verseNumber === result.verseNumber);
          if (exists) {
            return prev;
          }

          const updated = [
            ...current.verses,
            {
              chapterId: numId,
              verseNumber: result.verseNumber,
              ...result.data,
            },
          ];

          return {
            ...prev,
            [numId]: {
              ...current,
              verses: updated.sort((a, b) => a.verseNumber - b.verseNumber),
              versesLoaded: current.versesLoaded + 1,
            },
          };
        });
      };

      await streamChapterVerses(
        numId,
        total,
        onVerseReceived,
        3,
        abortSignal
      );

      if (isMountedRef.current && currentChapterRef.current === numId) {
        console.log(`[Streaming] Completed fetching all ${total} verses`);
        setGlobalStreaming((prev) => ({
          ...prev,
          [numId]: {
            ...prev[numId],
            isStreaming: false,
          },
        }));
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || axios.isCancel(err)) {
        console.log('[Streaming] Streaming was cancelled (different chapter selected)');
        if (isMountedRef.current) {
          setGlobalStreaming((prev) => ({
            ...prev,
            [numId]: {
              ...prev[numId],
              isStreaming: false,
            },
          }));
          setLoading(false);
        }
        return;
      }

      if (isMountedRef.current && currentChapterRef.current === numId) {
        console.error('[Streaming] Error during verse streaming:', err);
        setGlobalStreaming((prev) => ({
          ...prev,
          [numId]: {
            ...prev[numId],
            error: err instanceof Error ? err.message : 'Failed to load verses',
            isStreaming: false,
          },
        }));
        setLoading(false);
      }
    }
  }, [chapterId, setGlobalStreaming]);

  const continueStreaming = useCallback(
    async (chapter: number, total: number) => {
      if (!isMountedRef.current) return;

      try {
        abortControllerRef.current = new AbortController();
        currentChapterRef.current = chapter;
        const abortSignal = abortControllerRef.current.signal;

        const existingVerse = globalStreaming[chapter]?.verses || [];
        const loadedNumbers = new Set(existingVerse.map((v) => v.verseNumber));
        const missingVerses = Array.from({ length: total }, (_, i) => i + 1).filter(
          (v) => !loadedNumbers.has(v)
        );

        if (missingVerses.length === 0) {
          console.log(`[Streaming] All verses already loaded for chapter ${chapter}`);
          return;
        }

        console.log(
          `[Streaming] Continuing stream for chapter ${chapter}, fetching ${missingVerses.length} missing verses`
        );

        setGlobalStreaming((prev) => ({
          ...prev,
          [chapter]: {
            ...prev[chapter],
            isStreaming: true,
          },
        }));

        const onVerseReceived = (result: VerseStreamResult) => {
          if (!isMountedRef.current || currentChapterRef.current !== chapter) return;

          console.log(`[Streaming] Verse ${result.verseNumber} received (cached: ${result.cached})`);

          setGlobalStreaming((prev) => {
            const current = prev[chapter];
            if (!current) return prev;

            const exists = current.verses.some((v) => v.verseNumber === result.verseNumber);
            if (exists) {
              return prev;
            }

            const updated = [
              ...current.verses,
              {
                chapterId: chapter,
                verseNumber: result.verseNumber,
                ...result.data,
              },
            ];

            return {
              ...prev,
              [chapter]: {
                ...current,
                verses: updated.sort((a, b) => a.verseNumber - b.verseNumber),
                versesLoaded: current.versesLoaded + 1,
              },
            };
          });
        };

        await streamChapterVerses(chapter, total, onVerseReceived, 3, abortSignal);

        if (isMountedRef.current && currentChapterRef.current === chapter) {
          setGlobalStreaming((prev) => ({
            ...prev,
            [chapter]: {
              ...prev[chapter],
              isStreaming: false,
            },
          }));
        }
      } catch (err: any) {
        if (err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || axios.isCancel(err)) {
          console.log('[Streaming] Continue streaming was cancelled');
          return;
        }

        if (isMountedRef.current && currentChapterRef.current === chapter) {
          console.error('[Streaming] Error continuing stream:', err);
          setGlobalStreaming((prev) => ({
            ...prev,
            [chapter]: {
              ...prev[chapter],
              error: err instanceof Error ? err.message : 'Failed to continue streaming',
              isStreaming: false,
            },
          }));
        }
      }
    },
    [globalStreaming, setGlobalStreaming]
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (currentChapterRef.current && currentChapterRef.current !== numChapterId) {
      console.log(
        `[Streaming] Chapter changed from ${currentChapterRef.current} to ${numChapterId}, cancelling old streaming`
      );
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (error) {
          console.log('[Streaming] Error aborting old chapter streaming:', error);
        }
      }
    }

    (async () => {
      try {
        await startStreaming();
      } catch (error) {
        if ((error as any)?.name !== 'AbortError' && (error as any)?.name !== 'CanceledError' && (error as any)?.code !== 'ERR_CANCELED' && !axios.isCancel(error)) {
          console.error('[Streaming] Unhandled error in startStreaming:', error);
        }
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
  }, [numChapterId]);

  return {
    verses,
    totalVerses,
    loading,
    streaming: isStreaming,
    error,
    progress,
    versesLoaded,
  };
};