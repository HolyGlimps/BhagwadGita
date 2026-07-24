import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Toggle from '@/components/toggle-icon';
import UserMenu from '@/components/UserMenu';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Button } from '@/components/ui';
import { ChevronDown } from 'lucide-react';

interface Chapter {
  id: number;
  chapter_number: number;
  name: string;
  summary?: string;
}

const Navbar: React.FC = () => {
  const [showChaptersMenu, setShowChaptersMenu] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showChaptersMenu && chapters.length === 0) {
      setLoadingChapters(true);
      axios
        .get('/api/chapters')
        .then((res) => {
          setChapters(res.data.data || res.data);
        })
        .catch((err) => console.error('Failed to fetch chapters:', err))
        .finally(() => setLoadingChapters(false));
    }
  }, [showChaptersMenu, chapters.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowChaptersMenu(false);
      }
    };

    if (showChaptersMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChaptersMenu]);

  return (
    <nav className="top-0 z-40 sticky bg-background backdrop-blur-sm border-gray-200 dark:border-gray-800/50 border-b">
      <div className="mx-auto px-4 sm:px-6 py-3 sm:py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="group flex items-center gap-2">
            <span className="dark:group-hover:text-amber-400 group-hover:text-amber-700 text-lg sm:text-xl transition-colors">
              Bhagavad Gita
            </span>
            <span className="opacity-0 group-hover:opacity-100 text-amber-600 dark:text-amber-500/60 text-xs transition-opacity">✧</span>
          </Link>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden relative sm:flex items-center gap-6" ref={menuRef}>
              {/* Chapters Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setShowChaptersMenu(!showChaptersMenu)}
                  className="flex items-center gap-1 text-gray-600 hover:text-amber-700 dark:hover:text-amber-400 dark:text-gray-400 text-sm transition-colors"
                >
                  Chapters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showChaptersMenu ? 'rotate-180' : ''}`}
                  />
                </Button>

                {/* Dropdown Menu */}
                {showChaptersMenu && (
                  <div className="top-full right-0 z-50 absolute bg-background shadow-xl mt-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg w-72 max-h-96 overflow-y-auto">
                    {/* All Chapters Option */}
                    <Link
                      href="/chapters"
                      onClick={() => setShowChaptersMenu(false)}
                      className="block hover:bg-muted mb-2 px-3 py-2 pb-2 border-gray-200 dark:border-gray-700 border-b rounded-md w-full font-semibold text-amber-700 dark:text-amber-400 text-sm text-left transition-colors"
                    >
                      📖 View All Chapters
                    </Link>

                    {/* Individual Chapters */}
                    {loadingChapters ? (
                      <div className="px-3 py-2 text-gray-500 text-xs text-center">Loading...</div>
                    ) : chapters.length === 0 ? (
                      <div className="px-3 py-2 text-gray-500 text-xs text-center">No chapters found</div>
                    ) : (
                      chapters.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/chapters/${chapter.chapter_number}`}
                          onClick={() => setShowChaptersMenu(false)}
                          className="block hover:bg-muted px-3 py-2 rounded-md w-full text-sm text-left transition-colors"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">
                            Chapter {chapter.chapter_number}: {chapter.name}
                          </div>
                          {chapter.summary && (
                            <div className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1">
                              {chapter.summary}
                            </div>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </nav>

            <Toggle />

            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;