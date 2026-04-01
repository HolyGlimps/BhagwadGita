import Head from 'next/head';
import HeroSection from '@/components/HeroSection';
import VerseOfTheDay from '@/components/VerseOfTheDay';
import QuickActions from '@/components/QuickActions';
import BackgroundDecorations from '@/components/BackgroundDecorations';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bhagavad Gita - Wisdom & Teachings</title>
        <meta name="description" content="Read the sacred wisdom of the Bhagavad Gita in a modern, distraction-free digital environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundDecorations />

      <div
        className="text-gray-900 dark:text-white flex flex-col h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <section
          className="min-h-screen flex items-center justify-center snap-center snap-always"
          style={{ scrollSnapAlign: 'center' }}
        >
          <HeroSection />
        </section>

        <section
          className="min-h-screen flex items-center justify-center snap-center snap-always border-t border-gray-100/30 dark:border-gray-900/10 pb-16 sm:pb-20 lg:pb-24"
          style={{ scrollSnapAlign: 'center' }}
        >
          <VerseOfTheDay />
        </section>

        <section
          className="min-h-screen flex flex-col justify-center snap-center snap-always border-t border-gray-100/30 dark:border-gray-900/10"
          style={{ scrollSnapAlign: 'center' }}
        >
          <div className="flex-grow flex items-center justify-center">
            <QuickActions />
          </div>
          <footer className="border-t border-gray-100/30 dark:border-gray-900/10 py-8 sm:py-12 px-4 sm:px-6 transition-opacity duration-700">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bhagavad Gita — A timeless source of wisdom and guidance
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-600">
                  <span>•</span>
                  <span>Read · Reflect · Transform</span>
                  <span>•</span>
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}