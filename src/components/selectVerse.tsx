import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { chapterState, verseCountState } from '@/store/store';

function SelectVerse() {
     const router = useRouter();
     const [selectedVerse, setSelectedVerse] = useState('');

     const chapter = useRecoilValue(chapterState);
     const verseCount = useRecoilValue(verseCountState);

     const chapterNumber = parseInt(chapter);
     const maxVerses = parseInt(verseCount) || 0;

     const handleSelectVerse = (event) => {
          const verse = event.target.value;
          setSelectedVerse(verse);

          if (verse) {
               router.push(`/chapter/${chapterNumber}/verse/${verse}`);
          }
     };

     return (
          <select
               className="text-black font-semibold bg-white border border-gray-400 rounded-md px-3 py-2"
               value={selectedVerse}
               onChange={handleSelectVerse}
          >
               <option value="" disabled hidden>Select a Verse</option>
               {Array.from({ length: maxVerses }, (_, i) => (
                    <option key={i} value={`${i + 1}`}>
                         Verse {i + 1}
                    </option>
               ))}
          </select>
     );
}

export default SelectVerse;