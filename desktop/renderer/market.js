/** Desk quotes. Stocks use Yahoo chart. Crypto uses CoinGecko. No invented key. */
(function (root) {
  const MARKET_LABEL = "Quotes";
  const MARKET_PLACEHOLDER = "A ticker — AAPL, BTC";
  const MARKET_TRUTH = "Stocks are Yahoo chart. Crypto is CoinGecko. No paid key.";
  const YAHOO_HOST = "query1.finance.yahoo.com";
  const COINGECKO_HOST = "api.coingecko.com";
  const CANT_REACH = "can't reach";
  const NO_QUOTE = "no quote yet";
  const MAX_TICKERS = 8;
  const CRYPTO = {
    BTC: "bitcoin",
    ETH: "ethereum",
    DOGE: "dogecoin",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
  };

  function clip(text, n) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n == null ? 24 : n);
  }

  function hash(text) {
    let n = 0;
    for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
    return Math.abs(n).toString(36);
  }

  function blankMarket() {
    return { tickers: [], currentId: null };
  }

  function classify(raw) {
    const typed = clip(raw, 24);
    if (!typed) return null;
    const upper = typed.toUpperCase();
    const lower = typed.toLowerCase();
    if (CRYPTO[upper]) return { symbol: upper, kind: "crypto", geckoId: CRYPTO[upper], name: upper };
    const gecko = Object.keys(CRYPTO).find((k) => CRYPTO[k] === lower);
    if (gecko) return { symbol: gecko, kind: "crypto", geckoId: lower, name: gecko };
    if (/^[A-Za-z][A-Za-z0-9.-]{0,11}$/.test(typed)) return { symbol: upper, kind: "stock", geckoId: "", name: upper };
    return null;
  }

  function parseTicker(raw) {
    if (!raw || typeof raw !== "object") {
      const classified = classify(raw);
      if (!classified) return null;
      return { id: `m-${hash(classified.symbol)}`, ...classified };
    }
    const classified = classify(raw.symbol || raw.name || raw.query);
    if (!classified) return null;
    const id = typeof raw.id === "string" && raw.id ? raw.id : `m-${hash(classified.symbol)}`;
    const kind = raw.kind === "crypto" ? "crypto" : classified.kind;
    return {
      id,
      symbol: classified.symbol,
      kind,
      geckoId: kind === "crypto" ? classified.geckoId || raw.geckoId || "" : "",
      name: clip(raw.name, 32) || classified.name,
    };
  }

  function parseMarket(raw) {
    const next = blankMarket();
    if (!raw || typeof raw !== "object") return next;
    const list = Array.isArray(raw.marketTickers) ? raw.marketTickers : Array.isArray(raw.tickers) ? raw.tickers : [];
    next.tickers = list.map(parseTicker).filter(Boolean).slice(0, MAX_TICKERS);
    const want = typeof raw.currentTickerId === "string" ? raw.currentTickerId : typeof raw.currentId === "string" ? raw.currentId : null;
    next.currentId = want && next.tickers.some((t) => t.id === want) ? want : next.tickers[0] ? next.tickers[0].id : null;
    return next;
  }

  function currentTicker(market) {
    const house = market && market.tickers ? market : parseMarket(market);
    if (!house.tickers.length) return null;
    return house.tickers.find((t) => t.id === house.currentId) || house.tickers[0] || null;
  }

  function addTicker(market, raw) {
    const house = parseMarket(market);
    const next = parseTicker(raw);
    if (!next) return house;
    const exists = house.tickers.findIndex((t) => t.id === next.id || t.symbol === next.symbol);
    if (exists >= 0) house.tickers[exists] = { ...house.tickers[exists], ...next };
    else house.tickers = house.tickers.concat(next).slice(0, MAX_TICKERS);
    house.currentId = next.id;
    return house;
  }

  function removeTicker(market, id) {
    const house = parseMarket(market);
    house.tickers = house.tickers.filter((t) => t.id !== id);
    if (house.currentId === id) house.currentId = house.tickers[0] ? house.tickers[0].id : null;
    return house;
  }

  function pickTicker(market, id) {
    const house = parseMarket(market);
    if (house.tickers.some((t) => t.id === id)) house.currentId = id;
    return house;
  }

  function yahooUrl(symbol) {
    const s = clip(symbol, 12).toUpperCase();
    if (!s) return "";
    return `https://${YAHOO_HOST}/v8/finance/chart/${encodeURIComponent(s)}`;
  }

  function geckoUrl(id) {
    const q = clip(id, 32).toLowerCase();
    if (!q) return "";
    return `https://${COINGECKO_HOST}/api/v3/simple/price?ids=${encodeURIComponent(q)}&vs_currencies=usd`;
  }

  function parseYahoo(json) {
    if (!json || typeof json !== "object" || !json.chart || typeof json.chart !== "object") return null;
    const result = Array.isArray(json.chart.result) ? json.chart.result[0] : null;
    if (!result || typeof result !== "object") return null;
    const meta = result.meta && typeof result.meta === "object" ? result.meta : {};
    const price = Number(meta.regularMarketPrice);
    if (!Number.isFinite(price)) return null;
    const name = clip(meta.shortName || meta.symbol, 32) || "stock";
    return { price, name, currency: clip(meta.currency, 8) || "USD", source: "yahoo" };
  }

  function parseGecko(json, id) {
    if (!json || typeof json !== "object") return null;
    const row = json[id];
    if (!row || typeof row !== "object") return null;
    const price = Number(row.usd);
    if (!Number.isFinite(price)) return null;
    return { price, name: id, currency: "USD", source: "coingecko" };
  }

  function plateLine(market, live, unread) {
    const ticker = currentTicker(market);
    if (!ticker) return NO_QUOTE;
    if (unread && !live) return `${ticker.symbol} · ${CANT_REACH}`;
    if (!live) return `${ticker.symbol} · looking up`;
    const n = live.price >= 100 ? live.price.toFixed(2) : live.price >= 1 ? live.price.toFixed(2) : live.price.toFixed(4);
    return `${ticker.symbol} · ${n}`;
  }

  const api = {
    MARKET_LABEL,
    MARKET_PLACEHOLDER,
    MARKET_TRUTH,
    YAHOO_HOST,
    COINGECKO_HOST,
    CANT_REACH,
    NO_QUOTE,
    MAX_TICKERS,
    CRYPTO,
    blankMarket,
    classify,
    parseTicker,
    parseMarket,
    currentTicker,
    addTicker,
    removeTicker,
    pickTicker,
    yahooUrl,
    geckoUrl,
    parseYahoo,
    parseGecko,
    plateLine,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMarket = api;
})(typeof window !== "undefined" ? window : globalThis);
