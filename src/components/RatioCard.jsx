import React from 'react';

export default function RatioCard({ name, value, label, level }) {
  const colorMap = {
    Strong: 'text-[color:var(--color-success)]',
    Fair: 'text-[color:var(--color-warning)]',
    Weak: 'text-[color:var(--color-danger)]',
    Neutral: 'text-gray-400'
  };

  const labelColor = colorMap[level] || colorMap.Neutral;

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all hover:-translate-y-1">
      <h4 className="text-xs text-[color:var(--color-muted)] mb-3 uppercase tracking-[0.2em]">{name}</h4>
      <div className="text-3xl font-outfit font-bold text-white mb-3" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-opacity-30 ${labelColor} ${labelColor.replace('text-', 'border-').replace('color-', 'color-')}`}>
        {label}
      </div>
    </div>
  );
}
