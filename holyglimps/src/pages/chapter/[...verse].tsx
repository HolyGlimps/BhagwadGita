import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Verse = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { verse } = router.query;

  const chapterNumber = verse[0];
  const verseNumber = verse[2];

  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: 'GET',
        url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/${chapterNumber}/verses/${verseNumber}/`,
        headers: {
          'X-RapidAPI-Key':
            '5725d40cfemsh0ca35a3e8abe856p1b3effjsn2e6a501084c9',
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
    fetchData();
  }, [chapterNumber, verseNumber]);

  if (status === 'unauthenticated') {
    return <p>Access Denied. Please Sign In to Access This Page.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <header>
        <h1 className="text-2xl font-semibold">Bhagavad Gita</h1>
      </header>
      <ShowVerse
        verse={data}
        chapterNumber={chapterNumber}
        verseNumber={verseNumber}
      />
    </div>
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
  } = verse;

  const router = useRouter();

  const handleNext = () => {
    const nextVerseNumber = parseInt(verseNumber) + 1;
    router.push(`/chapter/${chapterNumber}/verse/${nextVerseNumber}`);
  };

  return (
    <>
      <nav>
        {/* To Navigate user back and allow them to switch the chapter directly while he is reading a verse */}
      </nav>

      <div className="verse">
        <h3 className='font-extrabold text-xl'>
          Chapter {chapter_number}, Verse {verse_number}
        </h3>
        <p className='ml-5 text-2xl'>{text}</p>
        
        {/* <h4 className='font-semibold'>Trans-literation</h4> */}
        <p className='ml-5 text-lime-600'>{transliteration}</p>

        <div className='border border-gray-300 rounded-md m-2'>
          <h4 className='font-bold text-xl pt-2 ml-3'>Translations</h4>
          <ul className='ml-5'>
            {translations && translations.map((translation) => (
              <li key={translation.id} className='p-1'>
                <strong className='text-orange-600'>{translation.author_name}</strong> ({translation.language}):{' '}
                {translation.description}
              </li>
            ))}
          </ul>
        </div>

        <div className='border border-gray-300 rounded-md m-2'>
          <h3 className='font-bold text-xl pt-1 ml-3'>Commentaries</h3>
          <ul className='ml-5'>
            {commentaries && commentaries.map((commentary) => (
              <li className="p-1" key={commentary.id}>
                <strong className='text-orange-600'>{commentary.author_name}</strong>: {commentary.description}
              </li>
            ))}
          </ul>
        </div>

        <div className='flex items-center justify-center'>
          <button className='bg-blue border border-gray-500 rounded-md px-1 mr-1'> Previous </button>
          <button className='bg-blue border border-gray-500 rounded-md px-1 ml-1'> Next </button>
        </div>
      </div>
    </>
  );
}