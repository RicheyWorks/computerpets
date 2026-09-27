/** Desk quotes. Coins (majors + pump.fun-style contract paste) + NFT collections/marketplaces. A quote waits until the open quotes plate shows this computer's network address on that https request. CoinGecko, GeckoTerminal, Yahoo, and a typed look-up also refuse inside the read wrappers when that painted line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can flip to unread / "can't reach". A late body is not parsed. Same map as desktop market.js. No invented key. */
import { clientNetLine } from "./weather-areas.ts";

export const MARKET_LABEL = "Quotes";
export const COIN_LABEL = "Coins";
export const NFT_LABEL = "NFTs";
export const MARKET_PLACEHOLDER = "Coin, ticker, or contract — ETH, BTC, pump mint";
export const NFT_PLACEHOLDER = "NFT collection — pudgy, punks";
export const MARKET_TRUTH = "Majors and search use CoinGecko. Small/meme coins (pump.fun and kin) use GeckoTerminal by mint or contract. Stocks are Yahoo chart. No paid key.";
export const NFT_TRUTH = "Collections use CoinGecko floors when reachable. Marketplaces are your list — OpenSea, Blur, Magic Eden, Rarible, Robinhood NFT — with honest offline when a venue needs a key.";
export const YAHOO_HOST = "query1.finance.yahoo.com";
export const COINGECKO_HOST = "api.coingecko.com";
export const GECKO_TERMINAL_HOST = "api.geckoterminal.com";
export const CANT_REACH = "can't reach";
export const NO_QUOTE = "no quote yet";
/** The closed plate's header before the first price: prices are read only while the plate is open. */
export const QUOTE_WAITS = "open to see the price";
export const NO_NFT = "no NFT yet";
export const MAX_TICKERS = 24;
export const MAX_NFTS = 8;
export const MAX_MARKETS = 8;
export const MAX_FAVORITES = 24;
export const FAVORITES_EMPTY = "No favorites yet — star a coin or NFT.";

export const CRYPTO: Record<string, string> = {
  BTC: "bitcoin", ETH: "ethereum", DOGE: "dogecoin", XLM: "stellar", SOL: "solana",
  XRP: "ripple", ADA: "cardano", AVAX: "avalanche-2", DOT: "polkadot", LINK: "chainlink",
  BNB: "binancecoin", MATIC: "matic-network", POL: "polygon-ecosystem-token",
};

export const DEFAULT_CRYPTO = [
  { symbol: "ETH", geckoId: "ethereum", name: "Ethereum" },
  { symbol: "DOGE", geckoId: "dogecoin", name: "Dogecoin" },
  { symbol: "XLM", geckoId: "stellar", name: "Stellar" },
  { symbol: "BTC", geckoId: "bitcoin", name: "Bitcoin" },
  { symbol: "SOL", geckoId: "solana", name: "Solana" },
  { symbol: "ADA", geckoId: "cardano", name: "Cardano" },
  { symbol: "XRP", geckoId: "ripple", name: "XRP" },
] as const;

export const DEFAULT_NFTS = [
  { geckoId: "cryptopunks", name: "CryptoPunks", symbol: "PUNK" },
  { geckoId: "bored-ape-yacht-club", name: "Bored Ape Yacht Club", symbol: "BAYC" },
  { geckoId: "pudgy-penguins", name: "Pudgy Penguins", symbol: "PPG" },
] as const;

export const NFT_MARKETPLACES = [
  { id: "opensea", name: "OpenSea", url: "https://opensea.io", note: "needs a key for live floors" },
  { id: "blur", name: "Blur", url: "https://blur.io", note: "needs a key for live floors" },
  { id: "magiceden", name: "Magic Eden", url: "https://magiceden.io", note: "needs a key for live floors" },
  { id: "rarible", name: "Rarible", url: "https://rarible.com", note: "needs a key for live floors" },
  { id: "robinhood-nft", name: "Robinhood NFT", url: "https://robinhood.com/us/en/support/articles/robinhood-nft/", note: "no public floor feed" },
] as const;

export const DEFAULT_MARKETPLACES = ["opensea", "blur", "magiceden", "rarible", "robinhood-nft"] as const;

export type MarketKind = "stock" | "crypto";
export type MarketTicker = { id: string; symbol: string; kind: MarketKind; geckoId: string; name: string; platform: string; address: string };
export type NftCollection = { id: string; geckoId: string; name: string; symbol: string };
export type NftMarketplace = { id: string; name: string; url: string; note: string };
export type MarketPrefs = { tickers: MarketTicker[]; currentId: string | null; nfts: NftCollection[]; currentNftId: string | null; marketplaces: NftMarketplace[]; favoriteTickerIds: string[]; favoriteNftIds: string[] };
export type MarketLive = { price: number; name: string; currency: string; source: "yahoo" | "coingecko" | "geckoterminal"; change24h: number | null; symbol?: string; address?: string };
export type NftLive = { geckoId: string; name: string; symbol: string; floorUsd: number | null; floorNative: number | null; nativeSymbol: string; source: "coingecko" };

