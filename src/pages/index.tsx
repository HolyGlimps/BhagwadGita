import Head from 'next/head';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import VerseOfTheDay from '@/components/VerseOfTheDay';
import QuickActions from '@/components/QuickActions';
import Providers from "../components/providers";

export default function Home() {
  return (
    <Providers>
      <Head>
        <title>Bhagavad Gita - Wisdom & Teachings</title>
        <meta name="description" content="Read the sacred wisdom of the Bhagavad Gita in a modern, distraction-free digital environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <HeroSection />

          <section className="border-t border-gray-200 dark:border-gray-800/50">
            <VerseOfTheDay />
          </section>

          {/* Quick Actions */}
          <section className="border-t border-gray-200 dark:border-gray-800/50 bg-gray-50 dark:bg-gray-900/30">
            <QuickActions />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800/50 py-8 sm:py-12 px-4 sm:px-6">
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
      </div>
    </Providers>
  )
}