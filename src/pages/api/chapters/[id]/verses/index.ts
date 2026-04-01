import type { NextApiRequest, NextApiResponse } from 'next';
import { getChapterAllVerses } from '@/lib/chapterVerses';

interface ApiResponse {
  error?: string;
  [key: string]: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing chapter id' });
  }

  try {
    const chapterId = parseInt(id as string);

    if (isNaN(chapterId)) {
      return res.status(400).json({ error: 'Chapter ID must be a valid integer' });
    }

    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('ETag', `chapter-${chapterId}-verses`);

    const data = await getChapterAllVerses(chapterId);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Get chapter verses error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch chapter verses',
    });
  }
}