function clip(text: unknown, n = 24) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, n);
}
function hash(text: string) {
  let n = 0;
  for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(n).toString(36);
}

export function defaultTickers(): MarketTicker[] {
  return DEFAULT_CRYPTO.map((row) => parseTicker({ ...row, kind: "crypto" as const })).filter((t): t is MarketTicker => !!t);
}
export function defaultNfts(): NftCollection[] {
  return DEFAULT_NFTS.map(parseNftRow).filter((t): t is NftCollection => !!t);
}
export function defaultMarketplaces(): NftMarketplace[] {
  return DEFAULT_MARKETPLACES.map(marketplaceOf).filter((t): t is NftMarketplace => !!t);
}
export function blankMarket(): MarketPrefs {
  return { tickers: defaultTickers(), currentId: null, nfts: defaultNfts(), currentNftId: null, marketplaces: defaultMarketplaces(), favoriteTickerIds: [], favoriteNftIds: [] };
}
export function marketplaceOf(idOrRow: unknown): NftMarketplace | null {
  if (!idOrRow) return null;
  if (typeof idOrRow === "string") {
    const known = NFT_MARKETPLACES.find((m) => m.id === idOrRow);
    return known
      ? { id: known.id, name: known.name, url: known.url, note: known.note }
      : { id: clip(idOrRow, 32).toLowerCase(), name: clip(idOrRow, 32), url: "", note: "custom venue" };
  }
  if (typeof idOrRow !== "object") return null;
  const o = idOrRow as Record<string, unknown>;
  const id = clip(o.id, 32).toLowerCase();
  if (!id) return null;
  const known = NFT_MARKETPLACES.find((m) => m.id === id);
  return {
    id,
    name: clip(o.name, 32) || known?.name || id,
    url: clip(o.url, 120) || known?.url || "",
    note: clip(o.note, 64) || known?.note || "custom venue",
  };
}
export function detectContract(raw: unknown): { platform: string; address: string } | null {
  const typed = String(raw || "").trim();
  if (!typed) return null;
  if (/^0x[a-fA-F0-9]{40}$/.test(typed)) return { platform: "eth", address: typed.toLowerCase() };
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(typed)) return { platform: "solana", address: typed };
  return null;
}
export function classify(raw: unknown): Omit<MarketTicker, "id"> | null {
  const typed = clip(raw, 64);
  if (!typed) return null;
  const contract = detectContract(typed);
  if (contract) {
    const short = (contract.address.slice(0, 4) + contract.address.slice(-4)).toUpperCase();
    return {
      symbol: short,
      kind: "crypto",
      geckoId: "",
      name: contract.platform === "solana" ? "Solana token" : "Token",
      platform: contract.platform,
      address: contract.address,
    };
  }
  const upper = typed.toUpperCase();
  const lower = typed.toLowerCase();
  if (CRYPTO[upper]) return { symbol: upper, kind: "crypto", geckoId: CRYPTO[upper]!, name: upper, platform: "", address: "" };
  const gecko = Object.keys(CRYPTO).find((k) => CRYPTO[k] === lower);
  if (gecko) return { symbol: gecko, kind: "crypto", geckoId: lower, name: gecko, platform: "", address: "" };
  if (/^[A-Za-z][A-Za-z0-9.-]{0,11}$/.test(typed)) return { symbol: upper, kind: "stock", geckoId: "", name: upper, platform: "", address: "" };
  return null;
}
export function parseTicker(raw: unknown): MarketTicker | null {
  if (!raw || typeof raw !== "object") {
    const classified = classify(raw);
    if (!classified) return null;
    const idKey = classified.address ? classified.platform + ":" + classified.address : classified.symbol + ":" + (classified.geckoId || "");
    return { id: "m-" + hash(idKey), ...classified };
  }
  const o = raw as Record<string, unknown>;
  const explicitAddr = clip(o.address, 64);
  const explicitPlatform = clip(o.platform, 16).toLowerCase();
  const contract = explicitAddr
    ? detectContract(explicitAddr) || (explicitPlatform ? { platform: explicitPlatform, address: explicitAddr } : null)
    : detectContract(o.symbol || o.query || "");
  const explicitGecko = clip(o.geckoId, 64).toLowerCase();
  if (contract && contract.address) {
    const platform = contract.platform || explicitPlatform || "solana";
    const address = contract.address;
    const short = (address.slice(0, 4) + address.slice(-4)).toUpperCase();
    const symbol = clip(o.symbol, 12).toUpperCase() || short;
    const id = typeof o.id === "string" && o.id ? o.id : "m-" + hash(platform + ":" + address);
    return { id, symbol, kind: "crypto", geckoId: explicitGecko || "", name: clip(o.name, 32) || symbol, platform, address };
  }
  const wantCrypto = o.kind === "crypto" || !!explicitGecko;
  if (wantCrypto && explicitGecko) {
    const symbol = clip(o.symbol || o.name || explicitGecko, 12).toUpperCase() || explicitGecko.toUpperCase().slice(0, 8);
    const id = typeof o.id === "string" && o.id ? o.id : "m-" + hash(symbol + ":" + explicitGecko);
    return { id, symbol, kind: "crypto", geckoId: explicitGecko, name: clip(o.name, 32) || symbol, platform: "", address: "" };
  }
  const classified = classify(o.symbol || o.name || o.query);
  if (!classified) return null;
  const id = typeof o.id === "string" && o.id ? o.id : "m-" + hash(classified.symbol + ":" + (classified.geckoId || classified.address || ""));
  const kind: MarketKind = o.kind === "stock" || o.kind === "crypto" ? o.kind : wantCrypto ? "crypto" : classified.kind;
  return {
    id,
    symbol: classified.symbol,
    kind,
    geckoId: kind === "crypto" ? classified.geckoId || explicitGecko || "" : "",
    name: clip(o.name, 32) || classified.name,
    platform: classified.platform || "",
    address: classified.address || "",
  };
}
export function parseNftRow(raw: unknown): NftCollection | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const geckoId = clip(raw, 64).toLowerCase();
    if (!geckoId) return null;
    return { id: "n-" + hash(geckoId), geckoId, name: geckoId, symbol: geckoId.slice(0, 8).toUpperCase() };
  }
  if (typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  let geckoId = clip(o.geckoId || o.slug || o.query, 64).toLowerCase();
  if (!geckoId) {
    const maybe = clip(o.id, 64).toLowerCase();
    if (maybe && !maybe.startsWith("n-")) geckoId = maybe;
  }
  if (!geckoId) return null;
  const name = clip(o.name, 48) || geckoId;
  const symbol = clip(o.symbol, 12).toUpperCase() || name.slice(0, 8).toUpperCase();
  const id = typeof o.id === "string" && o.id.startsWith("n-") ? o.id : "n-" + hash(geckoId);
  return { id, geckoId, name, symbol };
}

