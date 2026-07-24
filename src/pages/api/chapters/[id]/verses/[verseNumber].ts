import type { NextApiRequest, NextApiResponse } from 'next';
import { getVerse } from '@/lib/verseCache';
import { CHAPTER_VERSE_COUNTS } from '@/constants/gita';

type ResponseData =
  | {
    success: boolean;
    data: any;
    verses_count: number;
    source: 'cache' | 'api';
  }
  | {
    error?: string;
    message?: string;
    [key: string]: any;
  };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, verseNumber } = req.query;

  if (!id || !verseNumber) {
    return res
      .status(400)
      .json({ error: 'Missing chapter id or verse number' });
  }

  try {
    const chapterId = parseInt(id as string);
    const verseNum = parseInt(verseNumber as string);

    if (isNaN(chapterId) || isNaN(verseNum)) {
      return res.status(400).json({ error: 'Chapter ID and Verse Number must be valid integers' });
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.setHeader('ETag', `verse-${chapterId}-${verseNum}`);

    const verseData = await getVerse(chapterId, verseNum);
    if (!verseData) {
      return res.status(404).json({ error: 'Verse not found' });
    }
    const versesCount = CHAPTER_VERSE_COUNTS[chapterId] || 47;

    const createdAt = new Date(verseData.createdAt);
    const isRecentFetch = Date.now() - createdAt.getTime() < 60000;
    const source = isRecentFetch ? 'api' : 'cache';

    return res.status(200).json({
      success: true,
      data: verseData,
      verses_count: versesCount,
      source,
    });
  } catch (error: any) {
    console.error('====================================================');
    console.error('[CRITICAL VERSE ENDPOINT ERROR]', error);
    console.error('====================================================');
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch verse',
      details: error?.response?.data || error?.message || String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}