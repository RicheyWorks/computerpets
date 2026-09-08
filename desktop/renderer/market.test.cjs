const assert = require("node:assert/strict");
const { test } = require("node:test");
const M = require("./market.js");
const P = require("./desk-plates.js");

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
  assert.match(open.note, /key|offline|floor/i);
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

test("free-typed unknown ticker prefers crypto, not Yahoo stock", () => {
  const pepe = M.classify("PEPE");
  assert.equal(pepe.kind, "crypto");
  assert.equal(pepe.symbol, "PEPE");
  assert.equal(pepe.geckoId, "");
  const wif = M.parseTicker("WIF");
  assert.equal(wif.kind, "crypto");
  // Already-saved equity stays stock through parseTicker / parseMarket.
  const aapl = M.parseTicker({ symbol: "AAPL", kind: "stock", name: "Apple" });
  assert.equal(aapl.kind, "stock");
  assert.equal(aapl.geckoId, "");
  const house = M.parseMarket({
    marketTickers: [{ symbol: "AAPL", kind: "stock", name: "Apple" }],
    marketCustomized: true,
  });
  assert.equal(house.tickers[0].kind, "stock");
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

