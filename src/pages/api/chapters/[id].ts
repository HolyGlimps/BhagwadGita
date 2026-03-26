import type { NextApiRequest, NextApiResponse } from 'next';
import { getChapterData } from '@/lib/api-services/chapter.service';
import { handleError, handleValidationError } from '@/lib/api-utils/error-handler';

interface ApiResponse {
  error?: string;
  message?: string;
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

  try {
    const chapter = await getChapterData(id);
    return res.status(200).json(chapter);
  } catch (error: any) {
    if (error.message.includes('required') || error.message.includes('must be')) {
      return handleValidationError(error.message, res);
    }

    return handleError(error, res);
  }
}
