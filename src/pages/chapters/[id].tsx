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
            <div className="flex justify-center items-center bg-background min-h-screen">
                <div className="text-center">
                    <div className="mx-auto mb-4 border-amber-600 dark:border-amber-500 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center px-4 min-h-screen">
                <div className="max-w-md text-center">
                    <p className="mb-6 text-red-600 dark:text-red-400 text-lg">{error}</p>
                    <Link href="/chapters">
                        <button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 px-6 py-2 rounded-lg text-white transition-colors">
                            All Chapters
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center bg-background min-h-screen">
                <p className="text-gray-600 dark:text-gray-400">No chapter data found</p>
            </div>
        );
    }

    return (
        <div className="bg-background text-gray-900 dark:text-white">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-3">
                    <Link href="/chapters">
                        <button className="font-medium text-amber-600 dark:text-amber-400 hover:underline">
                            ← All Chapters
                        </button>
                    </Link>

                    <div className="flex items-center gap-2">
                        {data.chapter_number > 1 && (
                            <Link href={`/chapters/${data.chapter_number - 1}`}>
                                <button className="hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 text-xs transition-colors">
                                    ← Chapter {data.chapter_number - 1}
                                </button>
                            </Link>
                        )}
                        {data.chapter_number < 18 && (
                            <Link href={`/chapters/${data.chapter_number + 1}`}>
                                <button className="hover:bg-amber-50 dark:hover:bg-amber-900/20 px-3 py-1.5 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs transition-colors">
                                    Chapter {data.chapter_number + 1} →
                                </button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Chapter Header */}
                <div className="mb-8">
                    <h1 className="mb-2 font-bold text-4xl sm:text-5xl">
                        {data.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg italic">
                        {data.name_meaning}
                    </p>
                </div>

                {/* Chapter Info Grid */}
                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                        <p className="mb-2 font-medium text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">
                            Chapter Number
                        </p>
                        <p className="font-bold text-amber-600 dark:text-amber-400 text-3xl">
                            {data.chapter_number}
                        </p>
                    </div>
                    <div>
                        <p className="mb-2 font-medium text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">
                            Total Verses
                        </p>
                        <p className="font-bold text-amber-600 dark:text-amber-400 text-3xl">
                            {data.verses_count}
                        </p>
                    </div>
                </div>

                {/* Chapter Summary */}
                <div className="mb-8">
                    <h2 className="mb-2 font-bold text-2xl">Chapter Summary</h2>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {data.chapter_summary}
                    </p>
                </div>

                {/* Action Buttons & Chapter Navigation */}
                <div className="space-y-4">
                    <div className="flex sm:flex-row flex-col gap-4">
                        <Link href={`/chapters/${data.chapter_number}/verses`} className="flex-1">
                            <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg w-full h-10 font-medium text-white text-base transition-colors">
                                Browse All Verses
                            </Button>
                        </Link>
                        <Link href={`/chapters/${data.chapter_number}/verses/1`} className="flex-1">
                            <Button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg w-full h-10 font-medium text-gray-900 dark:text-white text-base transition-colors">
                                Start Reading
                            </Button>
                        </Link>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-gray-200 dark:border-gray-800 border-t">
                        {data.chapter_number > 1 ? (
                            <Link href={`/chapters/${data.chapter_number - 1}`}>
                                <Button className="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 text-xs transition-colors">
                                    ← Chapter {data.chapter_number - 1}
                                </Button>
                            </Link>
                        ) : <div />}

                        {data.chapter_number < 18 && (
                            <Link href={`/chapters/${data.chapter_number + 1}`}>
                                <Button className="bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg font-medium text-amber-700 dark:text-amber-400 text-xs transition-colors">
                                    Chapter {data.chapter_number + 1} →
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}