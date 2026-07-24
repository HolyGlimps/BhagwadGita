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
      <div className="flex justify-center items-center bg-background px-4 min-h-screen">
        <div className="max-w-md text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
          <Link href="/chapters">
            <button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 px-6 py-2 rounded-lg text-white">
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
      <div className="mb-4">
        <h2 className="mb-2 font-bold text-2xl sm:text-3xl">
          Chapter {chapterId} Verses
        </h2>
      </div>

      {showProgress && (
        <div
          className={`mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'
            }`}
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              Loading Verse {currentVerseNumber} of {totalVerses}
            </p>
            <span className="font-medium text-amber-600 dark:text-amber-400 text-sm">
              {verseProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-full h-2">
            <div
              className="bg-amber-600 dark:bg-amber-500 rounded-full h-2 transition-all duration-300 ease-out"
              style={{ width: `${verseProgress}%` }}
            ></div>
          </div>

          {streaming ? (
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Loading verses...
            </p>
          ) : (
            <p className="mt-2 text-green-600 dark:text-green-400 text-sm">
              ✓ All verses loaded
            </p>
          )}
        </div>
      )}

      {/* Verses Grid */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 auto-rows-fr">
        {verses.map((verse) => (
          <Link
            key={verse.verseNumber}
            href={`/chapters/${chapterId}/verses/${verse.verseNumber}`}
          >
            <div className="flex flex-col bg-white hover:bg-amber-50 dark:bg-slate-900 dark:hover:bg-slate-800 p-4 border border-gray-200 hover:border-amber-500 dark:border-gray-700 dark:hover:border-amber-400 rounded-lg h-full min-h-[280px] transition-colors cursor-pointer">

              <div className="mb-3">
                <span className="inline-block bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full font-semibold text-amber-700 dark:text-amber-400 text-xs tracking-wider">
                  Verse {verse.verseNumber}
                </span>
              </div>

              {verse.transliteration && (
                <p className="mb-2 text-gray-600 dark:text-gray-300 text-sm italic line-clamp-2">
                  {verse.transliteration}
                </p>
              )}

              {verse.translations && (
                <p className="mb-2 text-gray-600 dark:text-gray-300 text-sm italic line-clamp-2">
                  {verse.translations[0].description}
                </p>
              )}

              {verse.text && (
                <p className="flex-grow text-gray-700 dark:text-gray-400 text-sm line-clamp-4">
                  {verse.text}
                </p>
              )}

              <div className="mt-3 font-medium text-amber-600 dark:text-amber-400 text-sm">
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
              className="flex flex-col bg-gray-100 dark:bg-slate-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg h-full min-h-[280px] animate-pulse"
            >
              {/* Verse badge skeleton */}
              <div className="mb-3">
                <div className="inline-block bg-gray-300 dark:bg-slate-700 rounded-full w-24 h-6"></div>
              </div>

              {/* Transliteration skeleton */}
              <div className="bg-gray-300 dark:bg-slate-700 mb-2 rounded w-5/6 h-4"></div>
              <div className="bg-gray-300 dark:bg-slate-700 mb-3 rounded w-4/5 h-4"></div>

              {/* Text content skeleton (flex-grow to match real card) */}
              <div className="flex-grow space-y-2 mb-3">
                <div className="bg-gray-300 dark:bg-slate-700 rounded w-full h-4"></div>
                <div className="bg-gray-300 dark:bg-slate-700 rounded w-full h-4"></div>
                <div className="bg-gray-300 dark:bg-slate-700 rounded w-5/6 h-4"></div>
              </div>

              {/* Read More skeleton */}
              <div className="bg-gray-300 dark:bg-slate-700 rounded w-24 h-4"></div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {!loading && !streaming && verses.length === 0 && (
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            No verses loaded
          </p>
          <Link href="/chapters">
            <button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 px-6 py-2 rounded-lg text-white">
              Back to Chapters
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}