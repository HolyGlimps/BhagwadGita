import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface ReadingProgressData {
  completedVerses: Array<{ chapter: number; verse: number }>;
  lastChapter: number;
  lastVerse: number;
  totalRead: number;
}

interface UseReadingProgressReturn {
  progress: ReadingProgressData | null;
  loading: boolean;
  error: string | null;
  markVerseAsRead: (chapterId: number, verseNumber: number) => Promise<void>;
  isVerseRead: (chapterId: number, verseNumber: number) => boolean;
}

export function useReadingProgress(): UseReadingProgressReturn {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ReadingProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reading progress on mount or when session changes
  useEffect(() => {
    if (!session?.user) {
      setProgress(null);
      return;
    }

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reading-progress');
        setProgress(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch reading progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [session?.user]);

  const markVerseAsRead = async (
    chapterId: number,
    verseNumber: number
  ) => {
    if (!session?.user) {
      console.log('User not authenticated, skipping progress save');
      return;
    }

    try {
      await axios.post('/api/reading-progress', {
        chapterId,
        verseNumber,
      });

      // Update local state
      setProgress((prev) => {
        if (!prev) return prev;

        const isAlreadyRead = prev.completedVerses.some(
          (v) => v.chapter === chapterId && v.verse === verseNumber
        );

        return {
          ...prev,
          completedVerses: isAlreadyRead
            ? prev.completedVerses
            : [
              ...prev.completedVerses,
              { chapter: chapterId, verse: verseNumber },
            ],
          lastChapter: chapterId,
          lastVerse: verseNumber,
          totalRead: isAlreadyRead ? prev.totalRead : prev.totalRead + 1,
        };
      });
    } catch (err) {
      console.error('Failed to mark verse as read:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to save progress'
      );
    }
  };

  const isVerseRead = (chapterId: number, verseNumber: number): boolean => {
    if (!progress) return false;
    return progress.completedVerses.some(
      (v) => v.chapter === chapterId && v.verse === verseNumber
    );
  };

  return {
    progress,
    loading,
    error,
    markVerseAsRead,
    isVerseRead,
  };
}