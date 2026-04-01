import type { NextApiResponse } from 'next';

interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

export function handleError(error: any, res: NextApiResponse<ErrorResponse>): void {
  const statusCode = error.response?.status || 500;
  const errorMessage = error.message || 'Internal server error';

  console.error(`[API Error] Status: ${statusCode}, Message:`, errorMessage);

  // Handle specific error types
  if (error.response?.status === 401) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'RapidAPI credentials invalid or expired',
    });
  }

  if (error.response?.status === 404) {
    return res.status(404).json({
      error: 'Not found',
      message: 'Requested resource not found',
    });
  }

  if (error.response?.status === 429) {
    return res.status(429).json({
      error: 'Rate limited',
      message: 'Too many requests to RapidAPI',
    });
  }

  // Generic error response
  res.status(statusCode).json({
    error: 'API request failed',
    message: errorMessage,
    statusCode,
  });
}

export function handleValidationError(
  message: string,
  res: NextApiResponse<ErrorResponse>
): void {
  res.status(400).json({
    error: 'Validation error',
    message,
  });
}