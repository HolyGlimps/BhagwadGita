import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import axios from 'axios';

interface Chapter {
  chapter_number: number;
  id: number;
  name_translated: string;
  name_transliterated: string;
  chapter_summary: string;
  verses_count: number;
}

export default function ChaptersGrid() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/chapters');
        const data = Array.isArray(response.data) ? response.data : response.data.chapters || [];
        setChapters(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch chapters:', err);
        setError('Failed to load chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-500 animate-breathing"></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-500 animate-breathing" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-amber-600 dark:bg-amber-500 animate-breathing" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error Loading Chapters</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {chapters.map((chapter) => (
        <Link key={chapter.chapter_number} href={`/chapters/${chapter.chapter_number}`}>
          <Card className="h-full border-l-4 border-amber-600 dark:border-amber-500 bg-white dark:bg-slate-900/50 hover:shadow-lg dark:hover:shadow-amber-900/20 transition-all duration-200 cursor-pointer hover:border-amber-700 dark:hover:border-amber-400 overflow-hidden group flex flex-col">
            {/* Card Content */}
            <div className="px-6 py-5 flex flex-col flex-1">

              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold tracking-wider">
                  Chapter {chapter.chapter_number}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                {chapter.name_translated}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 font-serif mb-4">
                {chapter.name_transliterated}
              </p>

              {chapter.chapter_summary && (
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5 flex-1 line-clamp-2">
                  {chapter.chapter_summary}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-600 dark:text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {chapter.verses_count}
                  </span>
                </div>
                <div className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Read →
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}