export function parseMarket(raw: unknown): MarketPrefs {
  const next: MarketPrefs = { tickers: [], currentId: null, nfts: [], currentNftId: null, marketplaces: [], favoriteTickerIds: [], favoriteNftIds: [] };
  if (!raw || typeof raw !== "object") {
    next.tickers = defaultTickers();
    next.currentId = next.tickers[0]?.id ?? null;
    next.nfts = defaultNfts();
    next.currentNftId = next.nfts[0]?.id ?? null;
    next.marketplaces = defaultMarketplaces();
    return next;
  }
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o.marketTickers) ? o.marketTickers : Array.isArray(o.tickers) ? o.tickers : null;
  if (list && list.length) next.tickers = list.map(parseTicker).filter((t): t is MarketTicker => !!t).slice(0, MAX_TICKERS);
  else if (list && list.length === 0 && (o.marketCustomized || o.tickersCustomized)) next.tickers = [];
  else next.tickers = defaultTickers();
  const want = typeof o.currentTickerId === "string" ? o.currentTickerId : typeof o.currentId === "string" ? o.currentId : null;
  next.currentId = want && next.tickers.some((t) => t.id === want) ? want : next.tickers[0]?.id ?? null;
  const nftList = Array.isArray(o.nftCollections) ? o.nftCollections : Array.isArray(o.nfts) ? o.nfts : null;
  if (nftList && nftList.length) next.nfts = nftList.map(parseNftRow).filter((t): t is NftCollection => !!t).slice(0, MAX_NFTS);
  else if (nftList && nftList.length === 0 && (o.nftCustomized || o.nftsCustomized)) next.nfts = [];
  else next.nfts = defaultNfts();
  const wantNft = typeof o.currentNftId === "string" ? o.currentNftId : null;
  next.currentNftId = wantNft && next.nfts.some((n) => n.id === wantNft) ? wantNft : next.nfts[0]?.id ?? null;
  const mList = Array.isArray(o.nftMarketplaces) ? o.nftMarketplaces : Array.isArray(o.marketplaces) ? o.marketplaces : null;
  if (mList && mList.length) next.marketplaces = mList.map(marketplaceOf).filter((t): t is NftMarketplace => !!t).slice(0, MAX_MARKETS);
  else if (mList && mList.length === 0 && (o.marketplaceCustomized || o.nftMarketplaceCustomized)) next.marketplaces = [];
  else next.marketplaces = defaultMarketplaces();
  const favT = Array.isArray((raw as { favoriteTickerIds?: unknown }).favoriteTickerIds) ? (raw as { favoriteTickerIds: unknown[] }).favoriteTickerIds : [];
  const favN = Array.isArray((raw as { favoriteNftIds?: unknown }).favoriteNftIds) ? (raw as { favoriteNftIds: unknown[] }).favoriteNftIds : [];
  next.favoriteTickerIds = favT.filter((x): x is string => typeof x === "string" && !!x).slice(0, MAX_FAVORITES);
  next.favoriteNftIds = favN.filter((x): x is string => typeof x === "string" && !!x).slice(0, MAX_FAVORITES);
  return next;
}
export function currentTicker(market: MarketPrefs | undefined | null): MarketTicker | null {
  const house = market && market.tickers ? market : parseMarket(market);
  if (!house.tickers.length) return null;
  return house.tickers.find((t) => t.id === house.currentId) || house.tickers[0] || null;
}
export function currentNft(market: MarketPrefs | undefined | null): NftCollection | null {
  const house = market && Array.isArray(market.nfts) ? market : parseMarket(market);
  if (!house.nfts.length) return null;
  return house.nfts.find((n) => n.id === house.currentNftId) || house.nfts[0] || null;
}

