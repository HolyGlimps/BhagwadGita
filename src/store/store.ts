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