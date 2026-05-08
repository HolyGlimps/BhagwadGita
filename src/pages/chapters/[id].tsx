import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';

interface ChapterData {
    id?: number;
    chapter_number: number;
    name: string;
    name_meaning: string;
    verses_count: number;
    chapter_summary: string;
}

export default function ChapterSummary() {
    const router = useRouter();
    const { id } = router.query;

    const [data, setData] = useState<ChapterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchChapterData = async () => {
            try {
                setLoading(true);
                const chapterId = Array.isArray(id) ? id[0] : id;
                const response = await axios.get(`/api/chapters/${chapterId}`);
                setData(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch chapter:', err);
                setError('Failed to load chapter data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchChapterData();
    }, [id]);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading Chapter | Bhagavad Gita</title>
                </Head>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head>
                    <title>Error | Bhagavad Gita</title>
                </Head>
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center max-w-md">
                        <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
                        <Link
                            href="/chapters"
                            className='inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors'
                        >
                            ← Back to Chapters
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <Head>
                    <title>No Chapter Data | Bhagavad Gita</title>
                </Head>
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-400">No chapter data found</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{`Chapter ${data.chapter_number}: ${data.name} | Bhagavad Gita`}</title>
                <meta name="description" content={data.name_meaning || `Summary and details for Chapter ${data.chapter_number} of the Bhagavad Gita.`} />
            </Head>
            <div className="text-gray-900 dark:text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/chapters"
                            className='inline-flex items-center gap-2 px-3 py-1.5 font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg transition-colors'
                        >
                            ← Back to Chapters
                        </Link>
                    </div>

                    {/* Chapter Header */}
                    <div className="mb-4 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold font-devanagari italic">
                            {data.name}
                        </h1>
                        <p className="m-2 font-martel text-xl italic">
                            {data.name_meaning}
                        </p>
                    </div>

                    {/* Chapter Info Grid */}
                    <div className="flex justify-around mb-6 px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className='text-center'>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Chapter Number
                            </p>
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {data.chapter_number}
                            </p>
                        </div>
                        <div className='text-center'>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                Total Verses
                            </p>
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                {data.verses_count}
                            </p>
                        </div>
                    </div>

                    {/* Chapter Summary */}
                    <div className="mb-6">
                        <h2 className="text-xl font-funnel mb-2">Chapter Summary</h2>
                        <div className="prose prose-invert max-w-none p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap italic text-lg">
                                {data.chapter_summary}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/chapters/${data.chapter_number}/verses`} className="flex-1">
                            <Button className="w-full px-6 py-5 sm:px-10 border border-amber-600 dark:border-amber-500 rounded-lg text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30 hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                                Browse All Verses
                            </Button>
                        </Link>
                        <Link href={`/chapters/${data.chapter_number}/verse/1`} className="flex-1">
                            <Button className="w-full px-6 py-5 sm:px-10 border border-gray-400 dark:border-gray-500 rounded-lg text-gray-700 dark:text-gray-400 font-semibold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-900/30 hover:bg-gray-50/50 dark:hover:bg-gray-950/20">
                                Start Reading <span className='uppercase text-xs'>(verse 1)</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}