export const QUOTE_HOST_NAME = "the quote host";
export const TERMINAL_HOST_NAME = "the terminal host";
export const STOCK_HOST_NAME = "the stock host";

/** A parsed plate already lists tickers. Parsing it again would refill a cleared list. */
function asMarket(market: unknown): MarketPrefs {
  if (market && typeof market === "object" && Array.isArray((market as MarketPrefs).tickers) && Array.isArray((market as MarketPrefs).nfts)) {
    return market as MarketPrefs;
  }
  return parseMarket(market);
}

/** Hosts this quote refresh will actually call. CoinGecko prices and floors share one name. */
export function quoteHostPhrase(market: unknown): string {
  const house = asMarket(market);
  const names: string[] = [];
  const hasQuote = house.tickers.some((row) => row.kind === "crypto" && !!row.geckoId && !row.address) || !!currentNft(house);
  const hasTerminal = house.tickers.some((row) => row.kind === "crypto" && !!row.address);
  const ticker = currentTicker(house);
  const hasStock = !!ticker && ticker.kind === "stock";
  if (hasQuote) names.push(QUOTE_HOST_NAME);
  if (hasTerminal) names.push(TERMINAL_HOST_NAME);
  if (hasStock) names.push(STOCK_HOST_NAME);
  if (!names.length) return "";
  if (names.length === 1) return names[0]!;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function quoteHonesty(market: unknown): string {
  const host = quoteHostPhrase(market);
  if (!host) return "";
  return `this quote sends the saved list. ${clientNetLine(host)}`;
}

/**
 * Quote hosts are called only while the keeper can see that line.
 * A closed plate and a load are not that view. This does not add a tracker.
 */
export function quoteMaySend(market: unknown, lineInView: boolean): boolean {
  const host = quoteHostPhrase(market);
  const line = quoteHonesty(market);
  if (!host || !line || lineInView !== true) return false;
  return line.includes(clientNetLine(host));
}

export const QUOTE_LOOK = `this look-up sends the typed name. ${clientNetLine(QUOTE_HOST_NAME)}`;
export const QUOTE_LEAD = "this quote sends the saved list.";

/** A typed coin or collection look-up uses the quote host. It waits for that line. */
export function quoteLookMaySend(lineInView: boolean): boolean {
  return lineInView === true && QUOTE_LOOK.includes(clientNetLine(QUOTE_HOST_NAME));
}

/**
 * The painted line names this host alone, or inside a combined plate phrase.
 * Same parse as main plate-net `phraseNames`.
 */
export function phraseNames(shown: unknown, hostLabel: string): boolean {
  if (typeof shown !== "string" || !hostLabel) return false;
  if (shown.includes(clientNetLine(hostLabel))) return true;
  const head = "this computer's network address goes with the https request to ";
  const tail = ", as any client.";
  let from = 0;
  while (from < shown.length) {
    const start = shown.indexOf(head, from);
    if (start === -1) return false;
    const end = shown.indexOf(tail, start);
    if (end === -1) return false;
    const phrase = shown.slice(start + head.length, end);
    const parts = phrase.split(/, and |, | and /);
    if (parts.some((part) => part.trim() === hostLabel)) return true;
    from = end + tail.length;
  }
  return false;
}

/**
 * A saved-quote fetch leaves only when the painted line names that host.
 * A missing line, the look-up sentence, and a closed plate do not call fetch.
 */
export function quoteHostMayLeave(shown: unknown, hostLabel: string): boolean {
  if (typeof shown !== "string" || !hostLabel || !shown.includes(QUOTE_LEAD)) return false;
  return phraseNames(shown, hostLabel);
}

/** A typed look-up leaves only when the painted look-up line names the quote host. */
export function lookMayLeave(shown: unknown): boolean {
  return QUOTE_LOOK.length > 0 && typeof shown === "string" && shown.includes(QUOTE_LOOK);
}

type JsonFetch = (url: string, init?: RequestInit) => Promise<{ json: () => Promise<unknown> }>;

/** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
export const QUOTE_TIMEOUT_MS = 12_000;

/** A silent quote host. Callers flip the plate to unread / "can't reach". */
export class QuoteTimeout extends Error {
  constructor() {
    super("quote request timed out");
    this.name = "QuoteTimeout";
  }
}

function isQuoteTimeout(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: string }).name;
  const code = (err as { code?: string }).code;
  return name === "QuoteTimeout" || name === "AbortError" || name === "TimeoutError" || code === "ABORT_ERR";
}

