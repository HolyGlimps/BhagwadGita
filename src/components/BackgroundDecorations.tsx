import React from 'react';

export default function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden flex items-center justify-center">
      
      {/* 1. Ambient Glowing Orbs (Blurs) */}
      <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[80px] sm:blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-amber-600/10 dark:bg-amber-600/5 rounded-full blur-[180px] sm:blur-[350px]" />

      {/* 2. Cosmic Dust (Subtle Dot Pattern with Drift Animation) */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] animate-dust"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #d97706 1.5px, transparent 1.5px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* 3. Cosmic Mandala (Wheel of Dharma / Sacred Geometry) */}
      <div className="absolute opacity-[0.02] dark:opacity-[0.02] w-[80vw] sm:w-[50vw] max-w-lg text-amber-900 dark:text-amber-100 translate-y-[20vh] lg:translate-y-0 lg:-translate-x-[20vw]">
        
        <svg viewBox="0 0 140 140" fill="none" stroke="currentColor" strokeWidth="0.5" aria-hidden="true" className="overflow-visible">
          
          <g className="origin-center" style={{ animation: 'spin 180s linear infinite' }}>
            <circle cx="70" cy="70" r="30" strokeWidth="1.5" />
            <circle cx="70" cy="40" r="30" />
            <circle cx="70" cy="100" r="30" />
            <circle cx="44.02" cy="55" r="30" />
            <circle cx="95.98" cy="55" r="30" />
            <circle cx="44.02" cy="85" r="30" />
            <circle cx="95.98" cy="85" r="30" />

            <circle cx="70" cy="70" r="60" strokeWidth="1.5" />
            <circle cx="70" cy="70" r="64" strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="70" cy="70" r="68" strokeWidth="0.5" />
            <circle cx="70" cy="70" r="2" fill="currentColor" />
          </g>
        </svg>
      </div>
    </div>
  );
}