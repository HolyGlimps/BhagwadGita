import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface Translation {
  id: string;
  author_name: string;
  language: string;
  description: string;
}

interface Commentary {
  id: string;
  author_name: string;
  language: string;
  description: string;
}

interface VerseReaderProps {
  chapterNumber?: number;
  verseNumber?: number;
  verseCount?: string | number;
  text?: string;
  transliteration?: string;
  translations?: Translation[];
  commentaries?: Commentary[];
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const VerseReader: React.FC<VerseReaderProps> = ({
  chapterNumber,
  verseNumber,
  verseCount,
  text,
  transliteration,
  translations,
  commentaries,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}) => {
  const [activeTranslationIndex, setActiveTranslationIndex] = useState(0);
  const [activeCommentaryIndex, setActiveCommentaryIndex] = useState(0);
  const activeTranslation = translations?.[activeTranslationIndex];
  const activeCommentary = commentaries?.[activeCommentaryIndex];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Reading Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
        {/* Header with Gradient Accent */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-transparent bg-gradient-to-r from-amber-400/30 to-amber-600/30 dark:from-amber-600/20 dark:to-amber-800/20 p-4 rounded-lg">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              Chapter {chapterNumber}
            </span>
            <span className="text-amber-600/40 dark:text-amber-600/60">•</span>
            <span className="text-xl md:text-2xl font-semibold font-serif text-gray-900 dark:text-white">
              Verse {verseNumber}
            </span>
            <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-500">
              {verseNumber} of {verseCount}
            </span>
          </div>
        </div>

        {/* Main Verse Content - Documentation Hero */}
        <div className="space-y-8">
          {/* Sanskrit Text - Large Serif Hero */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/30 dark:to-transparent rounded-xl blur-xl opacity-40" />
            <div className="relative bg-gradient-to-br from-amber-50/30 to-amber-100/20 dark:from-amber-950/20 dark:to-slate-900/30 p-8 rounded-xl border border-amber-200/40 dark:border-amber-900/30">
              <p className="text-2xl md:text-4xl lg:text-5xl font-amita text-center leading-loose text-gray-900 dark:text-white tracking-tight">
                {text}
              </p>
            </div>
          </div>

          {/* Transliteration - Smaller, Elegant */}
          {transliteration && (
            <div className="text-center">
              <p className="text-sm md:text-base text-amber-700 dark:text-amber-400 font-medium italic tracking-widest opacity-80">
                {transliteration}
              </p>
            </div>
          )}

          {/* Inline Navigation Hints */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-all ${canGoPrev
                ? 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">
              Previous / Next
            </span>
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-all ${canGoNext
                ? 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Interpretations Section */}
        {translations && translations.length > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-sans font-semibold uppercase tracking-wider">
                Interpretations
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 opacity-50">
                Explore multiple scholarly perspectives on this verse's meaning
              </p>
            </div>

            {/* Scholar Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
              <div className="flex overflow-x-auto scrollbar-hide overflow-y-hidden">
                {translations.map((translation, index) => (
                  <button
                    key={translation.id}
                    onClick={() => setActiveTranslationIndex(index)}
                    className={`flex-shrink-0 px-4 py-3 font-medium border-b-2 transition-colors text-sm ${activeTranslationIndex === index
                      ? 'border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-400 font-semibold'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400'
                      }`}
                  >
                    {translation.author_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Translation - Callout Box */}
            {activeTranslation && (
              <div className="bg-card border border-amber-200/50 dark:border-amber-900/40 rounded-lg p-6 space-y-4">
                <div className="space-y-4">
                  <p className="text-base md:text-lg leading-relaxed text-gray-900 dark:text-gray-100 font-martel">
                    "{activeTranslation.description}"
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {activeTranslation.author_name}
                      </span>
                      {activeTranslation.language && (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                          🌐 {activeTranslation.language}
                        </span>
                      )}
                    </div>
                    <span>
                      {activeTranslationIndex + 1} of {translations.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Commentaries Section */}
        {commentaries && commentaries.length > 0 && (
          <div className="pt-6 border-t border-gray-200 dark:border-slate-800">
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-sans font-semibold uppercase tracking-wider">
                Deeper Insights
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 opacity-50">
                Scholarly commentary to deepen your understanding of this verse
              </p>
            </div>

            {/* Scholar Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
              <div className="flex overflow-x-auto scrollbar-hide overflow-y-hidden">
                {commentaries.map((commentary, index) => (
                  <button
                    key={commentary.id}
                    onClick={() => setActiveCommentaryIndex(index)}
                    className={`flex-shrink-0 px-4 py-3 font-medium border-b-2 transition-colors text-sm ${activeCommentaryIndex === index
                      ? 'border-amber-500 text-amber-700 dark:border-amber-400 dark:text-amber-400 font-semibold'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400'
                      }`}
                  >
                    {commentary.author_name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Commentary - Callout Box */}
            {activeCommentary && (
              <div className="bg-card border border-amber-200/50 dark:border-amber-900/40 rounded-lg p-6 space-y-4">
                <div className="space-y-4">
                  <p className="text-base md:text-lg leading-relaxed text-gray-900 dark:text-gray-100 font-eczar">
                    {activeCommentary.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">
                        {activeCommentary.author_name}
                      </span>
                      {activeCommentary.language && (
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                          🌐 {activeCommentary.language}
                        </span>
                      )}
                    </div>
                    <span>
                      {activeCommentaryIndex + 1} of {commentaries.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation - Documentation Style */}
        <div className="pt-8 mt-12 border-t border-gray-200 dark:border-slate-800">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Previous */}
            <button
              onClick={onPrev}
              disabled={!canGoPrev}
              className={`group flex flex-col items-start p-4 rounded-lg transition-all ${canGoPrev
                ? 'bg-card hover:bg-muted text-amber-700 dark:text-amber-400'
                : 'bg-muted text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
            >
              <span className="text-xs font-semibold opacity-75">Previous Verse</span>
              {canGoPrev && verseNumber && (
                <span className="text-sm font-semibold mt-1">
                  {chapterNumber}.{Number(verseNumber) - 1}
                </span>
              )}
            </button>

            {/* Current */}
            <div className="flex justify-center">
              <div className="text-center px-4 py-3 rounded-lg bg-card">
                <p className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 font-semibold">
                  Current Verse
                </p>
                <p className="text-2xl font-serif font-bold text-gray-900 dark:text-white mt-1">
                  {chapterNumber}.{verseNumber}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {verseNumber} / {verseCount}
                </p>
              </div>
            </div>

            {/* Next */}
            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className={`group flex flex-col items-end p-4 rounded-lg transition-all ${canGoNext
                ? 'bg-card hover:bg-muted text-amber-700 dark:text-amber-400'
                : 'bg-muted text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
            >
              <span className="text-xs font-semibold opacity-75">Next Verse</span>
              {canGoNext && verseNumber && (
                <span className="text-sm font-semibold mt-1">
                  {chapterNumber}.{Number(verseNumber) + 1}
                </span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerseReader;