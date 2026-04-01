import { NextApiRequest, NextApiResponse } from 'next';
import { getHistoricalVerses } from '@/lib/api-services/verseOfTheDay.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 7;
    const verses = await getHistoricalVerses(limit);

    return res.status(200).json({
      success: true,
      verses,
      count: verses.length,
    });
  } catch (error) {
    console.error('[VERSE HISTORY ERROR]', error);
    return res.status(500).json({
      error: 'Failed to retrieve historical verses',
    });
  }
}