import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { chapterState, verseState, verseCountState } from '@/store/store';
import { useSession } from 'next-auth/react';

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

  const { status } = useSession();

  useEffect(() => {
    if (chapterNumber && verseNumber && !loading && status === 'authenticated') {
      axios
        .post('/api/reading-progress', {
          chapterId: Number(chapterNumber),
          verseNumber: Number(verseNumber),
        })
        .catch((error) => {
          console.error('Failed to save reading progress:', error);
        });
    }
  }, [chapterNumber, verseNumber, loading, status]);

  const { handleNext, handlePrev, canGoNext, canGoPrev } =
    useVerseNavigation(chapterNumber, verseNumber, verseCount);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-4 border-amber-600 dark:border-amber-500 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg">Loading verse...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center bg-background px-4 min-h-screen">
        <div className="max-w-md text-center">
          <p className="mb-6 text-red-600 dark:text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto px-4 pt-4 max-w-3xl">
        {chapterNumber && (
          <Link
            href={`/chapters/${chapterNumber}/verses`}
            className="inline-flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/10 px-3 py-1.5 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs transition-colors"
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