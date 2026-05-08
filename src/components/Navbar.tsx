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
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 backdrop-blur-sm bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 font-amita">
            <span className="text-xl sm:text-2xl transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
              Bhagavad Gita
            </span>
            <span className="text-amber-600 dark:text-amber-500/60 transition-opacity group-hover:opacity-100 opacity-0 text-xs">✧</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-6 relative" ref={menuRef}>
              {/* Chapters Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setShowChaptersMenu(!showChaptersMenu)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  Chapters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showChaptersMenu ? 'rotate-180' : ''}`}
                  />
                </Button>

                {/* Dropdown Menu */}
                {showChaptersMenu && (
                  <div className="absolute top-full right-0 mt-1 w-72 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl p-2 overflow-y-auto z-50">
                    {/* All Chapters Option */}
                    <Link
                      href="/chapters"
                      onClick={() => setShowChaptersMenu(false)}
                      className="block w-full text-left px-3 py-1 rounded-md text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-600 transition-colors mb-2 border-b border-gray-200 dark:border-gray-800/60"
                    >
                      📖 View All Chapters
                    </Link>

                    {/* Individual Chapters */}
                    {loadingChapters ? (
                      <div className="px-3 py-1 text-xs text-gray-500 text-center">Loading...</div>
                    ) : chapters.length === 0 ? (
                      <div className="px-3 py-1 text-xs text-gray-500 text-center">No chapters found</div>
                    ) : (
                      chapters.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/chapters/${chapter.chapter_number}`}
                          onClick={() => setShowChaptersMenu(false)}
                          className="block w-full text-left px-3 py-1 rounded-md text-md hover:bg-amber-600 transition-colors font-eczar"
                        >
                          Chapter {chapter.chapter_number}: {chapter.name}
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