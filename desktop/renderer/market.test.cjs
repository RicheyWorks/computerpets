const assert = require("node:assert/strict");
const { test } = require("node:test");
const M = require("./market.js");
const P = require("./desk-plates.js");

test("quotes name the network address and wait until that line is in view", () => {
  const house = M.parseMarket({});
  const line = "This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to CoinGecko, like visiting any website.";
  assert.equal(M.quoteHostPhrase(house), "CoinGecko");
  assert.equal(M.quoteHonesty(house), line);
  assert.equal(M.quoteMaySend(house, false), false);
  assert.equal(M.quoteMaySend(house, true), true);
  const empty = M.parseMarket({ marketTickers: [], marketCustomized: true, nftCollections: [], nftCustomized: true });
  assert.equal(M.quoteHonesty(empty), "");
  assert.equal(M.quoteMaySend(empty, true), false);
  const mixed = M.parseMarket({
    marketTickers: [
      { symbol: "ETH", kind: "crypto", geckoId: "ethereum", name: "Ethereum" },
      { symbol: "PUMP", kind: "crypto", name: "Pump", platform: "solana", address: "So11111111111111111111111111111111111111112" },
    ],
    nftCollections: [],
    nftCustomized: true,
  });
  assert.equal(M.quoteHostPhrase(mixed), "CoinGecko and GeckoTerminal");
  assert.match(M.quoteHonesty(mixed), /goes to CoinGecko and GeckoTerminal, like visiting any website/);
  let stock = M.parseMarket({
    marketTickers: [
      { symbol: "ETH", kind: "crypto", geckoId: "ethereum", name: "Ethereum" },
      { symbol: "AAPL", kind: "stock", name: "AAPL" },
    ],
    nftCollections: [],
    nftCustomized: true,
  });
  const aapl = stock.tickers.find((row) => row.symbol === "AAPL");
  stock = M.pickTicker(stock, aapl.id);
  assert.equal(M.quoteHostPhrase(stock), "CoinGecko and Yahoo Finance");
  assert.equal(M.quoteLookMaySend(false), false);
  assert.equal(M.quoteLookMaySend(true), true);
  assert.equal(M.QUOTE_LOOK, "This asks CoinGecko, a price website, to find the name you typed. It sends what you typed. This computer's internet address also goes to CoinGecko, like visiting any website.");
});

