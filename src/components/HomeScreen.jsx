import React, { useState } from 'react';

export default function HomeScreen({ onStart }) {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      onStart(ticker.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[color:var(--color-accent)] opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[color:var(--color-success)] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="z-10 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-outfit font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-accent)] to-white tracking-tight text-glow">
          StockLens
        </h1>
        <p className="text-lg md:text-xl text-[color:var(--color-muted)] mb-12 font-light">
          Deep fundamental analysis in seconds.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto flex flex-col gap-5">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Enter Ticker (e.g. NVDA, BBCA.JK)"
            className="w-full glass rounded-2xl p-5 text-center text-xl font-mono text-white focus:outline-none focus:border-[color:var(--color-accent)] focus:ring-1 focus:ring-[color:var(--color-accent)] transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[color:var(--color-accent)] to-white text-[#0D0D0D] font-bold py-5 rounded-2xl text-lg hover:shadow-[0_0_20px_var(--accent-glow)] transform hover:-translate-y-1 transition-all duration-300"
          >
            Commence Research
          </button>
        </form>

        <p className="mt-8 text-sm text-[color:var(--color-muted)] max-w-sm mx-auto opacity-70">
          Global coverage. Add exchange suffix for non-US (e.g. .JK for Jakarta)
        </p>
      </div>
    </div>
  );
}
