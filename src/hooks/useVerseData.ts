import { useEffect, useState } from 'react';
import axios from 'axios';

interface VerseData {
  id?: string;
  verse_number?: number;
  chapter_number?: number;
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
        // Fetch the verse content
        const verseResponse = await axios.get(
          `/api/chapters/${chapterNumber}/verses/${verseNumber}`
        );
        setData(verseResponse.data);
      } catch (err) {
        console.error('Failed to fetch verse:', err);
        setError('Failed to load verse data');
      }
    };

    const fetchVerseCount = async () => {
      try {
        // Fetch verse count for the chapter
        const countResponse = await axios.get(
          `/api/chapters/${chapterNumber}/verses`
        );
        setVerseCount(countResponse.data.verses_count);
      } catch (err) {
        console.error('Failed to fetch verse count:', err);
        setError('Failed to load verse count');
      }
    };

    Promise.all([fetchVerseData(), fetchVerseCount()])
      .catch(() => setError('Failed to load verse information'))
      .finally(() => setLoading(false));
  }, [chapterNumber, verseNumber]);

  return { data, verseCount, loading, error };
};