test("quote wrappers refuse a fetch until the painted host line is present", async () => {
  const quote = "This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to CoinGecko, like visiting any website.";
  const mixed = "This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to CoinGecko and GeckoTerminal, like visiting any website.";
  const stock = "This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to Yahoo Finance, like visiting any website.";
  assert.equal(M.quoteHostMayLeave("", M.QUOTE_HOST_NAME), false);
  assert.equal(M.quoteHostMayLeave(M.QUOTE_LOOK, M.QUOTE_HOST_NAME), false);
  assert.equal(M.quoteHostMayLeave(quote, M.QUOTE_HOST_NAME), true);
  assert.equal(M.quoteHostMayLeave(mixed, M.QUOTE_HOST_NAME), true);
  assert.equal(M.quoteHostMayLeave(mixed, M.TERMINAL_HOST_NAME), true);
  assert.equal(M.quoteHostMayLeave(quote, M.TERMINAL_HOST_NAME), false);
  assert.equal(M.quoteHostMayLeave(stock, M.STOCK_HOST_NAME), true);
  assert.equal(M.lookMayLeave(""), false);
  assert.equal(M.lookMayLeave(quote), false);
  assert.equal(M.lookMayLeave(M.QUOTE_LOOK), true);
  let calls = 0;
  const fake = async (url) => {
    calls += 1;
    return { json: async () => ({ ok: true, url: String(url) }) };
  };
  assert.equal(await M.readGeckoMany("", ["bitcoin"], fake), null);
  assert.equal(await M.readGeckoMany(M.QUOTE_LOOK, ["bitcoin"], fake), null);
  assert.equal(await M.readTerminal(quote, "solana", "So11111111111111111111111111111111111111112", fake), null);
  assert.equal(await M.readYahoo(quote, "AAPL", fake), null);
  assert.equal(await M.readQuoteSearch(quote, "pepe", fake), null);
  assert.equal(calls, 0);
  const gecko = await M.readGeckoMany(quote, ["bitcoin"], fake);
  assert.equal(gecko.ok, true);
  assert.match(gecko.url, /api\.coingecko\.com/);
  assert.equal(calls, 1);
  const term = await M.readTerminal(mixed, "solana", "So11111111111111111111111111111111111111112", fake);
  assert.match(term.url, /api\.geckoterminal\.com/);
  assert.equal(calls, 2);
  const yahoo = await M.readYahoo(stock, "AAPL", fake);
  assert.match(yahoo.url, /finance\.yahoo\.com/);
  assert.equal(calls, 3);
  const nft = await M.readNft(quote, "cryptopunks", fake);
  assert.match(nft.url, /api\.coingecko\.com\/api\/v3\/nfts\//);
  assert.equal(calls, 4);
  const look = await M.readQuoteSearch(M.QUOTE_LOOK, "pepe", fake);
  assert.match(look.url, /api\.coingecko\.com\/api\/v3\/search/);
  assert.equal(calls, 5);
});

test("quote wrappers time out and deny a silent host", async () => {
  assert.equal(M.QUOTE_TIMEOUT_MS, 12_000);
  assert.equal(M.QuoteTimeout.name, "QuoteTimeout");
  const quote = "This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to CoinGecko, like visiting any website.";
  const hang = () => new Promise(() => {});
  const calls = [];
  await assert.rejects(
    () => M.readGeckoMany(quote, ["bitcoin"], (url) => (calls.push(url), hang()), 30),
    (err) => err instanceof M.QuoteTimeout && err.name === "QuoteTimeout",
  );
  await assert.rejects(
    () => M.readQuoteSearch(M.QUOTE_LOOK, "pepe", () => hang(), 30),
    (err) => err instanceof M.QuoteTimeout,
  );
  await assert.rejects(
    () => M.readYahoo("This asks price websites for the prices on your saved list. It sends the names on that list. This computer's internet address also goes to Yahoo Finance, like visiting any website.", "AAPL", () => hang(), 30),
    (err) => err instanceof M.QuoteTimeout,
  );
  assert.equal(calls.length, 1);

  let fulfilled = null;
  const late = M.readGeckoMany(
    quote,
    ["bitcoin"],
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({ json: async () => ({ bitcoin: { usd: 1 } }) });
        }, 80);
      }),
    20,
  ).then(
    (body) => {
      fulfilled = body;
      return body;
    },
    (err) => {
      fulfilled = err;
      throw err;
    },
  );
  await assert.rejects(() => late, (err) => err instanceof M.QuoteTimeout);
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(fulfilled instanceof M.QuoteTimeout);
  assert.equal(fulfilled.name, "QuoteTimeout");

  const answered = await M.readGeckoMany(quote, ["bitcoin"], async () => ({
    json: async () => ({ bitcoin: { usd: 3 } }),
  }), 200);
  assert.equal(answered.bitcoin.usd, 3);
  assert.equal(await M.readGeckoMany("", ["bitcoin"], () => hang(), 30), null);
});

test("Quotes defaults seed ETH DOGE XLM plus majors", () => {
  const house = M.parseMarket({});
  const symbols = house.tickers.map((t) => t.symbol);
  assert.deepEqual(symbols.slice(0, 3), ["ETH", "DOGE", "XLM"]);
  assert.ok(symbols.includes("BTC"));
  assert.ok(symbols.includes("SOL"));
  assert.equal(house.tickers.every((t) => t.kind === "crypto"), true);
});

test("add/remove/reorder coins persist through parseMarket", () => {
  let house = M.parseMarket({});
  house = M.addTicker(house, "LINK");
  assert.ok(house.tickers.some((t) => t.symbol === "LINK"));
  const link = house.tickers.find((t) => t.symbol === "LINK");
  house = M.moveTicker(house, link.id, -1);
  const idx = house.tickers.findIndex((t) => t.id === link.id);
  assert.ok(idx >= 0);
  house = M.removeTicker(house, link.id);
  assert.equal(house.tickers.some((t) => t.symbol === "LINK"), false);
  const patch = M.toCardPatch(house);
  const again = M.parseMarket(patch);
  assert.equal(again.tickers.length, house.tickers.length);
});

