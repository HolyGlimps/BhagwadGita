import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';

interface Verse {
  id?: number;
  chapterId: number;
  verseNumber: number;
  text: string;
  transliteration?: string;
  translations?: any;
  commentaries?: any;
}

interface VerseStreamListProps {
  chapterId: number;
  verses: Verse[];
  totalVerses: number;
  loading: boolean;
  streaming: boolean;
  progress: number;
  versesLoaded: number;
  error: string | null;
}

export default function VerseStreamList({
  chapterId,
  verses,
  totalVerses,
  loading,
  streaming,
  versesLoaded,
  error,
}: VerseStreamListProps) {
  const [showProgress, setShowProgress] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Calculate current verse number being loaded
  const currentVerseNumber = verses.length > 0 ? verses[verses.length - 1].verseNumber : 0;

  // Calculate progress % based on current verse number
  const verseProgress = totalVerses > 0
    ? Math.min(100, Math.round((currentVerseNumber / totalVerses) * 100))
    : 0;

  // Handle fade out after streaming completes
  useEffect(() => {
    if (!streaming && showProgress) {
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1000);

      const hideTimer = setTimeout(() => {
        setShowProgress(false);
      }, 1500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [streaming, showProgress]);

  useEffect(() => {
    if (streaming) {
      setShowProgress(true);
      setFadeOut(false);
    }
  }, [streaming]);
  if (error && !streaming) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Link href="/chapters">
            <button className="px-6 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700">
              Back to Chapters
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-xl sm:text-2xl font-bold uppercase font-amita italic">
          Chapter - {chapterId}
        </h2>
      </div>

      {showProgress && (
        <div
          className={`mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Loading Verse {currentVerseNumber} of {totalVerses}
            </p>
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {verseProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-amber-600 dark:bg-amber-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${verseProgress}%` }}
            ></div>
          </div>

          {streaming ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Loading verses...
            </p>
          ) : (
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              ✓ All verses loaded
            </p>
          )}
        </div>
      )}


      {/* Verses Grid styled like ChaptersGrid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {verses.map((verse) => (
          <Link
            key={verse.verseNumber}
            href={`/chapters/${chapterId}/verses/${verse.verseNumber}`}
          >
            <Card className="h-full border border-l-4 border-amber-600 dark:border-amber-500 hover:shadow-lg dark:hover:shadow-amber-900/20 transition-all duration-200 cursor-pointer hover:border-amber-700 dark:hover:border-amber-400 overflow-hidden group flex flex-col">
              <div className="px-6 py-2 flex flex-col flex-1 opacity-85">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-wider">
                    Verse {verse.verseNumber}
                  </span>
                </div>

                {verse.text && (
                  <p className="text-xl sm:text-2xl font-devanagari mb-1 font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    {verse.text}
                  </p>
                )}

                {verse.transliteration && (
                  <p className="text-sm mb-2">
                    {verse.transliteration}
                  </p>
                )}

                {verse.translations && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1 line-clamp-2">
                    {verse.translations[0].description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-amber-600 dark:text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {verse.commentaries?.length || 0} commentaries
                    </span>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                    Read →
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {streaming &&
          Array.from({
            length: Math.min(3, totalVerses - versesLoaded),
          }).map((_, idx) => (
            <Card
              key={`skeleton-${versesLoaded + idx}`}
              className="h-full border border-l-4 border-amber-600 dark:border-amber-500 bg-gray-100 dark:bg-zinc-800 animate-pulse overflow-hidden flex flex-col"
            >
              <div className="px-6 py-2 flex flex-col flex-1 opacity-85">
                <div className="mb-4">
                  <div className="inline-block h-6 bg-gray-300 dark:bg-zinc-700 rounded-full w-24"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-4/5 mb-3"></div>
                <div className="flex-grow mb-3 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded w-24"></div>
              </div>
            </Card>
          ))}
      </div>

      {!loading && !streaming && verses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No verses loaded
          </p>
          <Link href="/chapters">
            <button className="px-6 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700">
              Back to Chapters
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}