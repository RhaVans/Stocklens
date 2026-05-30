import React from 'react';

export default function LoadingScreen({ companyName, error, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
      {error ? (
        <div className="max-w-md">
          <div className="text-[color:var(--color-danger)] text-xl mb-4 p-4 border border-[color:var(--color-danger)] rounded-lg bg-red-900 bg-opacity-20">
            {error}
          </div>
          <button
            onClick={onRetry}
            className="bg-[color:var(--color-surface)] text-white border border-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[color:var(--color-accent)] rounded-full animate-spin mb-6"></div>
          <p className="text-lg text-gray-300">
            {companyName ? `Analyzing ${companyName}...` : 'Fetching data...'}
          </p>
        </div>
      )}
    </div>
  );
}
