import { fetchChapter, fetchAllChapters } from '../api-utils/rapidapi.client';
import { validateChapterId } from '../api-utils/validation';

export async function getAllChapters(): Promise<any> {
  const chapters = await fetchAllChapters();
  return chapters;
}

export async function getChapterData(chapterId: string | string[]): Promise<any> {
  validateChapterId(chapterId);
  const chapter = await fetchChapter(chapterId);
  return chapter;
}

export async function getChapterVersesMetadata(chapterId: string | string[]): Promise<any> {
  return getChapterData(chapterId);
}