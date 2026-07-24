import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 60000,
});

const RAPID_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const RAPID_API_KEY = process.env.RAPID_API_KEY;
const RAPID_API_HOST = process.env.RAPID_API_HOST;

interface RapidAPIConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export async function rapidAPIRequest<T = any>(config: RapidAPIConfig): Promise<T> {
  if (!RAPID_API_BASE_URL || !RAPID_API_KEY || !RAPID_API_HOST) {
    throw new Error('RapidAPI credentials not configured');
  }

  const response = await axios.request({
    method: config.method || 'GET',
    url: config.url,
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': RAPID_API_HOST,
      'Content-Type': 'application/json'
    },
    httpsAgent,
  });

  return response.data;
}

export async function fetchAllChapters() {
  return rapidAPIRequest({
    url: `${RAPID_API_BASE_URL}/v2/chapters/`,
  });
}

export async function fetchChapter(chapterId: string | string[]): Promise<any> {
  return rapidAPIRequest({
    url: `${RAPID_API_BASE_URL}/v2/chapters/${chapterId}/`,
  });
}

export async function fetchVerse(
  chapterId: string | string[],
  verseNumber: string | string[]
): Promise<any> {
  return rapidAPIRequest({
    url: `${RAPID_API_BASE_URL}/v2/chapters/${chapterId}/verses/${verseNumber}/`,
  });
}