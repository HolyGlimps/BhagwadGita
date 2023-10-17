import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Verse = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { verse } = router.query;
  console.log(verse);
  // Ensure that the verse data is initialized as an empty object
  const [data, setData] = useState({});

  //   const dverse = [1, 1, 1];
  const chapterNumber = verse[0];
  const verseNumber = verse[2];

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
        // Set the data using the useState hook
        console.log(response.data);
        setData(response.data);
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
      <ShowVerse verse={data} />
    </div>
  );
};

export default Verse;

const ShowVerse = ({ verse }) => {
  if (!verse) {
    return null; // Return nothing if verse data is not available yet
  }

  return <VerseComponent verse={verse}></VerseComponent>;
};

function VerseComponent({ verse }) {
  const {
    id,
    verse_number,
    chapter_number,
    slug,
    text,
    commentaries,
    translations,
    transliteration,
  } = verse;

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