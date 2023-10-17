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
    <div className="verse">
      <h3 className="text-xl font-semibold">
        Chapter {chapter_number}, Verse {verse_number}
      </h3>
      <p>{text}</p>

      <h4 className="font-semibold">Transliteration</h4>
      {/* <p>
        {translations.map((translate) => {
          <p>{translate}</p>;
        })}
      </p> */}

      <div className="flex items-center justify-center mt-4">
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white rounded-md px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
