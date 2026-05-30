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

  const safe = (obj, key) => {
    const val = obj?.[key];
    if (val === undefined || val === null) return null;
    return typeof val === 'object' && val !== null && 'raw' in val ? val.raw : val;
  };

  const extractYear = (dateVal) => {
    if (!dateVal) return 'N/A';
    // yahoo-finance2 returns Date objects; raw API returns { raw: timestamp }
    if (dateVal instanceof Date) return dateVal.getFullYear();
    if (typeof dateVal === 'string') return new Date(dateVal).getFullYear();
    if (typeof dateVal === 'object' && 'raw' in dateVal) return new Date(dateVal.raw * 1000).getFullYear();
    if (typeof dateVal === 'number') return new Date(dateVal * 1000).getFullYear();
    return 'N/A';
  };

  return {
    // Identity
    ticker: ticker.toUpperCase(),
    companyName: price.longName ?? price.shortName ?? ticker,
    sector: profile.sector ?? "N/A",
    industry: profile.industry ?? "N/A",
    country: profile.country ?? "N/A",
    description: profile.longBusinessSummary ?? "",

    // Price
    currentPrice: safe(price, "regularMarketPrice") ?? 0,
    dailyChangePercent: safe(price, "regularMarketChangePercent") ?? 0,
    marketCap: safe(price, "marketCap") ?? 0,
    currency: price.currency ?? "USD",

    // Ratios
    returnOnEquity: safe(fin, "returnOnEquity") ?? 0,
    profitMargin: safe(fin, "profitMargins") ?? 0,
    freeCashFlow: safe(fin, "freeCashflow") ?? 0,
    revenueGrowth: safe(fin, "revenueGrowth") ?? 0,
    operatingCashflow: safe(fin, "operatingCashflow") ?? 0,
    debtToEquity: safe(fin, "debtToEquity") ?? 0,
    currentRatio: safe(fin, "currentRatio") ?? 0,
    peRatio: safe(stats, "forwardPE") ?? 0,
    pbRatio: safe(stats, "priceToBook") ?? 0,
    eps: safe(stats, "trailingEps") ?? 0,
    beta: safe(stats, "beta") ?? 0,

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
