import React from 'react';

/**
 * Hero Section
 * Minimal, reading-focused welcome section
 * Sets the tone for a distraction-free reading experience
 */
const HeroSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12">
        <div className="space-y-4 sm:space-y-2">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold">
            Welcome to a Sacred Reading Experience
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Bhagavad Gita
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl font-light">
            A timeless guide to wisdom, purpose, and inner peace. Read the sacred teachings of Lord Krishna in a modern, distraction-free environment designed for deep contemplation.
          </p>
        </div>

        {/* Visual Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-grow h-px bg-gradient-to-r from-amber-600/50 to-transparent dark:from-amber-500/30"></div>
          <span className="text-amber-600 dark:text-amber-400">•</span>
          <div className="flex-grow h-px bg-gradient-to-l from-amber-600/50 to-transparent dark:from-amber-500/30"></div>
        </div>

        {/* Minimal Stats */}
        <div className="grid grid-cols-3 gap-6 sm:gap-8 py-4">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">18</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Chapters</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">700+</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Verses</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">∞</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Wisdom</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
