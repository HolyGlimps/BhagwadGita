import { useRouter } from 'next/router';
import { chapterState } from '@/store/store';
import { useRecoilState } from 'recoil';

function ChapterSelector() {
    const router = useRouter();
    const [selectedChapter, setSelectedChapter] = useRecoilState(chapterState);

    const handleChapterSelect = (event) => {
        const chapter = event.target.value;
        setSelectedChapter(chapter);
        if (chapter) {
            router.push(`/chapter/${chapter}`);
        }
    };

    return (
        <select
            className="relative w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-amber-500 dark:hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-amber-400 dark:focus:ring-offset-gray-900 transition-all cursor-pointer appearance-none"
            value={selectedChapter}
            onChange={handleChapterSelect}
        >
            <option value="" disabled hidden>
                Select a Chapter
            </option>
            {Array.from({ length: 18 }, (_, i) => (
                <option key={i} value={`${i + 1}`}>
                    Chapter {i + 1}
                </option>
            ))}
        </select>
    );
}

export default ChapterSelector;
