import React from 'react';
import Link from 'next/link';
import Toggle from '@/components/toggle-icon';

/**
 * Modern Navigation Bar
 * Minimal, distraction-free navbar with warm accents
 * Mobile-first responsive design
 */
const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800/50 backdrop-blur-sm bg-white/90 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Brand/Logo - with warm accent on hover */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
              Bhagavad Gita
            </span>
            <span className="text-amber-600 dark:text-amber-500/60 transition-opacity group-hover:opacity-100 opacity-0 text-xs">✧</span>
          </Link>

          {/* Theme Toggle */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden sm:flex items-center gap-6">
              <Link
                href="#verse"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                Today's Verse
              </Link>
              <Link
                href="/chapters"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
              >
                Chapters
              </Link>
            </nav>
            <div className="transition-transform hover:scale-110">
              <Toggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
