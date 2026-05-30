import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
const app = express();
app.use(cors());

app.get('/api/yahoo', async (req, res) => {
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
    res.json(data);
  } catch (error) {
    console.error("Yahoo API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local Yahoo Proxy running on http://localhost:${PORT}`);
});
