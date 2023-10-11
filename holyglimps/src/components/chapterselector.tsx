import { useState } from 'react';
import { useRouter } from 'next/router';

function ChapterSelector() {
    const router = useRouter();
    const [selectedChapter, setSelectedChapter] = useState('');

    const handleChapterSelect = (event) => {
        const chapter = event.target.value;
        console.log(chapter);
        setSelectedChapter(chapter);
        if (chapter) {
            router.push(`/chapter/${chapter}`); // Use your desired URL format
        }
    };

    return (
        <select
            className="text-black font-semibold bg-white border border-gray-400 rounded-md px-3 py-2"
            value={selectedChapter}
            onChange={handleChapterSelect}
        >
            <option value="" disabled hidden>Select a Chapter</option>
            {Array.from({ length: 18 }, (_, i) => (
                <option key={i} value={`${i + 1}`}>
                    Chapter {i + 1}
                </option>
            ))}
        </select>
    );
}

export default ChapterSelector;
