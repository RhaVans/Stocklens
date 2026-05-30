import React, { useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import ScoreBar from './ScoreBar';
import VerdictBanner from './VerdictBanner';
import RiskBadge from './RiskBadge';
import RatioCard from './RatioCard';
import RevenueChart from './RevenueChart';

export default function SummaryScreen({ stock, result, notes, onRetry }) {
  const printRef = useRef();

  const handleExport = async () => {
    if (!printRef.current) return;
    
    try {
      const element = printRef.current;
      
      // Temporarily remove backdrop-filter (html2canvas doesn't support it)
      const glassEls = element.querySelectorAll('.glass, .glass-card');
      glassEls.forEach(el => {
        el.dataset.origBg = el.style.backgroundColor || '';
        el.style.backdropFilter = 'none';
        el.style.webkitBackdropFilter = 'none';
        el.style.backgroundColor = '#1a1a2e';
      });
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#09090b',
        logging: false,
        useCORS: true,
      });
      
      // Restore backdrop-filter
      glassEls.forEach(el => {
        el.style.backdropFilter = '';
        el.style.webkitBackdropFilter = '';
        el.style.backgroundColor = el.dataset.origBg;
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfPageHeight;
      
      // Additional pages if content is long
      while (heightLeft > 0) {
        position -= pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }
      
      pdf.save(`${stock.ticker}_research.pdf`);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export PDF. Error: ' + err.message);
    }
  };

  const formatMoney = (val) => {
    if (!val) return 'N/A';
    if (Math.abs(val) >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (Math.abs(val) >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (Math.abs(val) >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const getRoeLabel = (val) => val > 0.15 ? 'Strong' : val > 0.05 ? 'Fair' : 'Weak';
  const getMarginLabel = (val) => val > 0.15 ? 'Strong' : val > 0.05 ? 'Fair' : 'Weak';
  const getPeLabel = (val) => (val > 0 && val < 20) ? 'Strong' : (val >= 20 && val <= 30) ? 'Fair' : 'Weak';
  const getPbLabel = (val) => (val > 0 && val < 3) ? 'Strong' : (val >= 3 && val <= 5) ? 'Fair' : 'Weak';
  const getDeLabel = (val) => val < 100 ? 'Strong' : val < 200 ? 'Fair' : 'Weak';
  const getCrLabel = (val) => val > 1.5 ? 'Strong' : val > 1.0 ? 'Fair' : 'Weak';

  return (
    <div className="min-h-screen bg-[color:var(--bg)] pb-20 relative">
      
      {/* Background decorations */}
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-[color:var(--color-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none fixed"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[color:var(--color-success)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none fixed"></div>

      <div className="max-w-4xl mx-auto pt-10 px-5 flex justify-between items-center mb-8 relative z-20">
        <button 
          onClick={onRetry}
          className="text-[color:var(--color-muted)] hover:text-white flex items-center gap-2 transition-colors font-medium bg-black/20 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          New Search
        </button>

        <button 
          onClick={handleExport}
          className="glass border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all hover:shadow-[0_0_15px_var(--accent-glow)]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export PDF
        </button>
      </div>

      <div ref={printRef} className="max-w-4xl mx-auto text-white relative z-10 px-2 sm:px-0 bg-transparent">
        {/* 7. VERDICT BANNER (Moved to top or keep below? Instructions said prominent element. Let's put it near top or just follow numerical order. The prompt ordered it 7 but said "most prominent". I'll put it at the very top of the content.) */}
        <VerdictBanner verdict={result.verdict} totalScore={result.scores.total} />

        <div className="px-5 py-2">
          {/* 1. COMPANY HEADER */}
          <div className="mb-12 border-b border-white/10 pb-10 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-outfit font-bold mb-4 tracking-tight">{stock.companyName}</h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="glass border border-[color:var(--color-accent)]/30 px-4 py-1.5 rounded-full text-xs font-bold text-[color:var(--color-accent)]">{stock.ticker}</span>
              <span className="glass px-4 py-1.5 rounded-full text-xs text-gray-300">{stock.sector}</span>
              <span className="glass px-4 py-1.5 rounded-full text-xs text-gray-300">{stock.industry}</span>
              <span className="glass px-4 py-1.5 rounded-full text-xs text-gray-300">{stock.country}</span>
            </div>
            
            <div className="flex items-baseline gap-5">
              <span className="text-5xl md:text-6xl font-mono tracking-tight">{stock.currentPrice} <span className="text-2xl text-gray-400">{stock.currency}</span></span>
              <span className={`text-xl font-bold font-mono px-3 py-1 rounded-lg ${stock.dailyChangePercent >= 0 ? 'bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]' : 'bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]'}`}>
                {stock.dailyChangePercent > 0 ? '+' : ''}{(stock.dailyChangePercent * 100).toFixed(2)}%
              </span>
            </div>
            <div className="text-gray-400 mt-4 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              Market Cap: {formatMoney(stock.marketCap)}
            </div>
          </div>

          {/* 6. RISK FLAGS */}
          {result.risks && result.risks.length > 0 && (
            <div className="mb-12">
              <h3 className="text-[color:var(--color-muted)] text-sm uppercase tracking-widest mb-4">Risk Factors</h3>
              <div className="flex flex-wrap gap-3">
                {result.risks.map((risk, i) => (
                  <RiskBadge key={i} label={risk.label} level={risk.level} />
                ))}
              </div>
            </div>
          )}

          {/* 4. SCORE BREAKDOWN */}
          <div className="mb-14 glass-card p-8 md:p-10 rounded-3xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-[color:var(--color-muted)] text-sm uppercase tracking-[0.2em] mb-8 font-bold">Fundamental Score</h3>
            <div className="flex flex-col gap-2">
              <ScoreBar label="Profitability" score={result.scores.profitability} max={30} />
              <ScoreBar label="Growth" score={result.scores.growth} max={25} />
              <ScoreBar label="Financial Health" score={result.scores.health} max={25} />
              <ScoreBar label="Valuation" score={result.scores.valuation} max={20} />
            </div>
          </div>

          {/* 5. KEY RATIOS GRID */}
          <div className="mb-14 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-[color:var(--color-muted)] text-sm uppercase tracking-[0.2em] mb-6 font-bold px-2">Key Ratios</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <RatioCard name="ROE" value={`${(stock.returnOnEquity * 100).toFixed(1)}%`} label={getRoeLabel(stock.returnOnEquity)} level={getRoeLabel(stock.returnOnEquity)} />
              <RatioCard name="Net Margin" value={`${(stock.profitMargin * 100).toFixed(1)}%`} label={getMarginLabel(stock.profitMargin)} level={getMarginLabel(stock.profitMargin)} />
              <RatioCard name="P/E" value={stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'} label={getPeLabel(stock.peRatio)} level={getPeLabel(stock.peRatio)} />
              <RatioCard name="P/B" value={stock.pbRatio ? stock.pbRatio.toFixed(1) : 'N/A'} label={getPbLabel(stock.pbRatio)} level={getPbLabel(stock.pbRatio)} />
              <RatioCard name="D/E" value={stock.debtToEquity ? `${stock.debtToEquity.toFixed(0)}%` : 'N/A'} label={getDeLabel(stock.debtToEquity)} level={getDeLabel(stock.debtToEquity)} />
              <RatioCard name="Current Ratio" value={stock.currentRatio ? stock.currentRatio.toFixed(2) : 'N/A'} label={getCrLabel(stock.currentRatio)} level={getCrLabel(stock.currentRatio)} />
            </div>
          </div>

          {/* 3. FINANCIAL SNAPSHOT TABLE */}
          <div className="mb-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[color:var(--color-muted)] text-sm uppercase tracking-[0.2em] mb-6 font-bold px-2">Financial Snapshot (3 Yr)</h3>
            <div className="overflow-x-auto glass-card rounded-2xl mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/30 text-gray-400 border-b border-white/10 uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="p-4 font-normal">Year</th>
                    <th className="p-4 font-normal text-right">Revenue</th>
                    <th className="p-4 font-normal text-right">Net Income</th>
                    <th className="p-4 font-normal text-right">FCF</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {stock.incomeHistory.map((inc, i) => {
                    const cf = stock.cashflowHistory.find(c => c.year === inc.year) || {};
                    return (
                      <tr key={inc.year} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="p-4">{inc.year}</td>
                        <td className="p-4 text-right">{formatMoney(inc.revenue)}</td>
                        <td className="p-4 text-right">{formatMoney(inc.netIncome)}</td>
                        <td className="p-4 text-right">{formatMoney(cf.fcf)}</td>
                      </tr>
                    );
                  })}
                  {stock.incomeHistory.length === 0 && (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {stock.incomeHistory.length > 0 && (
              <RevenueChart data={[...stock.incomeHistory].reverse()} />
            )}
          </div>

          {/* 2. YOUR RESEARCH NOTES */}
          {notes && Object.values(notes).some(v => v.trim() !== '') && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-[color:var(--color-muted)] text-sm uppercase tracking-[0.2em] mb-6 font-bold px-2">Manual Notes</h3>
              <div className="glass-card p-8 rounded-3xl">
                {notes.businessModel && (
                  <div className="mb-4 last:mb-0">
                    <span className="text-[color:var(--color-accent)] text-xs uppercase block mb-1">Business Model</span>
                    <p className="text-gray-300 text-sm">{notes.businessModel}</p>
                  </div>
                )}
                {notes.keyProducts && (
                  <div className="mb-4 last:mb-0">
                    <span className="text-[color:var(--color-accent)] text-xs uppercase block mb-1">Key Products</span>
                    <p className="text-gray-300 text-sm">{notes.keyProducts}</p>
                  </div>
                )}
                {notes.moat && (
                  <div className="mb-4 last:mb-0">
                    <span className="text-[color:var(--color-accent)] text-xs uppercase block mb-1">Moat</span>
                    <p className="text-gray-300 text-sm">{notes.moat}</p>
                  </div>
                )}
                {notes.industryTrend && (
                  <div className="mb-4 last:mb-0">
                    <span className="text-[color:var(--color-accent)] text-xs uppercase block mb-1">Industry Trend</span>
                    <p className="text-gray-300 text-sm">{notes.industryTrend}</p>
                  </div>
                )}
                {notes.management && (
                  <div className="mb-4 last:mb-0">
                    <span className="text-[color:var(--color-accent)] text-xs uppercase block mb-1">Management</span>
                    <p className="text-gray-300 text-sm">{notes.management}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