/**
 * One outbound quote JSON read. The timer covers headers and the body.
 * A timeout rejects with QuoteTimeout. The caller does not get a body.
 * A late body after the deadline is not parsed.
 */
function readJson(
  url: string,
  fetchImpl: JsonFetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (typeof fetchImpl !== "function") return Promise.reject(new QuoteTimeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new QuoteTimeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() => fetchImpl(url, { signal: ctrl.signal }))
      .then(async (res) => {
        const json = res && typeof res.json === "function" ? await res.json() : null;
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(json);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (isQuoteTimeout(err)) reject(new QuoteTimeout());
        else reject(err);
      });
  });
}

/** The only CoinGecko many-id fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readGeckoMany(
  shown: unknown,
  ids: string[],
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!quoteHostMayLeave(shown, QUOTE_HOST_NAME)) return Promise.resolve(null);
  const url = geckoManyUrl(ids);
  if (!url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only GeckoTerminal token fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readTerminal(
  shown: unknown,
  platform: string,
  address: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!quoteHostMayLeave(shown, TERMINAL_HOST_NAME)) return Promise.resolve(null);
  const url = terminalTokenUrl(platform, address);
  if (!url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only Yahoo chart fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readYahoo(
  shown: unknown,
  symbol: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!quoteHostMayLeave(shown, STOCK_HOST_NAME)) return Promise.resolve(null);
  const url = yahooUrl(symbol);
  if (!url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only NFT floor fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readNft(
  shown: unknown,
  geckoId: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!quoteHostMayLeave(shown, QUOTE_HOST_NAME)) return Promise.resolve(null);
  const url = nftUrl(geckoId);
  if (!url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}

/** The only typed quote look-up. A miss resolves to null and does not call fetch. A hang rejects. */
export function readQuoteSearch(
  shown: unknown,
  query: string,
  fetchImpl: JsonFetch = fetch,
  timeoutMs: number = QUOTE_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!lookMayLeave(shown)) return Promise.resolve(null);
  const url = searchUrl(query);
  if (!url) return Promise.resolve(null);
  return readJson(url, fetchImpl, timeoutMs);
}
export function addTicker(market: unknown, raw: unknown): MarketPrefs {
  const house = parseMarket(market);
  const next = parseTicker(raw);
  if (!next) return house;
  const exists = house.tickers.findIndex(
    (t) =>
      t.id === next.id ||
      (!!next.address && !!t.address && t.address.toLowerCase() === next.address.toLowerCase() && t.platform === next.platform) ||
      (!!next.geckoId && t.geckoId === next.geckoId) ||
      (t.symbol === next.symbol && t.kind === next.kind && !next.address && !t.address),
  );
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
export function moveTicker(market: unknown, id: string, dir: number): MarketPrefs {
  const house = parseMarket(market);
  const i = house.tickers.findIndex((t) => t.id === id);
  if (i < 0) return house;
  const j = i + (dir < 0 ? -1 : 1);
  if (j < 0 || j >= house.tickers.length) return house;
  const copy = house.tickers.slice();
  const tmp = copy[i]!;
  copy[i] = copy[j]!;
  copy[j] = tmp;
  house.tickers = copy;
  return house;
}
export function addNft(market: unknown, raw: unknown): MarketPrefs {
  const house = parseMarket(market);
  const next = parseNftRow(raw);
  if (!next) return house;
  const exists = house.nfts.findIndex((n) => n.id === next.id || n.geckoId === next.geckoId);
  if (exists >= 0) house.nfts[exists] = { ...house.nfts[exists]!, ...next };
  else house.nfts = [...house.nfts, next].slice(0, MAX_NFTS);
  house.currentNftId = next.id;
  return house;
}
export function removeNft(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  house.nfts = house.nfts.filter((n) => n.id !== id);
  if (house.currentNftId === id) house.currentNftId = house.nfts[0]?.id ?? null;
  return house;
}
export function pickNft(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  if (house.nfts.some((n) => n.id === id)) house.currentNftId = id;
  return house;
}
export function moveNft(market: unknown, id: string, dir: number): MarketPrefs {
  const house = parseMarket(market);
  const i = house.nfts.findIndex((n) => n.id === id);
  if (i < 0) return house;
  const j = i + (dir < 0 ? -1 : 1);
  if (j < 0 || j >= house.nfts.length) return house;
  const copy = house.nfts.slice();
  const tmp = copy[i]!;
  copy[i] = copy[j]!;
  copy[j] = tmp;
  house.nfts = copy;
  return house;
}
export function addMarketplace(market: unknown, raw: unknown): MarketPrefs {
  const house = parseMarket(market);
  const next = marketplaceOf(raw);
  if (!next) return house;
  const exists = house.marketplaces.findIndex((m) => m.id === next.id);
  if (exists >= 0) house.marketplaces[exists] = { ...house.marketplaces[exists]!, ...next };
  else house.marketplaces = [...house.marketplaces, next].slice(0, MAX_MARKETS);
  return house;
}
export function removeMarketplace(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  house.marketplaces = house.marketplaces.filter((m) => m.id !== id);
  return house;
}
export function moveMarketplace(market: unknown, id: string, dir: number): MarketPrefs {
  const house = parseMarket(market);
  const i = house.marketplaces.findIndex((m) => m.id === id);
  if (i < 0) return house;
  const j = i + (dir < 0 ? -1 : 1);
  if (j < 0 || j >= house.marketplaces.length) return house;
  const copy = house.marketplaces.slice();
  const tmp = copy[i]!;
  copy[i] = copy[j]!;
  copy[j] = tmp;
  house.marketplaces = copy;
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
export function geckoManyUrl(ids: string[]) {
  const list = (Array.isArray(ids) ? ids : []).map((id) => clip(id, 64).toLowerCase()).filter(Boolean);
  const uniq = Array.from(new Set(list)).slice(0, MAX_TICKERS);
  if (!uniq.length) return "";
  return `https://${COINGECKO_HOST}/api/v3/simple/price?ids=${encodeURIComponent(uniq.join(","))}&vs_currencies=usd&include_24hr_change=true`;
}
export function searchUrl(query: string) {
  const q = clip(query, 48);
  if (!q) return "";
  return `https://${COINGECKO_HOST}/api/v3/search?query=${encodeURIComponent(q)}`;
}
export function nftUrl(id: string) {
  const q = clip(id, 64).toLowerCase();
  if (!q) return "";
  return `https://${COINGECKO_HOST}/api/v3/nfts/${encodeURIComponent(q)}`;
}
export function terminalTokenUrl(platform: string, address: string) {
  const net = clip(platform, 16).toLowerCase() || "solana";
  const addr = clip(address, 64);
  if (!addr) return "";
  const network = net === "eth" || net === "ethereum" ? "eth" : net === "sol" ? "solana" : net;
  return `https://${GECKO_TERMINAL_HOST}/api/v2/networks/${encodeURIComponent(network)}/tokens/${encodeURIComponent(addr)}`;
}
export function terminalPriceUrl(platform: string, address: string) {
  const net = clip(platform, 16).toLowerCase() || "solana";
  const addr = clip(address, 64);
  if (!addr) return "";
  const network = net === "eth" || net === "ethereum" ? "eth" : net === "sol" ? "solana" : net;
  return `https://${GECKO_TERMINAL_HOST}/api/v2/simple/networks/${encodeURIComponent(network)}/token_price/${encodeURIComponent(addr)}`;
}
export function parseYahoo(json: unknown): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const chart = (json as { chart?: { result?: unknown } }).chart;
  const result = chart && Array.isArray(chart.result) ? chart.result[0] : null;
  if (!result || typeof result !== "object") return null;
  const meta = (result as { meta?: Record<string, unknown> }).meta || {};
  const price = Number(meta.regularMarketPrice);
  if (!Number.isFinite(price)) return null;
  return { price, name: clip(meta.shortName || meta.symbol, 32) || "stock", currency: clip(meta.currency, 8) || "USD", source: "yahoo", change24h: null };
}
export function parseGecko(json: unknown, id: string): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const row = (json as Record<string, { usd?: unknown; usd_24h_change?: unknown }>)[id];
  if (!row || typeof row !== "object") return null;
  const price = Number(row.usd);
  if (!Number.isFinite(price)) return null;
  const change = Number(row.usd_24h_change);
  return { price, name: id, currency: "USD", source: "coingecko", change24h: Number.isFinite(change) ? change : null };
}
export function parseGeckoMany(json: unknown): Record<string, MarketLive> {
  if (!json || typeof json !== "object") return {};
  const out: Record<string, MarketLive> = {};
  for (const id of Object.keys(json as object)) {
    const live = parseGecko(json, id);
    if (live) out[id] = live;
  }
  return out;
}
export function parseTerminalToken(json: unknown): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const root = json as { data?: Record<string, unknown> };
  const data = root.data && typeof root.data === "object" ? root.data : (json as Record<string, unknown>);
  const attrs = data.attributes && typeof data.attributes === "object" ? (data.attributes as Record<string, unknown>) : data;
  const price = Number(attrs.price_usd);
  if (!Number.isFinite(price)) return null;
  const symbol = clip(attrs.symbol, 12).toUpperCase() || "TOKEN";
  const name = clip(attrs.name, 32) || symbol;
  const pctObj = attrs.price_percent_change;
  const pct = pctObj && typeof pctObj === "object" ? Number((pctObj as { h24?: unknown }).h24) : NaN;
  return { price, name, symbol, currency: "USD", source: "geckoterminal", change24h: Number.isFinite(pct) ? pct : null, address: clip(attrs.address, 64) || "" };
}
export function parseTerminalPrice(json: unknown, address: string): MarketLive | null {
  if (!json || typeof json !== "object") return null;
  const root = json as { data?: Record<string, unknown> };
  const data = root.data && typeof root.data === "object" ? root.data : (json as Record<string, unknown>);
  const attrs = data.attributes && typeof data.attributes === "object" ? (data.attributes as Record<string, unknown>) : data;
  const prices = attrs.token_prices && typeof attrs.token_prices === "object" ? (attrs.token_prices as Record<string, unknown>) : attrs;
  const key = Object.keys(prices).find((k) => k.toLowerCase() === String(address || "").toLowerCase()) || Object.keys(prices)[0];
  if (!key) return null;
  const price = Number(prices[key]);
  if (!Number.isFinite(price)) return null;
  return { price, name: key.slice(0, 8), currency: "USD", source: "geckoterminal", change24h: null, address: key };
}

