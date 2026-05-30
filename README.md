# StockLens

StockLens is a modern, fundamental stock analysis web application built to help you research companies efficiently and make informed investment decisions. 

Built with React, Vite, and Tailwind CSS, it features a premium glassmorphic UI, dynamic financial data extraction, and an intuitive "target-locked" workflow that forces you to evaluate a business qualitatively before diving into the numbers.

## Features

- **Dynamic Data Fetching**: Pulls live price, financial statements, and key statistics using the `yahoo-finance2` API.
- **Vercel Serverless Proxy**: Fully deployable to Vercel without CORS errors or Yahoo Finance crumb/cookie blocks.
- **Familiarity Gate**: A qualitative assessment checkpoint to ensure you understand the business, its moat, and industry trends before looking at valuations.
- **Fundamental Scoring Engine**: Automatically scores a company out of 100 based on Profitability (ROE, Margins), Growth, Financial Health (D/E, Current Ratio), and Valuation (P/E).
- **Automated Valuation Verdict**: Classifies the stock as Overvalued, Undervalued, Fair Value, or a Fixed End based on intelligent criteria.
- **Risk Detection**: Automatically flags high volatility, negative free cash flows, and high debt loads.
- **Professional PDF Export**: Natively uses `@media print` to strip the dark mode UI and generate a pristine, white-paper style analyst report via the browser's print dialog.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RhaVans/Stocklens.git
   cd stocklens
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   *Note: This utilizes `concurrently` to launch both the Vite frontend and a local Node.js proxy server on port 3001 to handle Yahoo Finance API calls.*

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This project is configured out-of-the-box for Vercel. 

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Vercel will automatically detect the Vite framework and utilize the `vercel.json` config to route `/api/yahoo` calls to the provided Serverless Function in `api/yahoo.js`.

No additional environment variables or configurations are required.

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Data Source**: Yahoo Finance API (via `yahoo-finance2`)
- **Backend / Proxy**: Express (Local dev) / Vercel Serverless Functions (Prod)
