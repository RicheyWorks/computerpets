/** Desk quotes. Stocks use Yahoo chart. Crypto uses CoinGecko. No invented key. Same map as desktop `market.js`. */

export const MARKET_LABEL = "Quotes";
export const MARKET_PLACEHOLDER = "A ticker — AAPL, BTC";
export const MARKET_TRUTH = "Stocks are Yahoo chart. Crypto is CoinGecko. No paid key.";
export const YAHOO_HOST = "query1.finance.yahoo.com";
export const COINGECKO_HOST = "api.coingecko.com";
export const CANT_REACH = "can't reach";
export const NO_QUOTE = "no quote yet";
export const MAX_TICKERS = 8;
export const CRYPTO: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  DOGE: "dogecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
};

export type MarketKind = "stock" | "crypto";
export type MarketTicker = {
  id: string;
  symbol: string;
  kind: MarketKind;
  geckoId: string;
  name: string;
};
export type MarketPrefs = {
  tickers: MarketTicker[];
  currentId: string | null;
};
export type MarketLive = {
  price: number;
  name: string;
  currency: string;
  source: "yahoo" | "coingecko";
};

function clip(text: unknown, n = 24) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

function hash(text: string) {
  let n = 0;
  for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(n).toString(36);
}

export function blankMarket(): MarketPrefs {
  return { tickers: [], currentId: null };
}

export function classify(raw: unknown): { symbol: string; kind: MarketKind; geckoId: string; name: string } | null {
  const typed = clip(raw, 24);
  if (!typed) return null;
  const upper = typed.toUpperCase();
  const lower = typed.toLowerCase();
  if (CRYPTO[upper]) return { symbol: upper, kind: "crypto", geckoId: CRYPTO[upper]!, name: upper };
  const gecko = Object.keys(CRYPTO).find((k) => CRYPTO[k] === lower);
  if (gecko) return { symbol: gecko, kind: "crypto", geckoId: lower, name: gecko };
  if (/^[A-Za-z][A-Za-z0-9.-]{0,11}$/.test(typed)) return { symbol: upper, kind: "stock", geckoId: "", name: upper };
  return null;
}

export function parseTicker(raw: unknown): MarketTicker | null {
  if (!raw || typeof raw !== "object") {
    const classified = classify(raw);
    if (!classified) return null;
    return { id: `m-${hash(classified.symbol)}`, ...classified };
  }
  const o = raw as Record<string, unknown>;
  const classified = classify(o.symbol || o.name || o.query);
  if (!classified) return null;
  const id = typeof o.id === "string" && o.id ? o.id : `m-${hash(classified.symbol)}`;
  const kind: MarketKind = o.kind === "crypto" ? "crypto" : classified.kind;
  return {
    id,
    symbol: classified.symbol,
    kind,
    geckoId: kind === "crypto" ? classified.geckoId || String(o.geckoId || "") : "",
    name: clip(o.name, 32) || classified.name,
  };
}

export function parseMarket(raw: unknown): MarketPrefs {
  const next = blankMarket();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o.marketTickers) ? o.marketTickers : Array.isArray(o.tickers) ? o.tickers : [];
  next.tickers = list.map(parseTicker).filter((t): t is MarketTicker => !!t).slice(0, MAX_TICKERS);
  const want = typeof o.currentTickerId === "string" ? o.currentTickerId : typeof o.currentId === "string" ? o.currentId : null;
  next.currentId = want && next.tickers.some((t) => t.id === want) ? want : next.tickers[0]?.id ?? null;
  return next;
}

export function currentTicker(market: MarketPrefs | undefined | null): MarketTicker | null {
  const house = market && market.tickers ? market : parseMarket(market);
  if (!house.tickers.length) return null;
  return house.tickers.find((t) => t.id === house.currentId) || house.tickers[0] || null;
}

export function addTicker(market: unknown, raw: unknown): MarketPrefs {
  const house = parseMarket(market);
  const next = parseTicker(raw);
  if (!next) return house;
  const exists = house.tickers.findIndex((t) => t.id === next.id || t.symbol === next.symbol);
  if (exists >= 0) house.tickers[exists] = { ...house.tickers[exists]!, ...next };
  else house.tickers = [...house.tickers, next].slice(0, MAX_TICKERS);
  house.currentId = next.id;
  return house;
}

export function removeTicker(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  house.tickers = house.tickers.filter((t) => t.id !== id);
  if (house.currentId === id) house.currentId = house.tickers[0]?.id ?? null;
  return house;
}

export function pickTicker(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  if (house.tickers.some((t) => t.id === id)) house.currentId = id;
  return house;
}

export function yahooUrl(symbol: string) {
  const s = clip(symbol, 12).toUpperCase();
  if (!s) return "";
  return `https://${YAHOO_HOST}/v8/finance/chart/${encodeURIComponent(s)}`;
}

export function geckoUrl(id: string) {
  const q = clip(id, 32).toLowerCase();
  if (!q) return "";
  return `https://${COINGECKO_HOST}/api/v3/simple/price?ids=${encodeURIComponent(q)}&vs_currencies=usd`;
}

export function parseYahoo(json: unknown): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const chart = (json as { chart?: { result?: unknown } }).chart;
  const result = chart && Array.isArray(chart.result) ? chart.result[0] : null;
  if (!result || typeof result !== "object") return null;
  const meta = (result as { meta?: Record<string, unknown> }).meta || {};
  const price = Number(meta.regularMarketPrice);
  if (!Number.isFinite(price)) return null;
  return {
    price,
    name: clip(meta.shortName || meta.symbol, 32) || "stock",
    currency: clip(meta.currency, 8) || "USD",
    source: "yahoo",
  };
}

export function parseGecko(json: unknown, id: string): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const row = (json as Record<string, { usd?: unknown }>)[id];
  if (!row || typeof row !== "object") return null;
  const price = Number(row.usd);
  if (!Number.isFinite(price)) return null;
  return { price, name: id, currency: "USD", source: "coingecko" };
}

export function plateLine(market: MarketPrefs | undefined, live: MarketLive | null | undefined, unread = false) {
  const ticker = currentTicker(market);
  if (!ticker) return NO_QUOTE;
  if (unread && !live) return `${ticker.symbol} · ${CANT_REACH}`;
  if (!live) return `${ticker.symbol} · looking up`;
  const n = live.price >= 100 ? live.price.toFixed(2) : live.price >= 1 ? live.price.toFixed(2) : live.price.toFixed(4);
  return `${ticker.symbol} · ${n}`;
}
