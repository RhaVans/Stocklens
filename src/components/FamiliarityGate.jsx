import React from 'react';

export default function FamiliarityGate({ companyName, onFamiliar, onUnfamiliar, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center max-w-3xl mx-auto relative overflow-hidden animate-fade-in-up">
      <button 
        onClick={onRetry}
        className="absolute top-5 left-5 text-[color:var(--color-muted)] hover:text-white flex items-center gap-2 transition-colors z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Search
      </button>

      <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-[color:var(--color-accent)] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="mb-10 z-10">
        <h2 className="text-xl text-[color:var(--color-muted)] font-medium mb-3 tracking-widest uppercase">Target Locked</h2>
        <h1 className="text-4xl md:text-6xl font-outfit font-bold text-white tracking-tight">{companyName}</h1>
      </div>

      <h3 className="text-xl mb-10 z-10 text-gray-300 font-light">Do you understand this company's core business model?</h3>

      <div className="flex flex-col md:flex-row gap-6 w-full z-10">
        <button
          onClick={onFamiliar}
          className="flex-1 glass-card p-10 hover:border-[color:var(--color-success)] transition-all group rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-success)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="text-4xl font-outfit font-bold text-[color:var(--color-success)] mb-3 group-hover:scale-105 transition-transform">YES</div>
          <p className="text-sm text-gray-400">Skip to quantitative metrics</p>
        </button>

        <button
          onClick={onUnfamiliar}
          className="flex-1 glass-card p-10 hover:border-[color:var(--color-accent)] transition-all group rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-accent)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="text-4xl font-outfit font-bold text-[color:var(--color-accent)] mb-3 group-hover:scale-105 transition-transform">NO</div>
          <p className="text-sm text-gray-400">Start qualitative research</p>
        </button>
      </div>
    </div>
  );
}
