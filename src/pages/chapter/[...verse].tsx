import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { chapterState, verseState, verseCountState } from '@/store/store';

import Providers from '@/components/providers';
import VerseHeader from '@/components/VerseHeader';
import VerseDisplay from '@/components/VerseDisplay';
import VerseCommentaries from '@/components/VerseCommentaries';
import VerseFooter from '@/components/VerseFooter';

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

  // Parse verse param and update state
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

  // Fetch verse data using custom hook
  const { data, verseCount, loading, error } = useVerseData(
    chapterNumber,
    verseNumber
  );

  // Update Recoil state with verse count for dropdown
  useEffect(() => {
    if (verseCount) {
      setVerseCountRecoilState(verseCount);
    }
  }, [verseCount, setVerseCountRecoilState]);

  // Handle navigation using custom hook
  const { handleNext, handlePrev, handleGoBack, canGoNext, canGoPrev } =
    useVerseNavigation(chapterNumber, verseNumber, verseCount);

  if (loading) {
    return (
      <Providers>
        <div className="bg-slate-200 dark:bg-cyan-950 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </Providers>
    );
  }

  if (error) {
    return (
      <Providers>
        <div className="bg-slate-200 dark:bg-cyan-950 min-h-screen flex items-center justify-center">
          <p className="text-2xl text-red-600 dark:text-red-400">{error}</p>
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
      <div className="bg-slate-200 dark:bg-cyan-950 min-h-screen">
        <VerseHeader
          onGoBack={handleGoBack}
          verseNumber={verseNumber}
          verseCount={verseCount}
        />

        <div className="container mx-auto">
          <div className="pt-16 pb-16">
            <div className="verse">
              <VerseDisplay
                text={data.text}
                transliteration={data.transliteration}
                chapterNumber={data.chapter_number}
                verseNumber={data.verse_number}
                translations={data.translations}
              />
              <VerseCommentaries commentaries={data.commentaries} />
            </div>
          </div>
        </div>

        <VerseFooter
          onPrev={handlePrev}
          onNext={handleNext}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />
      </div>
    </Providers>
  );
};

export default VersePage;