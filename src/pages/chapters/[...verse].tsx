import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { chapterState, verseState, verseCountState } from '@/store/store';

import VerseReader from '@/components/VerseReader';

import { useVerseData } from '@/hooks/useVerseData';
import { useVerseNavigation } from '@/hooks/useVerseNavigation';

const VersePage = () => {
  const router = useRouter();
  const { verse: verseParam } = router.query;
  const setChapterRecoilState = useSetRecoilState(chapterState);
  const setVerseRecoilState = useSetRecoilState(verseState);
  const setVerseCountRecoilState = useSetRecoilState(verseCountState);

  const [chapterNumber, setChapterNumber] = useState('');
  const [verseNumber, setVerseNumber] = useState('');

  useEffect(() => {
    if (!verseParam || verseParam.length < 3) {
      return;
    }

    const chap = verseParam[0];
    const vers = verseParam[2];

    setChapterNumber(chap);
    setVerseNumber(vers);
    setChapterRecoilState(chap);
    setVerseRecoilState(vers);
  }, [verseParam, setChapterRecoilState, setVerseRecoilState]);

  const { data, verseCount, loading, error } = useVerseData(
    chapterNumber,
    verseNumber
  );

  useEffect(() => {
    if (verseCount) {
      setVerseCountRecoilState(verseCount);
    }
  }, [verseCount, setVerseCountRecoilState]);

  useEffect(() => {
    if (chapterNumber && verseNumber && !loading) {
      axios
        .post('/api/reading-progress', {
          chapterId: Number(chapterNumber),
          verseNumber: Number(verseNumber),
        })
        .catch((error) => {
          console.error('Failed to save reading progress:', error);
        });
    }
  }, [chapterNumber, verseNumber, loading]);

  const { handleNext, handlePrev, canGoNext, canGoPrev } =
    useVerseNavigation(chapterNumber, verseNumber, verseCount);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mb-4"></div>
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading verse...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto px-4 pt-4">
        {chapterNumber && (
          <Link
            href={`/chapters/${chapterNumber}/verses`}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Chapter Verses
          </Link>
        )}
      </div>

      <VerseReader
        chapterNumber={data.chapterId}
        verseNumber={data.verseNumber}
        verseCount={verseCount}
        text={data.text}
        transliteration={data.transliteration}
        translations={data.translations}
        commentaries={data.commentaries}
        onPrev={handlePrev}
        onNext={handleNext}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
    </div>
  );
};

export default VersePage;