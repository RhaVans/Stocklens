import React from 'react';

export default function RiskBadge({ label, level }) {
  const isHigh = level === 'red';
  const colorVar = isHigh ? 'var(--color-danger)' : 'var(--color-warning)';
  
  return (
    <div 
      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-opacity-30 backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 cursor-default"
      style={{
        backgroundColor: `${colorVar}22`,
        borderColor: `${colorVar}55`,
        color: colorVar,
        boxShadow: `0 0 10px ${colorVar}22`
      }}
    >
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colorVar }}></div>
      {label}
    </div>
  );
}
