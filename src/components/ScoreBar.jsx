import React from 'react';

export default function ScoreBar({ label, score, max }) {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-white/5 last:border-0 group">
      <span className="text-gray-300 w-48 font-medium group-hover:text-white transition-colors">{label}</span>
      <div className="flex items-center gap-4 flex-1 w-full mt-2 sm:mt-0">
        <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[color:var(--color-accent)] to-[#60a5fa] rounded-full shadow-[0_0_10px_var(--accent-glow)] transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-right w-16 text-sm font-mono text-white/70 font-bold">
          {score}<span className="text-[color:var(--color-muted)] font-normal">/{max}</span>
        </span>
      </div>
    </div>
  );
}
