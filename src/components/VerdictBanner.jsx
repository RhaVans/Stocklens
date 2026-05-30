import React, { useState } from 'react';

const VERDICT_CONFIG = {
  UNDERVALUE: { bg: '#1B5E20', text: '#FFFFFF', label: 'UNDERVALUED' },
  FAIR_VALUE: { bg: '#E65100', text: '#FFFFFF', label: 'FAIRLY VALUED' },
  OVERVALUE: { bg: '#B71C1C', text: '#FFFFFF', label: 'OVERVALUED' },
  FIXED_END: { bg: '#263238', text: '#FFFFFF', label: 'FIXED / END VALUE', hasInfo: true }
};

export default function VerdictBanner({ verdict, totalScore }) {
  const [showModal, setShowModal] = useState(false);
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.FAIR_VALUE;

  // Derive gradient based on bg color
  const gradientStyle = {
    background: `linear-gradient(135deg, ${config.bg}88 0%, ${config.bg}44 100%)`,
    borderColor: `${config.bg}88`,
    boxShadow: `0 0 40px ${config.bg}33`
  };

  return (
    <>
      <div 
        className="w-full py-10 px-5 text-center relative overflow-hidden rounded-3xl border mb-12 animate-fade-in-up backdrop-blur-md"
        style={gradientStyle}
      >
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-outfit font-bold mb-4 flex items-center justify-center gap-4 text-white tracking-tight" style={{ textShadow: `0 0 20px ${config.bg}` }}>
            {config.label}
            {config.hasInfo && (
              <button 
                onClick={() => setShowModal(true)}
                className="text-white opacity-60 hover:opacity-100 transition-opacity rounded-full w-10 h-10 flex items-center justify-center border border-white/30 hover:border-white/80 bg-black/20"
                title="More Info"
              >
                i
              </button>
            )}
          </h2>
          <div className="text-xl md:text-2xl font-mono text-white/90">
            Score: <span className="font-bold text-white">{totalScore}</span> / 100
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fade-in-up" onClick={() => setShowModal(false)}>
          <div className="glass border-[color:var(--color-border)] p-10 rounded-3xl max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-3xl font-outfit font-bold mb-4 text-[color:var(--color-accent)]">Fixed / End Value</h3>
            <p className="text-gray-300 mb-4 leading-relaxed text-lg">
              This company has likely reached its growth ceiling.
              Revenue is stable but not expanding meaningfully.
            </p>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Not necessarily bad — often a reliable dividend stock —
              but do not expect high capital appreciation.
            </p>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-[color:var(--color-surface)] border border-gray-600 py-4 rounded-xl hover:bg-gray-700/80 transition-colors font-bold text-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
