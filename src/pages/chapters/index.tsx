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
        <section className="">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="space-y-2">
              <div className="inline-block">
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold font-amita text-gray-900 dark:text-white">
                  Bhagavad <span className="text-amber-600 dark:text-amber-500">Gita</span>
                </h1>
              </div>
              <div className='opacity-50'>
                <p className="text-base sm:text-lg max-w-2xl leading-relaxed">
                  Explore the 18 chapters of the Bhagavad Gita. Each chapter contains sacred verses that offer guidance on dharma, wisdom, and the path to enlightenment.
                </p>
                <div className="flex items-center gap-4 text-md pt-2">
                  <div className="flex items-center gap-2">
                    <span>18 Chapters</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                  <div className="flex items-center gap-2">
                    <span>700+ Verses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ChaptersGrid />
        </section>

        <section className="">
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