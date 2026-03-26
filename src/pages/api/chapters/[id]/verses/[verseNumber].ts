import type { NextApiRequest, NextApiResponse } from 'next';
import { getVerseData } from '@/lib/api-services/verse.service';
import { handleError, handleValidationError } from '@/lib/api-utils/error-handler';

/**
 * GET /api/chapters/[id]/verses/[verseNumber]
 * 
 * Fetch specific verse data with translation and commentary
 * 
 * Route Parameters:
 * - id: Chapter ID (1-18)
 * - verseNumber: Verse number (1-N depending on chapter)
 * 
 * Response:
 * {
 *   "id": 1,
 *   "verse_number": 1,
 *   "chapter_number": 1,
 *   "text": "...",
 *   "transliteration": "...",
 *   "translations": [...],
 *   "commentaries": [...]
 * }
 */
interface ApiResponse {
  error?: string;
  message?: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, verseNumber } = req.query;

  try {
    // Get verse data from service
    const verse = await getVerseData(id, verseNumber);

    // Return successful response
    return res.status(200).json(verse);
  } catch (error: any) {
    // Handle validation errors
    if (error.message.includes('required') || error.message.includes('must be')) {
      return handleValidationError(error.message, res);
    }

    // Handle other errors
    return handleError(error, res);
  }
}
