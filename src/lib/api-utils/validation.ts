/**
 * Input validation utilities for API endpoints
 */

/**
 * Validate that a parameter exists and is not empty
 * @param value - The value to validate
 * @param paramName - Name of the parameter (for error messages)
 * @returns true if valid, throws error if invalid
 */
export function validateRequired(value: any, paramName: string): boolean {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${paramName} is required`);
  }
  return true;
}

/**
 * Validate that a parameter is a positive number
 * @param value - The value to validate
 * @param paramName - Name of the parameter (for error messages)
 * @returns true if valid, throws error if invalid
 */
export function validatePositiveNumber(value: any, paramName: string): boolean {
  const num = parseInt(value as string, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error(`${paramName} must be a positive number`);
  }
  return true;
}

/**
 * Validate chapter ID (1-18 for Bhagavad Gita)
 * @param chapterId - The chapter ID to validate
 * @returns true if valid, throws error if invalid
 */
export function validateChapterId(chapterId: any): boolean {
  validateRequired(chapterId, 'Chapter ID');
  validatePositiveNumber(chapterId, 'Chapter ID');

  const id = parseInt(chapterId as string, 10);
  if (id < 1 || id > 18) {
    throw new Error('Chapter ID must be between 1 and 18');
  }
  return true;
}

/**
 * Validate verse number
 * @param verseNumber - The verse number to validate
 * @returns true if valid, throws error if invalid
 */
export function validateVerseNumber(verseNumber: any): boolean {
  validateRequired(verseNumber, 'Verse number');
  validatePositiveNumber(verseNumber, 'Verse number');
  return true;
}
