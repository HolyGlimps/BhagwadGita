import type { NextApiRequest, NextApiResponse } from 'next';
import { getVerseOfTheDay } from '@/lib/api-services/verseOfTheDay.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const verse = await getVerseOfTheDay();
    return res.status(200).json({
      success: true,
      data: {
        id: verse.id,
        chapter: verse.chapterId,
        verseNumber: verse.verseNumber,
        verse: verse.verseText,
        transliteration: verse.transliteration,
        meaning: verse.meaning,
        author: verse.author,
        expiresAt: verse.expiresAt,
      },
    });
  } catch (error) {
    console.error('[API] Verse of the day error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch verse',
    });
  }
}