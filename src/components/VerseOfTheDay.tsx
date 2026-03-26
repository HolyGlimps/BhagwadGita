import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VerseData {
  verse: string;
  meaning: string;
  chapter: number;
  verseNumber: number;
}

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch a random verse as verse of the day
    const fetchRandomVerse = async () => {
      try {
        // Get a random chapter (1-18) and verse number (varies by chapter)
        const randomChapter = Math.floor(Math.random() * 18) + 1;

        // For simplicity, we'll use a fixed verse count assumption
        // In reality, you might want to query this dynamically
        const verseCountPerChapter: { [key: number]: number } = {
          1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47, 7: 30, 8: 28,
          9: 34, 10: 42, 11: 55, 12: 20, 13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
        };
        const maxVerse = verseCountPerChapter[randomChapter] || 50;
        const randomVerseNum = Math.floor(Math.random() * maxVerse) + 1;

        // Try to fetch from your API
        const response = await fetch(
          `/api/chapters/${randomChapter}/verses/${randomVerseNum}`
        );
        if (response.ok) {
          const data = await response.json();
          setVerse({
            verse: data.text,
            meaning: data.word_meanings || 'Discover the profound wisdom of this verse.',
            chapter: randomChapter,
            verseNumber: randomVerseNum,
          });
        }
      } catch (error) {
        console.error('Failed to fetch verse of the day:', error);
        // Fallback verse
        setVerse({
          verse: 'Yoga is the journey of the self, through the self, to the self.',
          meaning: 'This verse encapsulates the essence of Yoga and inner transformation.',
          chapter: 6,
          verseNumber: 20,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRandomVerse();
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-l-4 border-amber-600 dark:border-amber-500 pl-6 py-8 animate-pulse">
          <p className="text-gray-400 dark:text-gray-500">Loading verse of the day...</p>
        </div>
      </section>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-4">
          Verse of the Day
        </p>

        {/* Verse Card */}
        <div className="border-l-4 border-amber-600 dark:border-amber-500 pl-6 py-8 space-y-4">
          {/* Verse Text - Serif for reading feel */}
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-serif text-gray-900 dark:text-gray-50 italic">
            "{verse.verse}"
          </p>

          {/* Chapter and Verse Reference */}
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            Bhagavad Gita {verse.chapter}.{verse.verseNumber}
          </p>

          {/* Meaning */}
          <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <p className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 font-semibold">
              Meaning
            </p>
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {verse.meaning}
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              href={`/chapter/${verse.chapter}/verse/${verse.verseNumber}`}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white rounded-sm font-semibold transition-colors"
            >
              Read Full Verse
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Dive into commentary and deeper insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
