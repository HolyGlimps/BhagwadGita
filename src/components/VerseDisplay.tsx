import React from 'react';

interface Translation {
  id: string;
  author_name: string;
  language: string;
  description: string;
}

interface VerseDisplayProps {
  text?: string;
  transliteration?: string;
  chapterNumber?: number;
  verseNumber?: number;
  translations?: Translation[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({
  text,
  transliteration,
  chapterNumber,
  verseNumber,
  translations,
}) => {
  return (
    <>
      <h3
        className="font-extrabold text-4xl pt-9 text-center
        text-indigo-700 dark:text-orange-300"
      >
        Chapter {chapterNumber}, Verse {verseNumber}
      </h3>
      <div
        className="bg-white dark:bg-sky-800 rounded-lg shadow-md text-center mt-5 mb-5 p-6"
      >
        <p className="ml-7 text-4xl">{text}</p>
        <p className="ml-7 text-xl text-lime-600">{transliteration}</p>
      </div>

      {/* Translations always visible */}
      <div className="bg-white dark:bg-sky-800 rounded-lg m-2 p-3 pb-4 shadow-md mb-2">
        <h4
          className="font-bold text-2xl ml-3 text-center
          text-indigo-800 dark:text-sky-100"
        >
          Translations
        </h4>
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
    </>
  );
};

export default VerseDisplay;
