import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { verseOfTheDayState, verseOfTheDayTimestampState, VerseOfTheDayData } from '@/store/store';

interface UseVerseOfTheDayReturn {
  verse: VerseOfTheDayData | null;
  loading: boolean;
  error: string | null;
}

export function useVerseOfTheDay(): UseVerseOfTheDayReturn {
  const [verse, setVerse] = useRecoilState(verseOfTheDayState);
  const [timestamp, setTimestamp] = useRecoilState(verseOfTheDayTimestampState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (verse !== null && timestamp !== null) {
      return;
    }

    const fetchVerseOfTheDay = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/verse-of-the-day');
        const { data } = response.data;

        const verseData: VerseOfTheDayData = {
          verse: data.verse || '',
          meaning: data.meaning || 'Translation not available',
          author: data.author || 'Unknown',
          chapter: data.chapter || 0,
          transliteration: data.transliteration || '',
          verseNumber: data.verseNumber || 0,
        };

        setVerse(verseData);
        setTimestamp(Date.now());
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch verse';
        setError(errorMsg);

        const fallback: VerseOfTheDayData = {
          verse: 'Yoga is the journey of the self, through the self, to the self.',
          meaning: 'This verse encapsulates the essence of Yoga and inner transformation.',
          author: 'Sri Aurobindo',
          chapter: 6,
          transliteration: 'Yoga is the journey of the self...',
          verseNumber: 20,
        };
        setVerse(fallback);
        setTimestamp(Date.now());
      } finally {
        setLoading(false);
      }
    };

    fetchVerseOfTheDay();
  }, []);

  return { verse, loading, error };
}