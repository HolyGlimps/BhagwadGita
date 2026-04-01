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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Fetching chapter metadata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-8">
          <Link href="/chapters">
            <button className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
              ← Back to Chapters
            </button>
          </Link>
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