/** Prefer exact symbol/geckoId match from CoinGecko search hits for free-typed add. */
export function pickBestSearchCoin(coins: MarketTicker[] | null | undefined, query: unknown): MarketTicker | null {
  const list = (Array.isArray(coins) ? coins : []).filter(Boolean);
  if (!list.length) return null;
  const typed = clip(query, 48);
  const upper = typed.toUpperCase();
  const lower = typed.toLowerCase();
  const exactSym = list.find((c) => c.symbol && String(c.symbol).toUpperCase() === upper);
  if (exactSym) return exactSym;
  const exactId = list.find((c) => c.geckoId && String(c.geckoId).toLowerCase() === lower);
  if (exactId) return exactId;
  const starts = list.find((c) => c.symbol && String(c.symbol).toUpperCase().indexOf(upper) === 0);
  if (starts) return starts;
  return list[0] || null;
}

export function parseSearchCoins(json: unknown): MarketTicker[] {
  if (!json || typeof json !== "object") return [];
  const coins = Array.isArray((json as { coins?: unknown }).coins) ? ((json as { coins: unknown[] }).coins) : [];
  return coins
    .slice(0, 8)
    .map((c) => {
      if (!c || typeof c !== "object") return null;
      const row = c as Record<string, unknown>;
      const geckoId = clip(row.id, 64).toLowerCase();
      if (!geckoId) return null;
      const symbol = clip(row.symbol, 12).toUpperCase() || geckoId.slice(0, 8).toUpperCase();
      return parseTicker({ symbol, kind: "crypto", geckoId, name: clip(row.name, 32) || symbol });
    })
    .filter((t): t is MarketTicker => !!t);
}
export function parseSearchNfts(json: unknown): NftCollection[] {
  if (!json || typeof json !== "object") return [];
  const nfts = Array.isArray((json as { nfts?: unknown }).nfts) ? ((json as { nfts: unknown[] }).nfts) : [];
  return nfts
    .slice(0, 8)
    .map((n) => {
      if (!n || typeof n !== "object") return null;
      const row = n as Record<string, unknown>;
      return parseNftRow({ geckoId: row.id, name: row.name, symbol: row.symbol });
    })
    .filter((t): t is NftCollection => !!t);
}
export function parseNftLive(json: unknown): NftLive | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const geckoId = clip(o.id, 64).toLowerCase();
  if (!geckoId) return null;
  const floor = o.floor_price && typeof o.floor_price === "object" ? (o.floor_price as Record<string, unknown>) : {};
  const usd = Number(floor.usd);
  const native = Number(floor.native_currency);
  const floorUsd = Number.isFinite(usd) ? usd : null;
  const floorNative = Number.isFinite(native) ? native : null;
  if (floorUsd == null && floorNative == null) return null;
  return {
    geckoId,
    name: clip(o.name, 48) || geckoId,
    symbol: clip(o.symbol, 12).toUpperCase() || "",
    floorUsd,
    floorNative,
    nativeSymbol: clip(o.native_currency_symbol || o.native_currency, 8) || "ETH",
    source: "coingecko",
  };
}
export function formatPrice(price: number) {
  if (!Number.isFinite(price)) return "—";
  if (price >= 100) return price.toFixed(2);
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  return Number(price).toPrecision(3);
}
export function plateLine(market: MarketPrefs | undefined, live: MarketLive | null | undefined, unread = false, waiting = false) {
  const house = market && market.tickers ? market : parseMarket(market);
  const ticker = currentTicker(house);
  if (!ticker) {
    const nft = currentNft(house);
    if (nft) return nft.symbol || nft.name;
    return NO_QUOTE;
  }
  if (unread && !live) return `${ticker.symbol} · ${CANT_REACH}`;
  if (!live && waiting) return `${ticker.symbol} · ${QUOTE_WAITS}`;
  if (!live) return `${ticker.symbol} · looking up`;
  return `${ticker.symbol} · ${formatPrice(live.price)}`;
}
export function nftLine(market: MarketPrefs | undefined, live: NftLive | null | undefined, unread = false) {
  const nft = currentNft(market);
  if (!nft) return NO_NFT;
  if (unread && !live) return `${nft.symbol || nft.name} · ${CANT_REACH}`;
  if (!live) return `${nft.symbol || nft.name} · looking up`;
  if (live.floorUsd != null) return `${nft.symbol || nft.name} · $${formatPrice(live.floorUsd)}`;
  if (live.floorNative != null) return `${nft.symbol || nft.name} · ${formatPrice(live.floorNative)} ${live.nativeSymbol || ""}`;
  return nft.symbol || nft.name;
}

