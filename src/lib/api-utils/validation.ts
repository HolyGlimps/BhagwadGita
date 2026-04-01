export function validateRequired(value: any, paramName: string): boolean {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${paramName} is required`);
  }
  return true;
}

export function validatePositiveNumber(value: any, paramName: string): boolean {
  const num = parseInt(value as string, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${paramName} must be a positive number`);
  }
  return true;
}

export function validateChapterId(chapterId: any): boolean {
  validateRequired(chapterId, 'Chapter ID');
  validatePositiveNumber(chapterId, 'Chapter ID');

  const id = parseInt(chapterId as string, 10);
  if (id < 1 || id > 18) {
    throw new Error('Chapter ID must be between 1 and 18');
  }
  return true;
}

export function validateVerseNumber(verseNumber: any): boolean {
  validateRequired(verseNumber, 'Verse number');
  validatePositiveNumber(verseNumber, 'Verse number');
  return true;
}