test("pump.fun-style mint and EVM contract classify as crypto addresses", () => {
  const mint = "So11111111111111111111111111111111111111112";
  const evm = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  assert.deepEqual(M.detectContract(mint), { platform: "solana", address: mint });
  assert.equal(M.detectContract(evm).platform, "eth");
  const sol = M.parseTicker(mint);
  assert.equal(sol.kind, "crypto");
  assert.equal(sol.platform, "solana");
  assert.equal(sol.address, mint);
  const token = M.parseTicker(evm);
  assert.equal(token.platform, "eth");
  assert.ok(M.terminalTokenUrl("solana", mint).includes("geckoterminal.com"));
  assert.ok(M.terminalTokenUrl("eth", evm).includes("/networks/eth/tokens/"));
});

test("NFT collections and marketplaces customize with honest venue labels", () => {
  let house = M.parseMarket({});
  assert.ok(house.nfts.length >= 3);
  const ids = house.marketplaces.map((m) => m.id);
  for (const id of ["opensea", "blur", "magiceden", "rarible", "robinhood-nft"]) {
    assert.ok(ids.includes(id), id);
  }
  const open = house.marketplaces.find((m) => m.id === "opensea");
  assert.equal(open.note, "needs a paid account for live prices");
  house = M.removeMarketplace(house, "robinhood-nft");
  assert.equal(house.marketplaces.some((m) => m.id === "robinhood-nft"), false);
  house = M.addMarketplace(house, "robinhood-nft");
  assert.ok(house.marketplaces.some((m) => m.id === "robinhood-nft"));
  house = M.addNft(house, { geckoId: "azuki", name: "Azuki", symbol: "AZUKI" });
  assert.ok(house.nfts.some((n) => n.geckoId === "azuki"));
  const az = house.nfts.find((n) => n.geckoId === "azuki");
  house = M.moveNft(house, az.id, -1);
  const patch = M.toCardPatch(house);
  assert.equal(patch.marketplaceCustomized, true);
  const again = M.parseMarket(patch);
  assert.ok(again.nfts.some((n) => n.geckoId === "azuki"));
});

test("plate style swatches still paint Quotes windows", () => {
  const plates = P.loadPlates(800, 480, {
    data: Object.create(null),
    getItem() { return null; },
    setItem() {},
  });
  const quotes = P.applySwatch(plates[2], "moss");
  assert.equal(quotes.bg, "#1a2a1c");
  const style = P.paintStyle(quotes);
  assert.equal(style["--plate-bg"], "#1a2a1c");
  assert.ok(P.SWATCHES.some((s) => s.id === "ember"));
  assert.ok(P.SWATCHES.some((s) => s.id === "frost"));
});

test("offline parsers return null without inventing prices", () => {
  assert.equal(M.parseGecko({}, "bitcoin"), null);
  assert.equal(M.parseTerminalToken({}), null);
  assert.equal(M.parseNftLive({ id: "x" }), null);
  assert.equal(M.parseSearchCoins({ coins: [] }).length, 0);
});

test("classify routes equities to Yahoo stock and majors to crypto", () => {
  const aapl = M.classify("AAPL");
  assert.equal(aapl.kind, "stock");
  assert.equal(aapl.symbol, "AAPL");
  assert.equal(aapl.geckoId, "");
  const btc = M.classify("BTC");
  assert.equal(btc.kind, "crypto");
  assert.equal(btc.geckoId, "bitcoin");
  // Bare unknown tickers guess Yahoo stock; Coins Add forces crypto via kind/search.
  const pepe = M.classify("PEPE");
  assert.equal(pepe.kind, "stock");
  assert.equal(pepe.symbol, "PEPE");
  assert.equal(pepe.geckoId, "");
  const wif = M.parseTicker("WIF");
  assert.equal(wif.kind, "stock");
  // Already-saved equity stays stock through parseTicker / parseMarket.
  const saved = M.parseTicker({ symbol: "AAPL", kind: "stock", name: "Apple" });
  assert.equal(saved.kind, "stock");
  assert.equal(saved.geckoId, "");
  const house = M.parseMarket({
    marketTickers: [{ symbol: "AAPL", kind: "stock", name: "Apple" }, { symbol: "BTC" }],
    marketCustomized: true,
  });
  assert.equal(house.tickers[0].kind, "stock");
  assert.equal(house.tickers.find((t) => t.symbol === "BTC").kind, "crypto");
});

