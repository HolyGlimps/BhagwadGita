import { useRouter } from 'next/router';
import Link from 'next/link';
import { useStreamingVerses } from '@/hooks/useStreamingVerses';
import VerseStreamList from '@/components/VerseStreamList';

export default function ChapterVerses() {
  const router = useRouter();
  const { id } = router.query;

  const chapterId = Array.isArray(id) ? id[0] : id;

  const {
    verses,
    totalVerses,
    loading,
    streaming,
    error,
    progress,
    versesLoaded,
  } = useStreamingVerses(chapterId);

  if (loading && verses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 border-amber-600 dark:border-amber-500 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Fetching chapter metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-gray-900 dark:text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">

        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-2">
          <Link href="/chapters">
            <button className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
              ← Back to Chapters
            </button>
          </Link>

          {Number(chapterId) > 0 && (
            <div className="flex items-center gap-2">
              {Number(chapterId) > 1 && (
                <Link href={`/chapters/${Number(chapterId) - 1}/verses`}>
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 text-xs transition-colors">
                    ← Chapter {Number(chapterId) - 1}
                  </button>
                </Link>
              )}
              {Number(chapterId) < 18 && (
                <Link href={`/chapters/${Number(chapterId) + 1}/verses`}>
                  <button className="hover:bg-amber-50 dark:hover:bg-amber-900/20 px-3 py-1.5 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs transition-colors">
                    Chapter {Number(chapterId) + 1} →
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>

        <VerseStreamList
          chapterId={parseInt(String(id), 10)}
          verses={verses}
          totalVerses={totalVerses}
          loading={loading}
          streaming={streaming}
          progress={progress}
          versesLoaded={versesLoaded}
          error={error}
        />
      </div>
    </div>
  );
}
