import { useRouter } from 'next/router';

export const useVerseNavigation = (chapterNumber: string | number, verseNumber: string | number, verseCount: string | number) => {
  const router = useRouter();

  const handleNext = () => {
    const currentVerse = parseInt(verseNumber as string);
    const maxVerse = parseInt(verseCount as string);

    if (currentVerse < maxVerse) {
      const nextVerseNumber = currentVerse + 1;
      router.push(`/chapters/${chapterNumber}/verse/${nextVerseNumber}`);
    }
  };

  const handlePrev = () => {
    const currentVerse = parseInt(verseNumber as string);

    if (currentVerse > 1) {
      const prevVerseNumber = currentVerse - 1;
      router.push(`/chapters/${chapterNumber}/verse/${prevVerseNumber}`);
    }
  };

  const handleGoBack = () => {
    router.push(`/chapters/${chapterNumber}`);
  };

  const isFirstVerse = parseInt(verseNumber as string) === 1;
  const isLastVerse = parseInt(verseNumber as string) === parseInt(verseCount as string);

  return {
    handleNext,
    handlePrev,
    handleGoBack,
    isFirstVerse,
    isLastVerse,
    canGoNext: !isLastVerse,
    canGoPrev: !isFirstVerse,
  };
};