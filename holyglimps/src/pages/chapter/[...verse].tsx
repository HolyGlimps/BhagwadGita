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
    <div className="verse">
      <h3>
        Chapter {chapter_number}, Verse {verse_number}
      </h3>
      <p>{text}</p>

      <h4>Commentaries</h4>
      {/* <ul>
        {commentaries.map((commentary) => (
          <li key={commentary.id}>
            <strong>{commentary.author_name}</strong>: {commentary.description}
          </li>
        ))}
      </ul> */}

      <h4>Translations</h4>
      {/* <ul>
        {translations.map((translation) => (
          <li key={translation.id}>
            <strong>{translation.author_name}</strong> ({translation.language}):{' '}
            {translation.description}
          </li>
        ))}
      </ul> */}

      <h4>Transliteration</h4>
      <p>{transliteration}</p>
    </div>
  );
}
