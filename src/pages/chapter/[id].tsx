import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import axios from 'axios';
import { useState, useEffect } from 'react';
import ChapterSelector from '@/components/chapterselector';
import Providers from '@/components/providers';
import Toggle from '@/components/toggle-icon';
import { verseState } from '../../store/store';
import { useRecoilState } from 'recoil';

export default function Page() {
    const { data: session, status } = useSession()
    const [versecount, setVerseCount] = useRecoilState(verseState);

    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`/api/chapters/${id}`);  // ← CORRECT endpoint
                setData(response.data);
                setVerseCount(response.data.verses_count);
            } catch (err) {
                console.error('Failed to fetch chapter:', err);
                setError('Failed to load chapter data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGoBack = () => {
        router.push("/");
    };

    const handleStartReading = () => {
        router.push(`/chapter/${id}/verse/1`)
    }

    if (loading) {
        return (
            <Providers>
                <div className="bg-slate-200 dark:bg-cyan-950 h-screen flex items-center justify-center">
                    <p className='text-3xl'>Loading data...</p>
                </div>
            </Providers>
        );
    }

    if (error) {
        return (
            <Providers>
                <div className="bg-slate-200 dark:bg-cyan-950 h-screen flex items-center justify-center">
                    <p className='text-3xl text-red-600'>{error}</p>
                </div>
            </Providers>
        );
    }

    return (
        <Providers>
            <div className="bg-slate-200 dark:bg-cyan-950 h-screen">
                <nav className="p-4 text-white border-b border-gray-300 dark:border-slate-700">
                    <div className="flex justify-between items-center">
                        <button onClick={handleGoBack} className="font-bold text-xl text-black dark:text-white border border-gray-400 rounded-md px-1">Go Back</button>
                        <div className="flex items-center justify-between">
                            <div id="toggle-icon" className="transition duration-500 ease-in-out rounded-full border border-slate-700 mr-4">
                                <Toggle />
                            </div>
                            <ChapterSelector />
                        </div>
                    </div>
                </nav>

                {data && (
                    <div>
                        <ChapterInfo data={data} />
                        <div className='flex items-center justify-center'>
                            <button className="bg-blue-500 text-white rounded-md px-4 py-2" onClick={handleStartReading}>
                                Start Reading
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Providers>
    );
}

function ChapterInfo({ data }) {
    if (!data) {
        return <p>Loading data...</p>;
    }

    const {
        name,
        name_meaning,
        chapter_number,
        verses_count,
        chapter_summary,
    } = data;

    return (
        <div className="bg-white dark:bg-sky-800 rounded-lg p-6 shadow-md m-11">
            <h2 className="text-4xl font-semibold text-indigo-700 dark:text-orange-300 text-center">{name}</h2>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="text-3xl text-gray-700 dark:text-white">Chapter Number</p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-white">{chapter_number}</p>
                </div>
                <div>
                    <p className="text-3xl text-gray-700 dark:text-white text-right">Verses Count</p>
                    <p className="text-2xl font-semibold dark:text-white text-right">{verses_count}</p>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-2xl text-gray-700 dark:text-white text-center">Name Meaning : {name_meaning}</p>
            </div>
            <div className="mt-6">
                <p className="text-2xl text-gray-700 dark:text-white">Chapter Summary</p>
                <p className="text-lg text-gray-700 dark:text-white ml-8">{chapter_summary}</p>
            </div>
        </div>
    );
}