import React from 'react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <>
      <section className="relative pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Content Wrapper */}
        <div className="relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 max-w-6xl mx-auto items-center">

            <div className="flex flex-col justify-center order-2 lg:order-1 text-center lg:text-left z-10">
              <div className="mb-2 sm:mb-4 md:mb-6">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-amber-700 dark:text-amber-400 font-semibold mb-2 sm:mb-4">
                  Bhagavad Gita
                </p>

                <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="font-serif italic font-light">
                    Wisdom<br />Rediscovered
                  </span>
                </h1>
              </div>

              <div className="mb-6 sm:mb-8 lg:mb-14 max-w-lg mx-auto lg:mx-0">
                <p className="text-sm sm:text-base leading-relaxed opacity-50">
                  The answers to life's greatest problems are found in the Gita.
                  <br className="hidden sm:block" />
                  Navigate this sacred text with clarity, reflect deeply, and unlock timeless wisdom for your modern journey.
                </p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">18</p>
                  <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Chapters</p>
                </div>
                <div className="h-8 w-px bg-gray-300/30 dark:bg-gray-600/30"></div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">700+</p>
                  <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Verses</p>
                </div>
                <div className="h-8 w-px bg-gray-300/30 dark:bg-gray-600/30"></div>
                <div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">∞</p>
                  <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Wisdom</p>
                </div>
              </div>

              {/* Elegant CTA */}
              <div className="flex justify-center lg:justify-start items-center gap-4">
                <Link href="/chapters/1">
                  <button className="group relative px-8 sm:px-10 py-3 border border-amber-600 dark:border-amber-500 rounded-lg text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-widest text-xs sm:text-sm transition-all duration-300 hover:shadow-md hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30 hover:bg-amber-50/50 dark:hover:bg-amber-950/20">
                    Start Reading
                    <span className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-px bg-amber-600 dark:bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </Link>

                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  Chapter 1
                </span>
              </div>
            </div>

            {/* Decorative OM */}
            <div className="flex items-center justify-center relative order-1 lg:order-2 scale-[0.75] sm:scale-80 lg:scale-100 -mt-20 sm:-mt-14  lg:m-0">

              <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-amber-100/20 dark:from-amber-500/5 to-transparent dark:to-transparent blur-3xl"></div>

              <div className="relative w-80 h-80">
                <div className="glow-backdrop absolute inset-0 rounded-full"></div>
                <div className="ring-spin-slow ring-breathe-1 absolute inset-0 rounded-full border-2 border-dashed border-amber-600/20 dark:border-amber-400/15"></div>
                <div className="ring-spin-slow absolute inset-0 flex items-start justify-center ">
                  <div className="dot-orbit-120-top w-2 h-2 rounded-full bg-amber-600/40 dark:bg-amber-400/30 mt-1"></div>
                </div>
                <div className="ring-spin-reverse ring-breathe-2 absolute inset-8 rounded-full border-2 border-dashed border-amber-600/25 dark:border-amber-400/18"></div>
                <div className="ring-spin-reverse absolute inset-8 flex items-start justify-center ">
                  <div className="dot-orbit-120-top w-2 h-2 rounded-full bg-amber-600/50 dark:bg-amber-400/40 mt-1"></div>
                </div>

                <div className="ring-spin ring-breathe-3 absolute inset-16 rounded-full border-2 border-dashed border-amber-600/30 dark:border-amber-400/22"></div>
                <div className="ring-spin absolute inset-16 flex items-start justify-center ">
                  <div className="dot-orbit-120-top w-2 h-2 rounded-full bg-amber-600/60 dark:bg-amber-400/50 mt-1"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute w-full h-full rounded-full border border-amber-600/30 dark:border-amber-400/25"></div>
                    <div className="absolute w-56 h-56 rounded-full border border-amber-600/20 dark:border-amber-400/15"></div>
                    <div className="absolute w-48 h-48 rounded-full border border-amber-600/15 dark:border-amber-400/10"></div>

                    {/* Center Ornament */}
                    <div className="relative z-10 text-center">
                      <div className="om-icon text-8xl mb-2">🕉</div>
                      <p className="text-xs uppercase tracking-tight text-amber-700 dark:text-amber-400 font-light">Sacred Wisdom</p>
                    </div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6">
                      <div className="dot-orbit-120-top w-3 h-3 rounded-full bg-amber-600/50 dark:bg-amber-400/50"></div>
                    </div>
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-6">
                      <div className="dot-orbit-120-right w-3 h-3 rounded-full bg-amber-600/50 dark:bg-amber-400/50"></div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6">
                      <div className="dot-orbit-120-bottom w-3 h-3 rounded-full bg-amber-600/50 dark:bg-amber-400/50"></div>
                    </div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-6">
                      <div className="dot-orbit-120-left w-3 h-3 rounded-full bg-amber-600/50 dark:bg-amber-400/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;