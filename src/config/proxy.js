export const PROXY_BASE = "/api/yahoo?ticker=";

export function buildUrl(ticker) {
  return `${PROXY_BASE}${encodeURIComponent(ticker)}`;
}
