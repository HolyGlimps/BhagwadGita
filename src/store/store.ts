import { atom } from 'recoil';

export const chapterState = atom<string>({
  key: 'chapterState',
  default: '',
});

export const verseState = atom<string>({
  key: 'verseState',
  default: '',
});

export const verseCountState = atom<string>({
  key: 'verseCountState',
  default: '',
});

export interface VerseOfTheDayData {
  verse: string;
  meaning: string;
  author: string;
  chapter: number;
  transliteration: string;
  verseNumber: number;
}

export const verseOfTheDayState = atom<VerseOfTheDayData | null>({
  key: 'verseOfTheDayState',
  default: null,
});

export const verseOfTheDayTimestampState = atom<number | null>({
  key: 'verseOfTheDayTimestampState',
  default: null,
});

interface StreamingVerse {
  id?: number;
  chapterId: number;
  verseNumber: number;
  text: string;
  transliteration?: string;
  translations?: any;
  commentaries?: any;
}

interface ChapterStreaming {
  chapterId: number;
  verses: StreamingVerse[];
  totalVerses: number;
  versesLoaded: number;
  isStreaming: boolean;
  error: string | null;
}

export const chapterStreamingState = atom<Record<number, ChapterStreaming>>({
  key: 'chapterStreamingState',
  default: {},
});