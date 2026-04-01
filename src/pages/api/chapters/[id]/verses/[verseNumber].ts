import type { NextApiRequest, NextApiResponse } from 'next';
import { getVerse } from '@/lib/verseCache';
import { fetchChapter } from '@/lib/api-utils/rapidapi.client';

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

    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', `verse-${chapterId}-${verseNum}`);

    const verseData = await getVerse(chapterId, verseNum);
    const chapterData = await fetchChapter(chapterId.toString());
    const versesCount = chapterData.verses_count || 700;

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
    console.error('Verse endpoint error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch verse',
    });
  }
}