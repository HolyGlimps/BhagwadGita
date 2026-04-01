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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 dark:border-amber-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <p className="text-red-600 dark:text-red-400 mb-6 text-lg">{error}</p>
                    <Link href="/chapters">
                        <button className="px-6 py-2 bg-amber-600 dark:bg-amber-500 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors">
                            All Chapters
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">No chapter data found</p>
            </div>
        );
    }

    return (
        <div className="text-gray-900 dark:text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/chapters">
                        <button className="text-amber-600 dark:text-amber-400 hover:underline font-medium">
                            ← All Chapters
                        </button>
                    </Link>
                </div>

                {/* Chapter Header */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                        {data.name}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 italic">
                        {data.name_meaning}
                    </p>
                </div>

                {/* Chapter Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Chapter Number
                        </p>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {data.chapter_number}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Total Verses
                        </p>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                            {data.verses_count}
                        </p>
                    </div>
                </div>

                {/* Chapter Summary */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-4">Chapter Summary</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                        {data.chapter_summary}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/chapters/${data.chapter_number}/verses`} className="flex-1">
                        <Button className="w-full px-6 py-5 bg-amber-600 dark:bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors">
                            Browse All Verses
                        </Button>
                    </Link>
                    <Link href={`/chapters/${data.chapter_number}/verse/1`} className="flex-1">
                        <Button className="w-full px-6 py-5 bg-gray-200 dark:bg-gray-700 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            Start Reading
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}