import React from 'react';

interface Commentary {
  id: string;
  author_name: string;
  description: string;
}

interface VerseCommentariesProps {
  commentaries?: Commentary[];
}

const VerseCommentaries: React.FC<VerseCommentariesProps> = ({
  commentaries,
}) => {
  return (
    <details className="bg-white dark:bg-sky-800 rounded-lg p-3 pb-4 shadow-md mt-3 m-2">
      <summary
        className="cursor-pointer outline-none font-bold text-2xl ml-3 text-center
        text-indigo-800 dark:text-sky-100"
      >
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
  );
};

export default VerseCommentaries;
