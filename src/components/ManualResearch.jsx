import React, { useState } from 'react';

export default function ManualResearch({ companyName, onSubmit, onRetry }) {
  const [notes, setNotes] = useState({
    businessModel: '',
    keyProducts: '',
    moat: '',
    industryTrend: '',
    management: ''
  });

  const handleChange = (field) => (e) => {
    setNotes(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(notes);
  };

  return (
    <div className="min-h-screen p-5 max-w-3xl mx-auto py-12 animate-fade-in-up relative">
      <button 
        onClick={onRetry}
        className="absolute top-5 left-5 text-[color:var(--color-muted)] hover:text-white flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Search
      </button>

      <div className="mb-10 text-center mt-12">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-3 tracking-tight">{companyName}</h1>
        <p className="text-[color:var(--color-muted)] uppercase tracking-widest text-sm">Qualitative Assessment</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Business Model</label>
          <textarea
            className="w-full glass border-[color:var(--color-border)] rounded-xl p-5 text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] min-h-[100px] transition-all"
            placeholder="How does the company make money?"
            value={notes.businessModel}
            onChange={handleChange('businessModel')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Key Products & Services</label>
          <textarea
            className="w-full glass border-[color:var(--color-border)] rounded-xl p-5 text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] min-h-[100px] transition-all"
            placeholder="What are their main offerings?"
            value={notes.keyProducts}
            onChange={handleChange('keyProducts')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Competitive Advantage / Moat</label>
          <textarea
            className="w-full glass border-[color:var(--color-border)] rounded-xl p-5 text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] min-h-[100px] transition-all"
            placeholder="Why would customers choose them over competitors?"
            value={notes.moat}
            onChange={handleChange('moat')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Industry Trend</label>
          <select
            className="w-full glass border-[color:var(--color-border)] rounded-xl p-5 text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] appearance-none transition-all"
            value={notes.industryTrend}
            onChange={handleChange('industryTrend')}
          >
            <option value="" className="bg-[#1A1A1A]">Select a trend...</option>
            <option value="Growing" className="bg-[#1A1A1A]">Growing</option>
            <option value="Stable" className="bg-[#1A1A1A]">Stable</option>
            <option value="Declining" className="bg-[#1A1A1A]">Declining</option>
            <option value="Saturated" className="bg-[#1A1A1A]">Saturated</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Management Notes</label>
          <textarea
            className="w-full glass border-[color:var(--color-border)] rounded-xl p-5 text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] min-h-[100px] transition-all"
            placeholder="Any red flags or strong track records?"
            value={notes.management}
            onChange={handleChange('management')}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[color:var(--color-accent)] to-white text-[#0D0D0D] font-bold py-5 rounded-xl text-lg hover:shadow-[0_0_20px_var(--accent-glow)] transform hover:-translate-y-1 transition-all duration-300 mt-4"
        >
          Compute Fundamentals
        </button>
      </form>
    </div>
  );
}
