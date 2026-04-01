import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllChapters } from '@/lib/api-services/chapter.service';
import { handleError } from '@/lib/api-utils/error-handler';

interface ApiResponse {
  error?: string;
  message?: string;
  [key: string]: any;
}

// Simple in-memory cache for chapters
let chaptersCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Serve from cache if not expired
  if (chaptersCache && Date.now() - cacheTimestamp < CACHE_TTL) {
    return res.status(200).json(chaptersCache);
  }

  try {
    const chapters = await getAllChapters();
    chaptersCache = chapters;
    cacheTimestamp = Date.now();
    return res.status(200).json(chapters);
  } catch (error: any) {
    return handleError(error, res);
  }
}