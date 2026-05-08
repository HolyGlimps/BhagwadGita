import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
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
      <>
        <Head>
          <title>Loading Verse | Bhagavad Gita</title>
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading verse...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | Bhagavad Gita</title>
        </Head>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`Chapter ${chapterNumber} Verse ${verseNumber} | Bhagavad Gita`}</title>
        <meta name="description" content={`Read Chapter ${chapterNumber}, Verse ${verseNumber} of the Bhagavad Gita with translation and commentary.`} />
      </Head>
      <div>
        <div className="max-w-5xl mx-auto pt-4">
          {chapterNumber && (
            <Link
              href={`/chapters/${chapterNumber}/verses`}
              className="inline-flex items-center py-1.5 font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors"
            >
              ← Chapter Verses
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
    </>
  );
};

export default VersePage;