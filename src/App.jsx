import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import FamiliarityGate from './components/FamiliarityGate';
import ManualResearch from './components/ManualResearch';
import LoadingScreen from './components/LoadingScreen';
import SummaryScreen from './components/SummaryScreen';

import { fetchStockData } from './services/yahooService';
import { calculateScore } from './engine/calculationEngine';

function App() {
  const [step, setStep] = useState('home'); // home | gate | manual | loading | summary
  const [ticker, setTicker] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [stockData, setStockData] = useState(null);
  const [researchResult, setResearchResult] = useState(null);
  const [manualNotes, setManualNotes] = useState(null);
  const [error, setError] = useState(null);

  const handleStart = async (selectedTicker) => {
    setTicker(selectedTicker);
    setStep('loading');
    setError(null);
    setCompanyName(selectedTicker); // Fallback until fetched

    try {
      const data = await fetchStockData(selectedTicker);
      setStockData(data);
      setCompanyName(data.companyName);
      setStep('gate');
    } catch (err) {
      setError(err.message);
    }
  };

  const processAndShowSummary = () => {
    if (!stockData) return;
    const result = calculateScore(stockData);
    setResearchResult(result);
    setStep('summary');
  };

  const handleFamiliar = () => {
    setManualNotes(null);
    processAndShowSummary();
  };

  const handleUnfamiliar = () => {
    setStep('manual');
  };

  const handleManualSubmit = (notes) => {
    setManualNotes(notes);
    processAndShowSummary();
  };

  const handleRetry = () => {
    setStep('home');
    setTicker('');
    setStockData(null);
    setResearchResult(null);
    setManualNotes(null);
    setError(null);
  };

  return (
    <>
      {step === 'home' && <HomeScreen onStart={handleStart} />}
      
      {step === 'loading' && <LoadingScreen companyName={companyName} error={error} onRetry={handleRetry} />}
      
      {step === 'gate' && <FamiliarityGate companyName={companyName} onFamiliar={handleFamiliar} onUnfamiliar={handleUnfamiliar} onRetry={handleRetry} />}
      
      {step === 'manual' && <ManualResearch companyName={companyName} onSubmit={handleManualSubmit} onRetry={handleRetry} />}
      
      {step === 'summary' && stockData && researchResult && (
        <SummaryScreen stock={stockData} result={researchResult} notes={manualNotes} onRetry={handleRetry} />
      )}
    </>
  );
}

export default App;
