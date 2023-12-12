import { useState } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState, useRecoilValue } from 'recoil';
import {chapterState} from '@/store/store';
import {verseState}  from '@/store/store';
function SelectVerse() {
     const router = useRouter();
     const [selectedChapter, setSelectedChapter] = useRecoilState(chapterState);
     const [verseCount, setVerseCount] = useState('');
     const chapter = useRecoilValue(chapterState);
     const handleSelectVerse = (event) => {
          // const chapter = event.target.value;
          // console.log(chapter);
          // setSelectedChapter(chapter);
          const verse = event.target.value;
          console.log(verse);          
          setVerseCount(verse);
          if (verse) {
               router.push(`/chapter/${chapter}/verse/${verse}`); // Use your desired URL format
          }
     };

   return (
          <select
               className="text-black font-semibold bg-white border border-gray-400 rounded-md px-3 py-2"
               value={verseCount}
               onChange={handleSelectVerse}
          >
               <option value="" disabled hidden>Select a Verse</option>
               {Array.from({ length: 18 }, (_, i) => ( // Required -> length : {verseCount}
                    <option key={i} value={`${i + 1}`}>
                         Verse {i + 1}
                    </option>
               ))}
          </select>
     );
}

export default SelectVerse;
