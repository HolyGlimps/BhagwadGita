import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import SelectVerse from '@/components/selectVerse';

import Providers from '@/components/providers';
import Toggle from '@/components/toggle-icon';

const Verse = () => {
  const router = useRouter();
  const { verse } = router.query;

  const [chapterNumber, setChapterNumber] = useState('');
  const [verseNumber, setVerseNumber] = useState('');
  const [verseCount, setVerseCount] = useState('');

  const { data: session, status } = useSession();
  const [data, setData] = useState({});

  const handleNext = () => {
    if(verseNumber != `${verseCount}`){
      const nextVerseNumber = parseInt(verseNumber) + 1;
      router.push(`/chapter/${chapterNumber}/verse/${nextVerseNumber}`);
    }
  };
  const handlePrev = () => {
    if(verseNumber != '1') {
      const nextVerseNumber = parseInt(verseNumber) - 1;
      router.push(`/chapter/${chapterNumber}/verse/${nextVerseNumber}`);
    }
  };
  const handleGoBack = () => {
    router.push(`/chapter/${chapterNumber}`); // This will take the user back to the previous page
  };

  useEffect(() => {
    // Handle the case when verse is not defined (initial load or invalid URL)
    if (!verse) {
      return;
    }

    // Parse chapter and verse number from the URL
    const chapterNumber = verse[0];
    const verseNumber = verse[2];

    setChapterNumber(chapterNumber);
    setVerseNumber(verseNumber);

    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/${verseNumber}/`,
        headers: {
          'X-RapidAPI-Key': '5725d40cfemsh0ca35a3e8abe856p1b3effjsn2e6a501084c9',
          'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (chapterNumber !== '' && verseNumber !== '') {
      fetchData();
    }

    const fetchDataChapter = async () => {
      const options = {
        method: 'GET',
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/`,
        headers: {
          'X-RapidAPI-Key': '5725d40cfemsh0ca35a3e8abe856p1b3effjsn2e6a501084c9',
          'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com',
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data);
        setVerseCount(response.data.verses_count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataChapter();


  }, [chapterNumber, verse]);

  // if (status === 'unauthenticated') {
  //   return <p>Access Denied. Please Sign In to Access This Page.</p>;
  // }

  return (
    <>
    <Providers>
      <div className="bg-slate-200 dark:bg-cyan-950 min-h-screen">
      <div
        className='py-5 fixed w-full z-50 pb-4 border-b border-gray-100 dark:border-gray-800
          backdrop-filter backdrop-blur bg-opacity-30'>
        <nav className='flex items-center justify-between px-3'>
          <button onClick={handleGoBack} className="font-bold text-xl text-black dark:text-white border border-gray-400 rounded-md px-1">Go Back</button>
          <h2 className=''>Bhagwat Gita</h2>
          <p>Verse: {verseNumber}/{verseCount}</p>
            <div className="flex items-center justify-between">
              <div id="toggle-icon" className="transition duration-500 ease-in-out rounded-full border border-slate-700 mr-4">
                <Toggle />
              </div>
              <SelectVerse />
            </div>
        </nav>
      </div>
      

      <div className="container mx-auto">
        <div className='pt-16 pb-16'>
          <ShowVerse
            verse={data}
            chapterNumber={chapterNumber}
            verseNumber={verseNumber}
          />
        </div>
      </div>

      <div className='flex items-center justify-center w-full bottom-0 fixed
      border-gray-100 dark:border-gray-800
      backdrop-filter backdrop-blur bg-opacity-30'>
        <div className="m-3">
          <button
            onClick={handlePrev}
            className="bg-purple-100 dark:bg-purple-400 border border-gray-500 rounded-md px-1 mr-1"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-purple-200 dark:bg-purple-500 border border-gray-500 rounded-md px-1 ml-1"
          >
            Next
          </button>
        </div>
      </div>
      
      </div>
    </Providers>
    </>
  );
};

export default Verse;

const ShowVerse = ({ verse, chapterNumber, verseNumber }) => {
  if (!verse) {
    return null;
  }

  return (
    <VerseComponent
      verse={verse}
      chapterNumber={chapterNumber}
      verseNumber={verseNumber}
    />
  );
};
function VerseComponent({ verse, chapterNumber, verseNumber }) {
  const {
    id,
    verse_number,
    chapter_number,
    slug,
    text,
    transliteration,
    translations,
    commentaries,
  } = verse;

  const router = useRouter();

  return (
    <>
      <div className="verse">
        <h3 className="font-extrabold text-4xl pt-9 text-center
        text-indigo-700 dark:text-orange-300">
          Chapter {chapter_number}, Verse {verse_number}
        </h3>
        <div className='bg-white dark:bg-sky-800 rounded-lg shadow-md text-center mt-5 mb-5 p-6'>
          <p className="ml-7 text-4xl">{text}</p>
          <p className="ml-7 text-xl text-lime-600">{transliteration}</p>
        </div>

        {/* Translations always visible */}
        <div className="bg-white dark:bg-sky-800 rounded-lg m-2 p-3 pb-4 shadow-md mb-2">
          <h4 className="font-bold text-2xl ml-3 text-center
          text-indigo-800 dark:text-sky-100">Translations</h4>
          <ul className="ml-5">
            {translations &&
              translations.map((translation) => (
                <li key={translation.id} className="p-1 text-lg">
                  <strong className="text-orange-500 text-xl">
                    {translation.author_name}
                  </strong>{' '}
                  ({translation.language}): {translation.description}
                </li>
              ))}
          </ul>
        </div>

        {/* Commentaries closed by default but collapsible */}
        <details className="bg-white dark:bg-sky-800 rounded-lg p-3 pb-4 shadow-md mt-3 m-2">
          <summary className="cursor-pointer outline-none font-bold text-2xl ml-3 text-center
          text-indigo-800 dark:text-sky-100">
            Commentaries
          </summary>
          <ul className="ml-5">
            {commentaries &&
              commentaries.map((commentary) => (
                <li className="p-1 text-lg" key={commentary.id}>
                  <strong className="text-orange-600 text-xl">
                    {commentary.author_name}
                  </strong>
                  : {commentary.description}
                </li>
              ))}
          </ul>
        </details>
      </div>
    </>
  );
}