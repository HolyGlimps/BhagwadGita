import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { useVerseOfTheDay } from '@/hooks/useVerseOfTheDay';
import { useFadeInOnScroll } from '@/hooks/useFadeInOnScroll';

export default function VerseOfTheDay() {
  const { verse, loading } = useVerseOfTheDay();
  const { ref, isVisible } = useFadeInOnScroll();

  if (!verse && !loading) return null;

  return (
    <section
      ref={ref}
      className={`relative sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {loading && (
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[240px]">
          <div className="text-center animate-pulse">
            <div className="flex justify-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 opacity-100 animate-pulseiulse"></div>
              <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 opacity-60 animate-pulseuls" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-500 opacity-30 animate-pulseuls" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="text-lg uppercase tracking-widest text-gray-600 dark:text-gray-400 font-semibold">
              Loading verse of the day
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-md">
              Discovering today's wisdom...
            </p>
          </div>
        </div>
      )}
      {!loading && verse && (
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-4 sm:mb-6">
            ✨ Verse of the Day ✨
          </p>
          <Card className="border border-l-4 border-amber-600 dark:border-amber-500 p-6 sm:p-8 md:p-10 space-y-4">
            <div className="space-y-3">
              <p className="text-lg sm:text-xl md:text-2xl leading-relaxed font-serif text-gray-900 dark:text-gray-50 italic">
                "{verse.verse}"
              </p>
              {verse.transliteration && (
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium italic tracking-wide">
                  {verse.transliteration}
                </p>
              )}
            </div>
            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6 mt-4">
              <p className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400 font-semibold">
                Meaning
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {verse.meaning}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">
                — <span className="font-semibold text-amber-700 dark:text-amber-400">{verse.author}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600 text-white font-semibold">
                <Link href={`/chapters/${verse.chapter}/verse/${verse.verseNumber}`}>
                  Read Full Verse
                </Link>
              </Button>
              <p className="text-md opacity-30">
                Dive into commentary and deeper insights
              </p>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}