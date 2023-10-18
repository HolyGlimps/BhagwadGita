import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import SelectVerse from '@/components/selectVerse';

const Verse = () => {
  const router = useRouter();
  const { verse } = router.query;

  const [chapterNumber, setChapterNumber] = useState('');
  const [verseNumber, setVerseNumber] = useState('');
  const [verseCount, setVerseCount] = useState('');

  const { data: session, status } = useSession();
  const [data, setData] = useState({});

  const handleNext = () => {
    const nextVerseNumber = parseInt(verseNumber) + 1;
    router.push(`/chapter/${chapterNumber}/verse/${nextVerseNumber}`);
  };
  const handlePrev = () => {
    const nextVerseNumber = parseInt(verseNumber) - 1;
    router.push(`/chapter/${chapterNumber}/verse/${nextVerseNumber}`);
  };
  const handleGoBack = () => {
    router.push("/chapter/1"); // This will take the user back to the previous page
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

  if (status === 'unauthenticated') {
    return <p>Access Denied. Please Sign In to Access This Page.</p>;
  }

  return (
    <>
      <div
        className='py-5 fixed w-full z-50 pb-4 border-b border-gray-100 dark:border-gray-800
          backdrop-filter backdrop-blur-lg bg-opacity-30'>
        <nav className='flex items-center justify-between px-3'>
          <button onClick={handleGoBack} className="font-bold text-xl text-black dark:text-white border border-gray-400 rounded-md px-1">Go Back</button>
          <h2 className=''>Bhagwat Gita</h2>
          <p>Verse: {verseNumber}/{verseCount}</p>
          <SelectVerse />

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

      <div className='flex items-center justify-center bg-orange-50 dark:bg-slate-800 w-full bottom-0 fixed'>
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

        <h3 className="font-extrabold text-xl pt-5">
          Chapter {chapter_number}, Verse {verse_number}
        </h3>
        <p className="ml-5 text-2xl">{text}</p>
        {/* <h4 className='font-semibold'>Trans-literation</h4> */}
        <p className="ml-5 text-lime-600">{transliteration}</p>

        <div className="border border-gray-300 rounded-md m-2">
          <h4 className="font-bold text-xl pt-2 ml-3">Translations</h4>
          <ul className="ml-5">
            {translations &&
              translations.map((translation) => (
                <li key={translation.id} className="p-1">
                  <strong className="text-orange-600">
                    {translation.author_name}
                  </strong>{' '}
                  ({translation.language}): {translation.description}
                </li>
              ))}
          </ul>
        </div>

        <div className="border border-gray-300 rounded-md m-2">
          <h3 className="font-bold text-xl pt-1 ml-3">Commentaries</h3>
          <ul className="ml-5">
            {commentaries &&
              commentaries.map((commentary) => (
                <li className="p-1" key={commentary.id}>
                  <strong className="text-orange-600">
                    {commentary.author_name}
                  </strong>
                  : {commentary.description}
                </li>
              ))}
          </ul>
        </div>

      </div>
    </>
  );
}