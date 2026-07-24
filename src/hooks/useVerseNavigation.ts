import { useRouter } from 'next/router';
import { CHAPTER_VERSE_COUNTS } from '@/constants/gita';

export const useVerseNavigation = (
  chapterNumber: string | number,
  verseNumber: string | number,
  verseCount: string | number
) => {
  const router = useRouter();

  const chapNum = Number(chapterNumber);
  const currentVerse = Number(verseNumber);
  const maxVerse = Number(verseCount) || CHAPTER_VERSE_COUNTS[chapNum] || 47;

  const handleNext = () => {
    if (currentVerse < maxVerse) {
      const nextVerseNumber = currentVerse + 1;
      router.push(`/chapters/${chapterNumber}/verses/${nextVerseNumber}`);
    }
  };

  const handlePrev = () => {
    if (currentVerse > 1) {
      const prevVerseNumber = currentVerse - 1;
      router.push(`/chapters/${chapterNumber}/verses/${prevVerseNumber}`);
    }
  };

  const handleGoBack = () => {
    router.push(`/chapters/${chapterNumber}/verses`);
  };

  const isFirstVerse = currentVerse === 1;
  const isLastVerse = currentVerse >= maxVerse;

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