export function toggleFavoriteTicker(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  if (!id || !house.tickers.some((row) => row.id === id)) return house;
  if (house.favoriteTickerIds.includes(id)) house.favoriteTickerIds = house.favoriteTickerIds.filter((x) => x !== id);
  else house.favoriteTickerIds = [...house.favoriteTickerIds, id].slice(0, MAX_FAVORITES);
  return house;
}

export function toggleFavoriteNft(market: unknown, id: string): MarketPrefs {
  const house = parseMarket(market);
  if (!id || !house.nfts.some((row) => row.id === id)) return house;
  if (house.favoriteNftIds.includes(id)) house.favoriteNftIds = house.favoriteNftIds.filter((x) => x !== id);
  else house.favoriteNftIds = [...house.favoriteNftIds, id].slice(0, MAX_FAVORITES);
  return house;
}

export function isFavoriteTicker(market: unknown, id: string) {
  return parseMarket(market).favoriteTickerIds.includes(id);
}

export function isFavoriteNft(market: unknown, id: string) {
  return parseMarket(market).favoriteNftIds.includes(id);
}

export function favoriteRows(market: unknown) {
  const house = parseMarket(market);
  return {
    tickers: house.favoriteTickerIds.map((id) => house.tickers.find((row) => row.id === id)).filter((x): x is MarketTicker => !!x),
    nfts: house.favoriteNftIds.map((id) => house.nfts.find((row) => row.id === id)).filter((x): x is NftCollection => !!x),
  };
}

export function toCardPatch(house: MarketPrefs | unknown) {
  const parsed = house && typeof house === "object" && Array.isArray((house as MarketPrefs).tickers) ? (house as MarketPrefs) : parseMarket(house);
  return {
    marketTickers: parsed.tickers,
    currentTickerId: parsed.currentId,
    nftCollections: parsed.nfts,
    currentNftId: parsed.currentNftId,
    nftMarketplaces: parsed.marketplaces,
    favoriteTickerIds: parsed.favoriteTickerIds || [],
    favoriteNftIds: parsed.favoriteNftIds || [],
    marketCustomized: true,
    nftCustomized: true,
    marketplaceCustomized: true,
  };
}
