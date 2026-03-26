import React from 'react';
import Toggle from '@/components/toggle-icon';
import SelectVerse from '@/components/selectVerse';

interface VerseHeaderProps {
  onGoBack: () => void;
  verseNumber: string | number;
  verseCount: string | number;
}

const VerseHeader: React.FC<VerseHeaderProps> = ({
  onGoBack,
  verseNumber,
  verseCount,
}) => {
  return (
    <div
      className="py-5 fixed w-full z-50 pb-4 border-b border-gray-100 dark:border-gray-800
      backdrop-filter backdrop-blur bg-opacity-30"
    >
      <nav className="flex items-center justify-between px-3">
        <button
          onClick={onGoBack}
          className="font-bold text-xl text-black dark:text-white border border-gray-400 rounded-md px-1"
        >
          Go Back
        </button>
        <h2 className="">Bhagwat Gita</h2>
        <p>
          Verse: {verseNumber}/{verseCount}
        </p>
        <div className="flex items-center justify-between">
          <div
            id="toggle-icon"
            className="transition duration-500 ease-in-out rounded-full border border-slate-700 mr-4"
          >
            <Toggle />
          </div>
          <SelectVerse />
        </div>
      </nav>
    </div>
  );
};

export default VerseHeader;
