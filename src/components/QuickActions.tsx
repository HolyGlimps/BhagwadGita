import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { chapterState, verseState } from '@/store/store';

interface ActionCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  highlight: boolean;
}

export default function QuickActions() {
  const lastChapter = useRecoilValue(chapterState);
  const lastVerse = useRecoilValue(verseState);

  // Determine if user has reading history
  const hasContinueOption = lastChapter && lastVerse;

  const actions: ActionCard[] = [
    ...(hasContinueOption ? [{
      icon: '📖',
      title: 'Continue Reading',
      description: `Last verse: ${lastChapter}.${lastVerse}`,
      href: `/chapter/${lastChapter}/${lastVerse}`,
      highlight: true,
    }] : []),
    {
      icon: '🔍',
      title: 'Search Verses',
      description: 'Find verses by keyword or theme',
      href: '/search',
      highlight: false,
    },
    {
      icon: '📚',
      title: 'Browse Chapters',
      description: 'Explore all 18 chapters',
      href: '/chapters',
      highlight: false,
    },
    {
      icon: '✨',
      title: 'Random Verse',
      description: 'Discover a verse by chance',
      href: '/random',
      highlight: false,
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className={`
              group p-6 sm:p-8 rounded-lg border-2 transition-all duration-200
              ${action.highlight
                ? 'border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/30 hover:shadow-lg hover:shadow-amber-200 dark:hover:shadow-amber-900/50'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-amber-400 dark:hover:border-amber-500/50 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-gray-800'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{action.icon}</span>
              {action.highlight && (
                <span className="text-xs font-semibold px-2 py-1 bg-amber-600 text-white rounded-full">
                  Resume
                </span>
              )}
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${action.highlight ? 'text-amber-900 dark:text-amber-100' : 'text-gray-900 dark:text-gray-100'}`}>
              {action.title}
            </h3>
            <p className={`text-sm ${action.highlight ? 'text-amber-800 dark:text-amber-200' : 'text-gray-600 dark:text-gray-400'}`}>
              {action.description}
            </p>
            <div className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-transform group-hover:translate-x-1 ${action.highlight ? 'text-amber-700 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'}`}>
              Explore
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
