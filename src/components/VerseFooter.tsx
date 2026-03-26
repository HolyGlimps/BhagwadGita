import React from 'react';

interface VerseFooterProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const VerseFooter: React.FC<VerseFooterProps> = ({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}) => {
  return (
    <div
      className="flex items-center justify-center w-full bottom-0 fixed
      border-gray-100 dark:border-gray-800
      backdrop-filter backdrop-blur bg-opacity-30"
    >
      <div className="m-3">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`border border-gray-500 rounded-md px-1 mr-1 transition-opacity ${canGoPrev
              ? 'bg-purple-100 dark:bg-purple-400 cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50'
            }`}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`border border-gray-500 rounded-md px-1 ml-1 transition-opacity ${canGoNext
              ? 'bg-purple-200 dark:bg-purple-500 cursor-pointer'
              : 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed opacity-50'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VerseFooter;