test("add-by-unknown-ticker via CoinGecko search lands on crypto watch list", () => {
  const hits = M.parseSearchCoins({
    coins: [
      { id: "dogwifcoin", name: "dogwifhat", symbol: "wif", market_cap_rank: 50 },
      { id: "wrapped-internet-computer", name: "Other WIF", symbol: "owif", market_cap_rank: 900 },
      { id: "pepe", name: "Pepe", symbol: "pepe", market_cap_rank: 30 },
    ],
  });
  const bestWif = M.pickBestSearchCoin(hits, "WIF");
  assert.ok(bestWif);
  assert.equal(bestWif.symbol, "WIF");
  assert.equal(bestWif.geckoId, "dogwifcoin");
  assert.equal(bestWif.kind, "crypto");
  let house = M.parseMarket({});
  house = M.addTicker(house, { ...bestWif, kind: "crypto" });
  const row = house.tickers.find((t) => t.geckoId === "dogwifcoin");
  assert.ok(row);
  assert.equal(row.kind, "crypto");
  assert.equal(row.symbol, "WIF");
  // Dedup by geckoId / symbol
  const again = M.addTicker(house, { symbol: "WIF", kind: "crypto", geckoId: "dogwifcoin", name: "dogwifhat" });
  assert.equal(again.tickers.filter((t) => t.geckoId === "dogwifcoin").length, 1);
  const pepeBest = M.pickBestSearchCoin(hits, "PEPE");
  assert.equal(pepeBest.geckoId, "pepe");
  house = M.addTicker(again, pepeBest);
  assert.ok(house.tickers.some((t) => t.symbol === "PEPE" && t.kind === "crypto" && t.geckoId === "pepe"));
  const patch = M.toCardPatch(house);
  const persisted = M.parseMarket(patch);
  assert.ok(persisted.tickers.some((t) => t.geckoId === "pepe"));
  assert.ok(persisted.tickers.some((t) => t.geckoId === "dogwifcoin"));
  assert.ok(M.MAX_TICKERS >= 24);
});

test("Coins pane kind crypto override beats classify stock guess on object add", () => {
  const forced = M.parseTicker({ symbol: "BONK", kind: "crypto", geckoId: "bonk", name: "Bonk" });
  assert.equal(forced.kind, "crypto");
  assert.equal(forced.geckoId, "bonk");
  let house = M.parseMarket({});
  house = M.addTicker(house, forced);
  assert.ok(house.tickers.some((t) => t.symbol === "BONK" && t.kind === "crypto"));
});

test("market favorites star coins and nfts", () => {
  const M = require("./market.js");
  let house = M.blankMarket();
  const coin = house.tickers[0];
  const nft = house.nfts[0];
  assert.ok(coin);
  assert.ok(nft);
  house = M.toggleFavoriteTicker(house, coin.id);
  house = M.toggleFavoriteNft(house, nft.id);
  assert.deepEqual(M.favoriteRows(house).tickers.map((t) => t.id), [coin.id]);
  assert.deepEqual(M.favoriteRows(house).nfts.map((t) => t.id), [nft.id]);
  const patch = M.toCardPatch(house);
  assert.deepEqual(patch.favoriteTickerIds, [coin.id]);
  const again = M.parseMarket(patch);
  assert.equal(M.isFavoriteTicker(again, coin.id), true);
  assert.match(M.FAVORITES_EMPTY, /No favorites yet/);
});
