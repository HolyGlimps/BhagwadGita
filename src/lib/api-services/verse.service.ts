import { fetchVerse } from '../api-utils/rapidapi.client';
import { validateChapterId, validateVerseNumber } from '../api-utils/validation';

export async function getVerseData(
  chapterId: string | string[],
  verseNumber: string | string[]
): Promise<any> {
  validateChapterId(chapterId);
  validateVerseNumber(verseNumber);
  const verse = await fetchVerse(chapterId, verseNumber);
  return verse;
}