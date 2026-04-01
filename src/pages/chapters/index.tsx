import Head from 'next/head';
import ChaptersGrid from '@/components/ChaptersGrid';

// Listing All Chapters
export default function ChaptersPage() {
  return (
    <>
      <Head>
        <title>Browse Chapters - Bhagavad Gita</title>
        <meta name="description" content="Explore all 18 chapters of the Bhagavad Gita with summaries and verse counts." />
      </Head>

      <main className="min-h-screen transition-colors">
        <section className="border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="space-y-4">
              <div className="inline-block">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                  Bhagavad <span className="text-amber-600 dark:text-amber-500">Gita</span>
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                Explore the 18 chapters of the Bhagavad Gita. Each chapter contains sacred verses that offer guidance on dharma, wisdom, and the path to enlightenment.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h3a1 1 0 000-2 2 2 0 00-2 2v12H4V5z" clipRule="evenodd" />
                  </svg>
                  <span>18 Chapters</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v6h6V5a2 2 0 00-2-2H5zm6 18H9c-.495 0-.9-.305-1.08-.75H3a2 2 0 01-2-2v-2.05A2.5 2.5 0 015.5 12h5a2.5 2.5 0 012.5 2.5V19a2 2 0 01-2 2zm0-1v-2.05a.5.5 0 00-.5-.5H5.5a.5.5 0 00-.5.5V20h7z" />
                    <path d="M20 5a2 2 0 00-2-2h-2.5a2 2 0 00-2 2v6h6V5zm0 7h-6v.05A2.5 2.5 0 0116.5 12h1a2.5 2.5 0 012.5 2.5V19a2 2 0 01-2 2h-2.5a2 2 0 01-2-2v-1h6v1a1 1 0 001 1h2.5a1 1 0 001-1v-3.5a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5v2h-1v-7z" />
                  </svg>
                  <span>700+ Verses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <ChaptersGrid />
        </section>

        <section className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  About the Gita
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  The Bhagavad Gita is a 700-verse Hindu scripture that is part of the epic Mahabharata. It is one of the most important texts in the Hindu tradition.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                  How to Use
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Click on any chapter to read its verses. Track your reading progress, bookmark your favorite verses, and explore different translations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}