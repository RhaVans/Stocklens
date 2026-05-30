import { buildUrl } from "../config/proxy.js";

export async function fetchStockData(ticker) {
  const url = buildUrl(ticker.toUpperCase());

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch data`);
  }

  const result = await response.json();

  if (!result || Object.keys(result).length === 0 || result.error) {
    throw new Error(
      "Ticker not found. Try adding .JK for Indonesian stocks (e.g. BBCA.JK)",
    );
  }

  return extractData(result, ticker);
}

function extractData(data, ticker) {
  const price = data.price ?? {};
  const fin = data.financialData ?? {};
  const stats = data.defaultKeyStatistics ?? {};
  const profile = data.assetProfile ?? {};

  const incomeList = data.incomeStatementHistory?.incomeStatementHistory ?? [];
  const balanceList = data.balanceSheetHistory?.balanceSheetStatements ?? [];
  const cashflowList = data.cashflowStatementHistory?.cashflowStatements ?? [];

  // Safely extract a value — handles both { raw: val } wrappers and direct values
  const safe = (obj, ...keys) => {
    for (const key of keys) {
      const val = obj?.[key];
      if (val === undefined || val === null) continue;
      if (typeof val === 'object' && val !== null && 'raw' in val) return val.raw;
      return val;
    }
    return null;
  };

  const extractYear = (dateVal) => {
    if (!dateVal) return 'N/A';
    if (dateVal instanceof Date) return dateVal.getFullYear();
    if (typeof dateVal === 'string') return new Date(dateVal).getFullYear();
    if (typeof dateVal === 'object' && 'raw' in dateVal) return new Date(dateVal.raw * 1000).getFullYear();
    if (typeof dateVal === 'number') return new Date(dateVal * 1000).getFullYear();
    return 'N/A';
  };

  // --- Extract raw values with multiple fallback field names ---
  const currentPrice = safe(fin, "currentPrice") ?? safe(price, "regularMarketPrice") ?? 0;
  const dailyChangePercent = safe(price, "regularMarketChangePercent") ?? 0;
  const marketCap = safe(price, "marketCap") ?? safe(stats, "marketCap") ?? 0;

  const roe = safe(fin, "returnOnEquity") ?? 0;
  const profitMargin = safe(fin, "profitMargins", "profitMargin") ?? 0;
  const fcf = safe(fin, "freeCashflow", "freeCashFlow") ?? 0;
  const revGrowth = safe(fin, "revenueGrowth") ?? 0;
  const opCashflow = safe(fin, "operatingCashflow") ?? 0;
  const de = safe(fin, "debtToEquity") ?? null;
  const cr = safe(fin, "currentRatio") ?? null;
  const eps = safe(stats, "trailingEps") ?? safe(fin, "earningsPerShare") ?? null;
  const beta = safe(stats, "beta") ?? null;

  // --- P/E: try multiple sources, then compute ---
  let pe = safe(stats, "forwardPE", "forwardPe") 
        ?? safe(stats, "trailingPE", "trailingPe") 
        ?? safe(fin, "forwardPE");
  if (!pe && currentPrice > 0 && eps && eps > 0) {
    pe = currentPrice / eps; // compute from price/EPS
  }

  // --- P/B: try multiple sources, then compute from balance sheet ---
  let pb = safe(stats, "priceToBook") ?? safe(fin, "priceToBook");
  if (!pb && marketCap > 0 && balanceList.length > 0) {
    const latestEquity = safe(balanceList[0], "totalStockholderEquity");
    if (latestEquity && latestEquity > 0) {
      pb = marketCap / latestEquity;
    }
  }

  // --- D/E: compute from balance sheet if missing ---
  let debtToEquity = de;
  if (debtToEquity === null && balanceList.length > 0) {
    const totalDebt = safe(balanceList[0], "longTermDebt", "totalLiab") ?? 0;
    const equity = safe(balanceList[0], "totalStockholderEquity") ?? 0;
    if (equity > 0) {
      debtToEquity = (totalDebt / equity) * 100; // Yahoo returns as percentage
    }
  }

  // --- Current Ratio: compute from balance sheet if missing ---
  let currentRatio = cr;
  if (currentRatio === null && balanceList.length > 0) {
    const currentAssets = safe(balanceList[0], "totalCurrentAssets") ?? 0;
    const currentLiabilities = safe(balanceList[0], "totalCurrentLiabilities") ?? 0;
    if (currentLiabilities > 0) {
      currentRatio = currentAssets / currentLiabilities;
    }
  }

  // --- ROE: compute from income + balance sheet if missing ---
  let returnOnEquity = roe;
  if (!returnOnEquity && incomeList.length > 0 && balanceList.length > 0) {
    const ni = safe(incomeList[0], "netIncome") ?? 0;
    const eq = safe(balanceList[0], "totalStockholderEquity") ?? 0;
    if (eq > 0) {
      returnOnEquity = ni / eq;
    }
  }

  return {
    // Identity
    ticker: ticker.toUpperCase(),
    companyName: price.longName ?? price.shortName ?? ticker,
    sector: profile.sector ?? "N/A",
    industry: profile.industry ?? "N/A",
    country: profile.country ?? "N/A",
    description: profile.longBusinessSummary ?? "",

    // Price
    currentPrice,
    dailyChangePercent,
    marketCap,
    currency: price.currency ?? "USD",

    // Ratios (with computed fallbacks)
    returnOnEquity: returnOnEquity ?? 0,
    profitMargin,
    freeCashFlow: fcf,
    revenueGrowth: revGrowth,
    operatingCashflow: opCashflow,
    debtToEquity: debtToEquity ?? 0,
    currentRatio: currentRatio ?? 0,
    peRatio: pe ?? 0,
    pbRatio: pb ?? 0,
    eps: eps ?? 0,
    beta: beta ?? 0,

    // Historical (last 3 years)
    incomeHistory: incomeList.slice(0, 3).map((i) => ({
      year: extractYear(i.endDate),
      revenue: safe(i, "totalRevenue") ?? 0,
      netIncome: safe(i, "netIncome") ?? 0,
      grossProfit: safe(i, "grossProfit") ?? 0,
    })),

    balanceHistory: balanceList.slice(0, 3).map((b) => ({
      year: extractYear(b.endDate),
      totalAssets: safe(b, "totalAssets") ?? 0,
      totalLiabilities: safe(b, "totalLiab") ?? 0,
      equity: safe(b, "totalStockholderEquity") ?? 0,
      cash: safe(b, "cash") ?? 0,
    })),

    cashflowHistory: cashflowList.slice(0, 3).map((c) => ({
      year: extractYear(c.endDate),
      operatingCashflow: safe(c, "totalCashFromOperatingActivities") ?? 0,
      capex: safe(c, "capitalExpenditures") ?? 0,
      fcf:
        (safe(c, "totalCashFromOperatingActivities") ?? 0) +
        (safe(c, "capitalExpenditures") ?? 0),
    })),
  };
}
