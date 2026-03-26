import type { NextApiRequest, NextApiResponse } from 'next';
import { getChapterVersesMetadata } from '@/lib/api-services/chapter.service';
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
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    // Get chapter verses metadata from service
    const versesMetadata = await getChapterVersesMetadata(id);

    // Return successful response
    return res.status(200).json(versesMetadata);
  } catch (error: any) {
    // Handle validation errors
    if (error.message.includes('required') || error.message.includes('must be')) {
      return handleValidationError(error.message, res);
    }

    // Handle other errors
    return handleError(error, res);
  }
}
