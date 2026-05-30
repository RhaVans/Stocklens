export function calculateScore(stock) {
  let profitability = 0;
  let growth = 0;
  let health = 0;
  let valuation = 0;

  // --- PROFITABILITY (max 30) ---
  const roe = stock.returnOnEquity;
  if (roe > 0.2) profitability += 15;
  else if (roe > 0.15) profitability += 10;
  else if (roe > 0.1) profitability += 5;

  const margin = stock.profitMargin;
  if (margin > 0.15) profitability += 10;
  else if (margin > 0.1) profitability += 7;
  else if (margin > 0.05) profitability += 4;

  if (stock.freeCashFlow > 0) profitability += 5;

  // --- GROWTH (max 25) ---
  const revGrowth = stock.revenueGrowth;
  if (revGrowth > 0.15) growth = 25;
  else if (revGrowth > 0.1) growth = 18;
  else if (revGrowth > 0.05) growth = 12;
  else if (revGrowth > 0) growth = 5;

  // --- FINANCIAL HEALTH (max 25) ---
  // Yahoo returns D/E as percentage (150 = 1.5x)
  const de = stock.debtToEquity;
  if (de < 50) health += 15;
  else if (de < 100) health += 10;
  else if (de < 200) health += 5;

  const cr = stock.currentRatio;
  if (cr > 2.0) health += 10;
  else if (cr > 1.5) health += 7;
  else if (cr > 1.0) health += 4;

  // --- VALUATION (max 20) ---
  const pe = stock.peRatio;
  if (pe > 0 && pe < 15) valuation = 20;
  else if (pe >= 15 && pe < 20) valuation = 15;
  else if (pe >= 20 && pe <= 30) valuation = 8;

  const total = profitability + growth + health + valuation;

  // --- VERDICT ---
  let verdict = determineVerdict(stock, total);

  // --- RISK FLAGS ---
  const risks = detectRisks(stock);

  return {
    scores: { profitability, growth, health, valuation, total },
    verdict,
    risks,
  };
}

function determineVerdict(stock, total) {
  const isFixedEnd =
    stock.revenueGrowth < 0.03 && stock.peRatio > 25 && stock.freeCashFlow > 0;

  const isOvervalue = total < 50 || stock.peRatio > 30;
  const isUndervalue =
    total >= 70 && stock.peRatio < 18 && stock.freeCashFlow > 0;
  const isFairValue = total >= 50 && total < 70;

  if (isFixedEnd) return "FIXED_END";
  if (isOvervalue) return "OVERVALUE";
  if (isUndervalue) return "UNDERVALUE";
  if (isFairValue) return "FAIR_VALUE";
  return "FAIR_VALUE";
}

function detectRisks(stock) {
  const flags = [];
  if (stock.debtToEquity > 200)
    flags.push({ label: "High Debt", level: "red" });
  if (stock.freeCashFlow < 0)
    flags.push({ label: "Negative FCF", level: "red" });
  if (stock.eps < 0) flags.push({ label: "Negative EPS", level: "red" });
  if (stock.beta > 1.5)
    flags.push({ label: "High Volatility", level: "yellow" });
  if (stock.currentRatio < 1.0)
    flags.push({ label: "Low Liquidity", level: "yellow" });
  flags.push({
    label: "Concentration Risk — Verify Manually",
    level: "yellow",
  });
  flags.push({ label: "Disruption Risk — Verify Manually", level: "yellow" });
  return flags;
}
