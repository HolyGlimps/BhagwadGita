import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  progress,
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
      // Streaming just completed, keep showing progress for 3 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true); // Start fade animation
      }, 2000);

      const hideTimer = setTimeout(() => {
        setShowProgress(false); // Hide completely
      }, 3000); // 500ms for fade animation

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [streaming, showProgress]);

  // Reset progress visibility when chapter changes
  useEffect(() => {
    if (streaming) {
      setShowProgress(true);
      setFadeOut(false);
    }
  }, [streaming]);
  if (error && !streaming) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
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
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Chapter {chapterId} Verses
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

      {/* Verses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
        {verses.map((verse) => (
          <Link
            key={verse.verseNumber}
            href={`/chapters/${chapterId}/verses/${verse.verseNumber}`}
          >
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 cursor-pointer transition-colors bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 flex flex-col h-full min-h-[280px]">

              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-wider">
                  Verse {verse.verseNumber}
                </span>
              </div>

              {verse.transliteration && (
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2 line-clamp-2">
                  {verse.transliteration}
                </p>
              )}

              {verse.translations && (
                <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-2 line-clamp-2">
                  {verse.translations[0].description}
                </p>
              )}

              {verse.text && (
                <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-4 flex-grow">
                  {verse.text}
                </p>
              )}

              <div className="mt-3 text-amber-600 dark:text-amber-400 text-sm font-medium">
                Read More →
              </div>
            </div>
          </Link>
        ))}

        {/* Skeleton loaders for verses being loaded */}
        {streaming &&
          Array.from({
            length: Math.min(3, totalVerses - versesLoaded),
          }).map((_, idx) => (
            <div
              key={`skeleton-${versesLoaded + idx}`}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse flex flex-col h-full min-h-[280px]"
            >
              {/* Verse badge skeleton */}
              <div className="mb-3">
                <div className="inline-block h-6 bg-gray-300 dark:bg-slate-700 rounded-full w-24"></div>
              </div>

              {/* Transliteration skeleton */}
              <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-4/5 mb-3"></div>

              {/* Text content skeleton (flex-grow to match real card) */}
              <div className="flex-grow mb-3 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6"></div>
              </div>

              {/* Read More skeleton */}
              <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-24"></div>
            </div>
          ))}
      </div>

      {/* Empty State */}
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