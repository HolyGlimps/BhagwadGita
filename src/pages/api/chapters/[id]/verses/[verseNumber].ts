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

    let verseData: ResponseData;
    try {
      verseData = await getVerse(chapterId, verseNum);
    } catch (err: any) {
      console.error('Error in getVerse:', err);
      return res.status(500).json({ error: 'Failed to fetch verse data' });
    }
    if (!verseData) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    let chapterData: ResponseData;
    try {
      chapterData = await fetchChapter(chapterId.toString());
    } catch (err) {
      console.error('Error in fetchChapter:', err);
      return res.status(500).json({ error: 'Failed to fetch chapter data' });
    }
    if (!chapterData || typeof chapterData.verses_count !== 'number') {
      return res.status(404).json({ error: 'Chapter not found or invalid data' });
    }
    const versesCount = chapterData.verses_count;

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