import { useEffect, useState } from 'react';
import axios from 'axios';

interface VerseData {
  id?: string;
  verseNumber?: number;
  chapterId?: number;
  text?: string;
  transliteration?: string;
  translations?: Array<{
    id: string;
    author_name: string;
    language: string;
    description: string;
  }>;
  commentaries?: Array<{
    id: string;
    author_name: string;
    language: string;
    description: string;
  }>;
}

export const useVerseData = (chapterNumber: string | number, verseNumber: string | number) => {
  const [data, setData] = useState<VerseData>({});
  const [verseCount, setVerseCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterNumber || !verseNumber) {
      return;
    }

    setLoading(true);
    setError(null);

    const fetchVerseData = async () => {
      try {
        const verseResponse = await axios.get(
          `/api/chapters/${chapterNumber}/verses/${verseNumber}`
        );

        setData(verseResponse.data.data || verseResponse.data);
        setVerseCount(verseResponse.data.verses_count || '');
      } catch (err) {
        console.error('Failed to fetch verse:', err?.response?.data || err?.message || err);
        setError('Failed to load verse data');
      } finally {
        setLoading(false);
      }
    };

    fetchVerseData();
  }, [chapterNumber, verseNumber]);

  return { data, verseCount, loading, error };
};