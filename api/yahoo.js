import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { ticker } = req.query;
    if (!ticker) {
      return res.status(400).json({ error: 'Ticker is required' });
    }

    const modules = [
      "financialData",
      "defaultKeyStatistics",
      "incomeStatementHistory",
      "balanceSheetHistory",
      "cashflowStatementHistory",
      "assetProfile",
      "price"
    ];

    const data = await yahooFinance.quoteSummary(ticker, { modules });
    res.status(200).json(data);
  } catch (error) {
    console.error("Yahoo API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
