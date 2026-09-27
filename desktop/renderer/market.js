/** Desk quotes. Coins (majors + pump.fun-style contract paste) + NFT collections/marketplaces. A quote waits until the open quotes plate shows the line that names the website (Google News, Wikipedia, CoinGecko, GeckoTerminal, Yahoo Finance) and says this computer's internet address goes there too. CoinGecko, GeckoTerminal, Yahoo, and a typed look-up also refuse inside the read wrappers when that painted line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can flip to unread / "can't reach". A late body is not parsed. No invented key. */
(function (root) {
  const MARKET_LABEL = "Quotes";
  const COIN_LABEL = "Coins";
  const NFT_LABEL = "NFTs";
  const MARKET_PLACEHOLDER = "A coin or stock — ETH, BTC, AAPL, or a coin's address";
  const NFT_PLACEHOLDER = "NFT collection — pudgy, punks";
  const MARKET_TRUTH = "Big coins and search come from CoinGecko. A small coin you add by its address comes from GeckoTerminal. Stocks come from Yahoo Finance. All free, no paid account.";
  const NFT_TRUTH = "Collection floor prices come from CoinGecko when it answers. Your marketplaces (OpenSea, Blur, Magic Eden, Rarible, Robinhood NFT) are links; one that needs a paid account says so instead of showing a price.";
  const YAHOO_HOST = "query1.finance.yahoo.com";
  const COINGECKO_HOST = "api.coingecko.com";
  const GECKO_TERMINAL_HOST = "api.geckoterminal.com";
  const CANT_REACH = "can't reach";
  const NO_QUOTE = "no quote yet";
  /** The closed plate's header before the first price: prices are read only while the plate is open. */
  const QUOTE_WAITS = "open to see the price";
  const NO_NFT = "no NFT yet";
  const MAX_TICKERS = 24;
  const MAX_NFTS = 8;
  const MAX_MARKETS = 8;

  const CRYPTO = {
    BTC: "bitcoin",
    ETH: "ethereum",
    DOGE: "dogecoin",
    XLM: "stellar",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
    AVAX: "avalanche-2",
    DOT: "polkadot",
    LINK: "chainlink",
    BNB: "binancecoin",
    MATIC: "matic-network",
    POL: "polygon-ecosystem-token",
  };

  const DEFAULT_CRYPTO = [
    { symbol: "ETH", geckoId: "ethereum", name: "Ethereum" },
    { symbol: "DOGE", geckoId: "dogecoin", name: "Dogecoin" },
    { symbol: "XLM", geckoId: "stellar", name: "Stellar" },
    { symbol: "BTC", geckoId: "bitcoin", name: "Bitcoin" },
    { symbol: "SOL", geckoId: "solana", name: "Solana" },
    { symbol: "ADA", geckoId: "cardano", name: "Cardano" },
    { symbol: "XRP", geckoId: "ripple", name: "XRP" },
  ];

  const DEFAULT_NFTS = [
    { geckoId: "cryptopunks", name: "CryptoPunks", symbol: "PUNK" },
    { geckoId: "bored-ape-yacht-club", name: "Bored Ape Yacht Club", symbol: "BAYC" },
    { geckoId: "pudgy-penguins", name: "Pudgy Penguins", symbol: "PPG" },
  ];

  /** Major NFT venues users can keep on their list. Public floor feeds often need a key — UI stays, prices stay honest. */
  const NFT_MARKETPLACES = [
    { id: "opensea", name: "OpenSea", url: "https://opensea.io", note: "needs a paid account for live prices" },
    { id: "blur", name: "Blur", url: "https://blur.io", note: "needs a paid account for live prices" },
    { id: "magiceden", name: "Magic Eden", url: "https://magiceden.io", note: "needs a paid account for live prices" },
    { id: "rarible", name: "Rarible", url: "https://rarible.com", note: "needs a paid account for live prices" },
    { id: "robinhood-nft", name: "Robinhood NFT", url: "https://robinhood.com/us/en/support/articles/robinhood-nft/", note: "does not share prices publicly" },
  ];

  const DEFAULT_MARKETPLACES = ["opensea", "blur", "magiceden", "rarible", "robinhood-nft"];

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

  const FAVORITES_EMPTY = "Nothing saved yet. Tap ☆ next to a coin or NFT to keep it here.";
  // PRICE_LOOKING: a price the open plate asked for is on its way. SEARCHING: a coin or collection search is.
  const PRICE_LOOKING = "getting the price…";
  const SEARCHING = "searching…";
  const MAX_FAVORITES = 24;

  function blankMarket() {
    return {
      tickers: defaultTickers(),
      currentId: null,
      nfts: defaultNfts(),
      currentNftId: null,
      marketplaces: defaultMarketplaces(),
      favoriteTickerIds: [],
      favoriteNftIds: [],
    };
  }

  function defaultTickers() {
    return DEFAULT_CRYPTO.map((row) => parseTicker({ ...row, kind: "crypto" })).filter(Boolean);
  }

  function defaultNfts() {
    return DEFAULT_NFTS.map(parseNftRow).filter(Boolean);
  }

  function defaultMarketplaces() {
    return DEFAULT_MARKETPLACES.map(marketplaceOf).filter(Boolean);
  }

  function marketplaceOf(idOrRow) {
    if (!idOrRow) return null;
    if (typeof idOrRow === "string") {
      const known = NFT_MARKETPLACES.find((m) => m.id === idOrRow);
      return known ? { ...known } : { id: clip(idOrRow, 32).toLowerCase(), name: clip(idOrRow, 32), url: "", note: "your own market" };
    }
    if (typeof idOrRow !== "object") return null;
    const id = clip(idOrRow.id, 32).toLowerCase();
    if (!id) return null;
    const known = NFT_MARKETPLACES.find((m) => m.id === id);
    return {
      id,
      name: clip(idOrRow.name, 32) || (known && known.name) || id,
      url: clip(idOrRow.url, 120) || (known && known.url) || "",
      note: clip(idOrRow.note, 64) || (known && known.note) || "your own market",
    };
  }

  function detectContract(raw) {
    const typed = String(raw || "").trim();
    if (!typed) return null;
    if (/^0x[a-fA-F0-9]{40}$/.test(typed)) return { platform: "eth", address: typed.toLowerCase() };
    // Solana mint / pump.fun style base58 (32–44 chars, no 0OIl)
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(typed)) return { platform: "solana", address: typed };
    return null;
  }

  function classify(raw) {
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
    if (CRYPTO[upper]) return { symbol: upper, kind: "crypto", geckoId: CRYPTO[upper], name: upper, platform: "", address: "" };
    const gecko = Object.keys(CRYPTO).find((k) => CRYPTO[k] === lower);
    if (gecko) return { symbol: gecko, kind: "crypto", geckoId: lower, name: gecko, platform: "", address: "" };
    if (/^[A-Za-z][A-Za-z0-9.-]{0,11}$/.test(typed)) return { symbol: upper, kind: "stock", geckoId: "", name: upper, platform: "", address: "" };
    return null;
  }

  function parseTicker(raw) {
    if (!raw || typeof raw !== "object") {
      const classified = classify(raw);
      if (!classified) return null;
      const idKey = classified.address ? classified.platform + ":" + classified.address : classified.symbol + ":" + (classified.geckoId || "");
      return { id: "m-" + hash(idKey), ...classified };
    }
    const explicitAddr = clip(raw.address, 64);
    const explicitPlatform = clip(raw.platform, 16).toLowerCase();
    const contract = explicitAddr ? detectContract(explicitAddr) || (explicitPlatform ? { platform: explicitPlatform, address: explicitAddr } : null) : detectContract(raw.symbol || raw.query || "");
    const explicitGecko = clip(raw.geckoId, 64).toLowerCase();
    if (contract && contract.address) {
      const platform = contract.platform || explicitPlatform || "solana";
      const address = contract.address;
      const short = address.slice(0, 4) + address.slice(-4);
      const symbol = clip(raw.symbol, 12).toUpperCase() || short.toUpperCase();
      const id = typeof raw.id === "string" && raw.id ? raw.id : "m-" + hash(platform + ":" + address);
      return {
        id,
        symbol,
        kind: "crypto",
        geckoId: explicitGecko || "",
        name: clip(raw.name, 32) || symbol,
        platform,
        address,
      };
    }
    const wantCrypto = raw.kind === "crypto" || !!explicitGecko;
    if (wantCrypto && explicitGecko) {
      const symbol = clip(raw.symbol || raw.name || explicitGecko, 12).toUpperCase() || explicitGecko.toUpperCase().slice(0, 8);
      const id = typeof raw.id === "string" && raw.id ? raw.id : "m-" + hash(symbol + ":" + explicitGecko);
      return { id, symbol, kind: "crypto", geckoId: explicitGecko, name: clip(raw.name, 32) || symbol, platform: "", address: "" };
    }
    const classified = classify(raw.symbol || raw.name || raw.query);
    if (!classified) return null;
    const id = typeof raw.id === "string" && raw.id ? raw.id : "m-" + hash(classified.symbol + ":" + (classified.geckoId || classified.address || ""));
    const kind = raw.kind === "stock" || raw.kind === "crypto" ? raw.kind : wantCrypto ? "crypto" : classified.kind;
    return {
      id,
      symbol: classified.symbol,
      kind,
      geckoId: kind === "crypto" ? classified.geckoId || explicitGecko || "" : "",
      name: clip(raw.name, 32) || classified.name,
      platform: classified.platform || "",
      address: classified.address || "",
    };
  }

  function parseNftRow(raw) {
    if (!raw) return null;
    if (typeof raw === "string") {
      const geckoId = clip(raw, 64).toLowerCase();
      if (!geckoId) return null;
      return { id: "n-" + hash(geckoId), geckoId, name: geckoId, symbol: geckoId.slice(0, 8).toUpperCase() };
    }
    if (typeof raw !== "object") return null;
    let geckoId = clip(raw.geckoId || raw.slug || raw.query, 64).toLowerCase();
    if (!geckoId) {
      const maybe = clip(raw.id, 64).toLowerCase();
      if (maybe && maybe.indexOf("n-") !== 0) geckoId = maybe;
    }
    if (!geckoId) return null;
    const name = clip(raw.name, 48) || geckoId;
    const symbol = clip(raw.symbol, 12).toUpperCase() || name.slice(0, 8).toUpperCase();
    const id = typeof raw.id === "string" && raw.id.indexOf("n-") === 0 ? raw.id : "n-" + hash(geckoId);
    return { id, geckoId, name, symbol };
  }

  function parseMarket(raw) {
    const next = { tickers: [], currentId: null, nfts: [], currentNftId: null, marketplaces: [], favoriteTickerIds: [], favoriteNftIds: [] };
    if (!raw || typeof raw !== "object") {
      next.tickers = defaultTickers();
      next.currentId = next.tickers[0] ? next.tickers[0].id : null;
      next.nfts = defaultNfts();
      next.currentNftId = next.nfts[0] ? next.nfts[0].id : null;
      next.marketplaces = defaultMarketplaces();
      return next;
    }
    const list = Array.isArray(raw.marketTickers) ? raw.marketTickers : Array.isArray(raw.tickers) ? raw.tickers : null;
    if (list && list.length) next.tickers = list.map(parseTicker).filter(Boolean).slice(0, MAX_TICKERS);
    else if (list && list.length === 0 && (raw.marketCustomized || raw.tickersCustomized)) next.tickers = [];
    else next.tickers = defaultTickers();
    const want = typeof raw.currentTickerId === "string" ? raw.currentTickerId : typeof raw.currentId === "string" ? raw.currentId : null;
    next.currentId = want && next.tickers.some((t) => t.id === want) ? want : next.tickers[0] ? next.tickers[0].id : null;

    const nftList = Array.isArray(raw.nftCollections) ? raw.nftCollections : Array.isArray(raw.nfts) ? raw.nfts : null;
    if (nftList && nftList.length) next.nfts = nftList.map(parseNftRow).filter(Boolean).slice(0, MAX_NFTS);
    else if (nftList && nftList.length === 0 && (raw.nftCustomized || raw.nftsCustomized)) next.nfts = [];
    else next.nfts = defaultNfts();
    const wantNft = typeof raw.currentNftId === "string" ? raw.currentNftId : null;
    next.currentNftId = wantNft && next.nfts.some((n) => n.id === wantNft) ? wantNft : next.nfts[0] ? next.nfts[0].id : null;

    const mList = Array.isArray(raw.nftMarketplaces) ? raw.nftMarketplaces : Array.isArray(raw.marketplaces) ? raw.marketplaces : null;
    if (mList && mList.length) next.marketplaces = mList.map(marketplaceOf).filter(Boolean).slice(0, MAX_MARKETS);
    else if (mList && mList.length === 0 && (raw.marketplaceCustomized || raw.nftMarketplaceCustomized)) next.marketplaces = [];
    else next.marketplaces = defaultMarketplaces();
    const favT = Array.isArray(raw.favoriteTickerIds) ? raw.favoriteTickerIds : Array.isArray(raw.favTickers) ? raw.favTickers : [];
    const favN = Array.isArray(raw.favoriteNftIds) ? raw.favoriteNftIds : Array.isArray(raw.favNfts) ? raw.favNfts : [];
    next.favoriteTickerIds = favT.filter((x) => typeof x === "string" && x).slice(0, MAX_FAVORITES);
    next.favoriteNftIds = favN.filter((x) => typeof x === "string" && x).slice(0, MAX_FAVORITES);
    return next;
  }

  function currentTicker(market) {
    const house = market && market.tickers ? market : parseMarket(market);
    if (!house.tickers.length) return null;
    return house.tickers.find((t) => t.id === house.currentId) || house.tickers[0] || null;
  }

  function currentNft(market) {
    const house = market && Array.isArray(market.nfts) ? market : parseMarket(market);
    if (!house.nfts.length) return null;
    return house.nfts.find((n) => n.id === house.currentNftId) || house.nfts[0] || null;
  }

  function addTicker(market, raw) {
    const house = parseMarket(market);
    const next = parseTicker(raw);
    if (!next) return house;
    const exists = house.tickers.findIndex(
      (t) =>
        t.id === next.id ||
        (next.address && t.address && t.address.toLowerCase() === next.address.toLowerCase() && t.platform === next.platform) ||
        (next.geckoId && t.geckoId === next.geckoId) ||
        (t.symbol === next.symbol && t.kind === next.kind && !next.address && !t.address),
    );
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

  function moveTicker(market, id, dir) {
    const house = parseMarket(market);
    const i = house.tickers.findIndex((t) => t.id === id);
    if (i < 0) return house;
    const j = i + (dir < 0 ? -1 : 1);
    if (j < 0 || j >= house.tickers.length) return house;
    const copy = house.tickers.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    house.tickers = copy;
    return house;
  }

  function addNft(market, raw) {
    const house = parseMarket(market);
    const next = parseNftRow(raw);
    if (!next) return house;
    const exists = house.nfts.findIndex((n) => n.id === next.id || n.geckoId === next.geckoId);
    if (exists >= 0) house.nfts[exists] = { ...house.nfts[exists], ...next };
    else house.nfts = house.nfts.concat(next).slice(0, MAX_NFTS);
    house.currentNftId = next.id;
    return house;
  }

  function removeNft(market, id) {
    const house = parseMarket(market);
    house.nfts = house.nfts.filter((n) => n.id !== id);
    if (house.currentNftId === id) house.currentNftId = house.nfts[0] ? house.nfts[0].id : null;
    return house;
  }

  function pickNft(market, id) {
    const house = parseMarket(market);
    if (house.nfts.some((n) => n.id === id)) house.currentNftId = id;
    return house;
  }

  function moveNft(market, id, dir) {
    const house = parseMarket(market);
    const i = house.nfts.findIndex((n) => n.id === id);
    if (i < 0) return house;
    const j = i + (dir < 0 ? -1 : 1);
    if (j < 0 || j >= house.nfts.length) return house;
    const copy = house.nfts.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    house.nfts = copy;
    return house;
  }

  function addMarketplace(market, raw) {
    const house = parseMarket(market);
    const next = marketplaceOf(raw);
    if (!next) return house;
    const exists = house.marketplaces.findIndex((m) => m.id === next.id);
    if (exists >= 0) house.marketplaces[exists] = { ...house.marketplaces[exists], ...next };
    else house.marketplaces = house.marketplaces.concat(next).slice(0, MAX_MARKETS);
    return house;
  }

  function removeMarketplace(market, id) {
    const house = parseMarket(market);
    house.marketplaces = house.marketplaces.filter((m) => m.id !== id);
    return house;
  }

  function moveMarketplace(market, id, dir) {
    const house = parseMarket(market);
    const i = house.marketplaces.findIndex((m) => m.id === id);
    if (i < 0) return house;
    const j = i + (dir < 0 ? -1 : 1);
    if (j < 0 || j >= house.marketplaces.length) return house;
    const copy = house.marketplaces.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    house.marketplaces = copy;
    return house;
  }

  function yahooUrl(symbol) {
    const s = clip(symbol, 12).toUpperCase();
    if (!s) return "";
    return "https://" + YAHOO_HOST + "/v8/finance/chart/" + encodeURIComponent(s);
  }

  function geckoUrl(id) {
    const q = clip(id, 32).toLowerCase();
    if (!q) return "";
    return "https://" + COINGECKO_HOST + "/api/v3/simple/price?ids=" + encodeURIComponent(q) + "&vs_currencies=usd";
  }

  function geckoManyUrl(ids) {
    const list = (Array.isArray(ids) ? ids : []).map((id) => clip(id, 64).toLowerCase()).filter(Boolean);
    const uniq = Array.from(new Set(list)).slice(0, MAX_TICKERS);
    if (!uniq.length) return "";
    return "https://" + COINGECKO_HOST + "/api/v3/simple/price?ids=" + encodeURIComponent(uniq.join(",")) + "&vs_currencies=usd&include_24hr_change=true";
  }

  function searchUrl(query) {
    const q = clip(query, 48);
    if (!q) return "";
    return "https://" + COINGECKO_HOST + "/api/v3/search?query=" + encodeURIComponent(q);
  }

  function nftUrl(id) {
    const q = clip(id, 64).toLowerCase();
    if (!q) return "";
    return "https://" + COINGECKO_HOST + "/api/v3/nfts/" + encodeURIComponent(q);
  }

  function terminalTokenUrl(platform, address) {
    const net = clip(platform, 16).toLowerCase() || "solana";
    const addr = clip(address, 64);
    if (!addr) return "";
    const network = net === "eth" || net === "ethereum" ? "eth" : net === "sol" ? "solana" : net;
    return "https://" + GECKO_TERMINAL_HOST + "/api/v2/networks/" + encodeURIComponent(network) + "/tokens/" + encodeURIComponent(addr);
  }

  function terminalPriceUrl(platform, address) {
    const net = clip(platform, 16).toLowerCase() || "solana";
    const addr = clip(address, 64);
    if (!addr) return "";
    const network = net === "eth" || net === "ethereum" ? "eth" : net === "sol" ? "solana" : net;
    return "https://" + GECKO_TERMINAL_HOST + "/api/v2/simple/networks/" + encodeURIComponent(network) + "/token_price/" + encodeURIComponent(addr);
  }

  function parseYahoo(json) {
    if (!json || typeof json !== "object" || !json.chart || typeof json.chart !== "object") return null;
    const result = Array.isArray(json.chart.result) ? json.chart.result[0] : null;
    if (!result || typeof result !== "object") return null;
    const meta = result.meta && typeof result.meta === "object" ? result.meta : {};
    const price = Number(meta.regularMarketPrice);
    if (!Number.isFinite(price)) return null;
    return { price, name: clip(meta.shortName || meta.symbol, 32) || "stock", currency: clip(meta.currency, 8) || "USD", source: "yahoo", change24h: null };
  }

  function parseGecko(json, id) {
    if (!json || typeof json !== "object") return null;
    const row = json[id];
    if (!row || typeof row !== "object") return null;
    const price = Number(row.usd);
    if (!Number.isFinite(price)) return null;
    const change = Number(row.usd_24h_change);
    return { price, name: id, currency: "USD", source: "coingecko", change24h: Number.isFinite(change) ? change : null };
  }

  function parseGeckoMany(json) {
    if (!json || typeof json !== "object") return {};
    const out = {};
    for (const id of Object.keys(json)) {
      const live = parseGecko(json, id);
      if (live) out[id] = live;
    }
    return out;
  }

  function parseTerminalToken(json) {
    if (!json || typeof json !== "object") return null;
    const data = json.data && typeof json.data === "object" ? json.data : json;
    const attrs = data.attributes && typeof data.attributes === "object" ? data.attributes : data;
    if (!attrs || typeof attrs !== "object") return null;
    const price = Number(attrs.price_usd);
    if (!Number.isFinite(price)) return null;
    const symbol = clip(attrs.symbol, 12).toUpperCase() || "TOKEN";
    const name = clip(attrs.name, 32) || symbol;
    const change = Number(attrs.price_percent_change && attrs.price_percent_change.h24);
    return {
      price,
      name,
      symbol,
      currency: "USD",
      source: "geckoterminal",
      change24h: Number.isFinite(change) ? change : null,
      address: clip(attrs.address, 64) || "",
    };
  }

  function parseTerminalPrice(json, address) {
    if (!json || typeof json !== "object") return null;
    const data = json.data && typeof json.data === "object" ? json.data : json;
    const attrs = data.attributes && typeof data.attributes === "object" ? data.attributes : data;
    const prices = attrs && attrs.token_prices && typeof attrs.token_prices === "object" ? attrs.token_prices : attrs;
    if (!prices || typeof prices !== "object") return null;
    const key = Object.keys(prices).find((k) => k.toLowerCase() === String(address || "").toLowerCase()) || Object.keys(prices)[0];
    if (!key) return null;
    const price = Number(prices[key]);
    if (!Number.isFinite(price)) return null;
    return { price, name: key.slice(0, 8), currency: "USD", source: "geckoterminal", change24h: null, address: key };
  }


  /** Prefer exact symbol/geckoId match from CoinGecko search hits for free-typed add. */
  function pickBestSearchCoin(coins, query) {
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
    return list[0];
  }

  function parseSearchCoins(json) {
    if (!json || typeof json !== "object") return [];
    const coins = Array.isArray(json.coins) ? json.coins : [];
    return coins
      .slice(0, 8)
      .map((c) => {
        if (!c || typeof c !== "object") return null;
        const geckoId = clip(c.id, 64).toLowerCase();
        if (!geckoId) return null;
        const symbol = clip(c.symbol, 12).toUpperCase() || geckoId.slice(0, 8).toUpperCase();
        return parseTicker({ symbol, kind: "crypto", geckoId, name: clip(c.name, 32) || symbol });
      })
      .filter(Boolean);
  }

  function parseSearchNfts(json) {
    if (!json || typeof json !== "object") return [];
    const nfts = Array.isArray(json.nfts) ? json.nfts : [];
    return nfts
      .slice(0, 8)
      .map((n) => {
        if (!n || typeof n !== "object") return null;
        return parseNftRow({ geckoId: n.id, name: n.name, symbol: n.symbol });
      })
      .filter(Boolean);
  }

  function parseNftLive(json) {
    if (!json || typeof json !== "object") return null;
    const geckoId = clip(json.id, 64).toLowerCase();
    if (!geckoId) return null;
    const floor = json.floor_price && typeof json.floor_price === "object" ? json.floor_price : {};
    const usd = Number(floor.usd);
    const native = Number(floor.native_currency);
    const floorUsd = Number.isFinite(usd) ? usd : null;
    const floorNative = Number.isFinite(native) ? native : null;
    if (floorUsd == null && floorNative == null) return null;
    return {
      geckoId,
      name: clip(json.name, 48) || geckoId,
      symbol: clip(json.symbol, 12).toUpperCase() || "",
      floorUsd,
      floorNative,
      nativeSymbol: clip(json.native_currency_symbol || json.native_currency, 8) || "ETH",
      source: "coingecko",
    };
  }

  function formatPrice(price) {
    if (!Number.isFinite(price)) return "—";
    if (price >= 100) return price.toFixed(2);
    if (price >= 1) return price.toFixed(2);
    if (price >= 0.01) return price.toFixed(4);
    return Number(price).toPrecision(3);
  }

  function sharedNet(host) {
    let areas = root.PetWeatherAreas;
    if (!areas && typeof module !== "undefined" && module.exports) {
      try {
        areas = require("./weather-areas.js");
        root.PetWeatherAreas = areas;
      } catch (err) {
        areas = null;
      }
    }
    if (!areas || typeof areas.plainNetLine !== "function") return "";
    return areas.plainNetLine(host);
  }

  // Plain names for api.coingecko.com, api.geckoterminal.com, and query1.finance.yahoo.com.
  const QUOTE_HOST_NAME = "CoinGecko";
  const TERMINAL_HOST_NAME = "GeckoTerminal";
  const STOCK_HOST_NAME = "Yahoo Finance";
  const QUOTE_LEAD = "This asks price websites for the prices on your saved list. It sends the names on that list.";
  const LOOK_LEAD = "This asks CoinGecko, a price website, to find the name you typed. It sends what you typed.";
  const PLAIN_NET_HEAD = "This computer's internet address also goes to ";
  const PLAIN_NET_TAIL = ", like visiting any website.";

  function asMarket(market) {
    if (market && Array.isArray(market.tickers) && Array.isArray(market.nfts)) return market;
    return parseMarket(market);
  }

  function quoteHostPhrase(market) {
    const house = asMarket(market);
    const names = [];
    const hasQuote = house.tickers.some((row) => row.kind === "crypto" && row.geckoId && !row.address) || !!currentNft(house);
    const hasTerminal = house.tickers.some((row) => row.kind === "crypto" && row.address);
    const ticker = currentTicker(house);
    const hasStock = !!(ticker && ticker.kind === "stock");
    if (hasQuote) names.push(QUOTE_HOST_NAME);
    if (hasTerminal) names.push(TERMINAL_HOST_NAME);
    if (hasStock) names.push(STOCK_HOST_NAME);
    if (!names.length) return "";
    if (names.length === 1) return names[0];
    if (names.length === 2) return names[0] + " and " + names[1];
    return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1];
  }

  function quoteHonesty(market) {
    const host = quoteHostPhrase(market);
    const net = host ? sharedNet(host) : "";
    if (!host || !net) return "";
    return `${QUOTE_LEAD} ${net}`;
  }

  function quoteMaySend(market, lineInView) {
    const host = quoteHostPhrase(market);
    const line = quoteHonesty(market);
    const net = host ? sharedNet(host) : "";
    if (!host || !line || !net || lineInView !== true) return false;
    return line.indexOf(net) !== -1;
  }

  const QUOTE_LOOK = `${LOOK_LEAD} ${sharedNet(QUOTE_HOST_NAME)}`;

  function quoteLookMaySend(lineInView) {
    const net = sharedNet(QUOTE_HOST_NAME);
    return lineInView === true && !!net && QUOTE_LOOK.indexOf(net) !== -1;
  }

  function phraseNames(shown, hostLabel) {
    if (typeof shown !== "string" || !hostLabel) return false;
    const alone = sharedNet(hostLabel);
    if (alone && shown.indexOf(alone) !== -1) return true;
    const head = PLAIN_NET_HEAD;
    const tail = PLAIN_NET_TAIL;
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

  function quoteHostMayLeave(shown, hostLabel) {
    if (typeof shown !== "string" || !hostLabel || shown.indexOf(QUOTE_LEAD) === -1) return false;
    return phraseNames(shown, hostLabel);
  }

  function lookMayLeave(shown) {
    if (!QUOTE_LOOK) return false;
    return typeof shown === "string" && shown.indexOf(QUOTE_LOOK) !== -1;
  }

  /** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
  const QUOTE_TIMEOUT_MS = 12_000;

  /** A silent quote host. Callers flip the plate to unread / "can't reach". */
  class QuoteTimeout extends Error {
    constructor() {
      super("quote request timed out");
      this.name = "QuoteTimeout";
    }
  }

  function isQuoteTimeout(err) {
    return !!(
      err &&
      (err.name === "QuoteTimeout" ||
        err.name === "AbortError" ||
        err.name === "TimeoutError" ||
        err.code === "ABORT_ERR")
    );
  }

  /**
   * One outbound quote JSON read. The timer covers headers and the body.
   * A timeout rejects with QuoteTimeout. The caller does not get a body.
   * A late body after the deadline is not parsed.
   */
  function readJson(url, fetchImpl, timeoutMs) {
    const go = typeof fetchImpl === "function" ? fetchImpl : fetch;
    if (typeof go !== "function") return Promise.reject(new QuoteTimeout());
    const ms = typeof timeoutMs === "number" ? timeoutMs : QUOTE_TIMEOUT_MS;
    const ctrl = new AbortController();
    let settled = false;
    let timer;

    return new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        ctrl.abort();
        reject(new QuoteTimeout());
      }, ms);

      Promise.resolve()
        .then(function () {
          return go(url, { signal: ctrl.signal });
        })
        .then(function (res) {
          return res && typeof res.json === "function" ? res.json() : null;
        })
        .then(function (json) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(json);
        })
        .catch(function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (isQuoteTimeout(err)) reject(new QuoteTimeout());
          else reject(err);
        });
    });
  }

  function readGeckoMany(shown, ids, fetchImpl, timeoutMs) {
    if (!quoteHostMayLeave(shown, QUOTE_HOST_NAME)) return Promise.resolve(null);
    const url = geckoManyUrl(ids);
    if (!url) return Promise.resolve(null);
    return readJson(url, fetchImpl, timeoutMs);
  }

  function readTerminal(shown, platform, address, fetchImpl, timeoutMs) {
    if (!quoteHostMayLeave(shown, TERMINAL_HOST_NAME)) return Promise.resolve(null);
    const url = terminalTokenUrl(platform, address);
    if (!url) return Promise.resolve(null);
    return readJson(url, fetchImpl, timeoutMs);
  }

  function readYahoo(shown, symbol, fetchImpl, timeoutMs) {
    if (!quoteHostMayLeave(shown, STOCK_HOST_NAME)) return Promise.resolve(null);
    const url = yahooUrl(symbol);
    if (!url) return Promise.resolve(null);
    return readJson(url, fetchImpl, timeoutMs);
  }

  function readNft(shown, geckoId, fetchImpl, timeoutMs) {
    if (!quoteHostMayLeave(shown, QUOTE_HOST_NAME)) return Promise.resolve(null);
    const url = nftUrl(geckoId);
    if (!url) return Promise.resolve(null);
    return readJson(url, fetchImpl, timeoutMs);
  }

  function readQuoteSearch(shown, query, fetchImpl, timeoutMs) {
    if (!lookMayLeave(shown)) return Promise.resolve(null);
    const url = searchUrl(query);
    if (!url) return Promise.resolve(null);
    return readJson(url, fetchImpl, timeoutMs);
  }

  function plateLine(market, live, unread, waiting) {
    const house = market && market.tickers ? market : parseMarket(market);
    const ticker = currentTicker(house);
    if (!ticker) {
      const nft = currentNft(house);
      if (nft) return nft.symbol || nft.name;
      return NO_QUOTE;
    }
    if (unread && !live) return ticker.symbol + " · " + CANT_REACH;
    if (!live && waiting) return ticker.symbol + " · " + QUOTE_WAITS;
    if (!live) return ticker.symbol + " · " + PRICE_LOOKING;
    return ticker.symbol + " · " + formatPrice(live.price);
  }

  function nftLine(market, live, unread) {
    const nft = currentNft(market);
    if (!nft) return NO_NFT;
    if (unread && !live) return (nft.symbol || nft.name) + " · " + CANT_REACH;
    if (!live) return (nft.symbol || nft.name) + " · " + PRICE_LOOKING;
    if (live.floorUsd != null) return (nft.symbol || nft.name) + " · $" + formatPrice(live.floorUsd);
    if (live.floorNative != null) return (nft.symbol || nft.name) + " · " + formatPrice(live.floorNative) + " " + (live.nativeSymbol || "");
    return nft.symbol || nft.name;
  }


  function toggleFavoriteTicker(market, id) {
    const house = parseMarket(market);
    if (!id || !house.tickers.some((row) => row.id === id)) return house;
    if (house.favoriteTickerIds.includes(id)) house.favoriteTickerIds = house.favoriteTickerIds.filter((x) => x !== id);
    else house.favoriteTickerIds = house.favoriteTickerIds.concat(id).slice(0, MAX_FAVORITES);
    return house;
  }

  function toggleFavoriteNft(market, id) {
    const house = parseMarket(market);
    if (!id || !house.nfts.some((row) => row.id === id)) return house;
    if (house.favoriteNftIds.includes(id)) house.favoriteNftIds = house.favoriteNftIds.filter((x) => x !== id);
    else house.favoriteNftIds = house.favoriteNftIds.concat(id).slice(0, MAX_FAVORITES);
    return house;
  }

  function isFavoriteTicker(market, id) {
    return parseMarket(market).favoriteTickerIds.includes(id);
  }

  function isFavoriteNft(market, id) {
    return parseMarket(market).favoriteNftIds.includes(id);
  }

  function favoriteRows(market) {
    const house = parseMarket(market);
    return {
      tickers: house.favoriteTickerIds.map((id) => house.tickers.find((row) => row.id === id)).filter(Boolean),
      nfts: house.favoriteNftIds.map((id) => house.nfts.find((row) => row.id === id)).filter(Boolean),
    };
  }

  function toCardPatch(house) {
    const parsed = house && house.tickers ? house : parseMarket(house);
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

  const api = {
    MARKET_LABEL,
    COIN_LABEL,
    NFT_LABEL,
    MARKET_PLACEHOLDER,
    NFT_PLACEHOLDER,
    MARKET_TRUTH,
    NFT_TRUTH,
    YAHOO_HOST,
    COINGECKO_HOST,
    GECKO_TERMINAL_HOST,
    CANT_REACH,
    NO_QUOTE,
    QUOTE_WAITS,
    NO_NFT,
    MAX_TICKERS,
    MAX_NFTS,
    MAX_MARKETS,
    CRYPTO,
    DEFAULT_CRYPTO,
    DEFAULT_NFTS,
    NFT_MARKETPLACES,
    DEFAULT_MARKETPLACES,
    blankMarket,
    defaultTickers,
    defaultNfts,
    defaultMarketplaces,
    marketplaceOf,
    detectContract,
    classify,
    parseTicker,
    parseNftRow,
    parseMarket,
    currentTicker,
    currentNft,
    addTicker,
    removeTicker,
    pickTicker,
    moveTicker,
    addNft,
    removeNft,
    pickNft,
    moveNft,
    addMarketplace,
    removeMarketplace,
    moveMarketplace,
    yahooUrl,
    geckoUrl,
    geckoManyUrl,
    searchUrl,
    nftUrl,
    terminalTokenUrl,
    terminalPriceUrl,
    parseYahoo,
    parseGecko,
    parseGeckoMany,
    parseTerminalToken,
    parseTerminalPrice,
    pickBestSearchCoin,
    parseSearchCoins,
    parseSearchNfts,
    parseNftLive,
    formatPrice,
    plateLine,
    nftLine,
    QUOTE_HOST_NAME,
    TERMINAL_HOST_NAME,
    STOCK_HOST_NAME,
    quoteHostPhrase,
    quoteHonesty,
    quoteMaySend,
    QUOTE_LOOK,
    QUOTE_LEAD,
    LOOK_LEAD,
    quoteLookMaySend,
    phraseNames,
    quoteHostMayLeave,
    lookMayLeave,
    QUOTE_TIMEOUT_MS,
    QuoteTimeout,
    readGeckoMany,
    readTerminal,
    readYahoo,
    readNft,
    readQuoteSearch,
    FAVORITES_EMPTY,
    PRICE_LOOKING,
    SEARCHING,
    MAX_FAVORITES,
    toggleFavoriteTicker,
    toggleFavoriteNft,
    isFavoriteTicker,
    isFavoriteNft,
    favoriteRows,
    toCardPatch,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetMarket = api;
})(typeof window !== "undefined" ? window : globalThis);
