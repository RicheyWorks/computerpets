import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readSource } from "./test-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = await import(pathToFileURL(join(root, "src/lib/pets/presence.ts")).href);
const room = readSource(join(root, "src/components/desk/companion-room.tsx"));
const demo = readSource(join(root, "src/components/desk/demo-stage.tsx"));
const plates = readSource(join(root, "src/components/desk/desk-plates.tsx"));

test("desk presence refuses navigation and host paths", () => {
  assert.equal(P.allowNavigation("file:///home/keeper/homework.html"), false);
  assert.equal(P.allowNavigation("https://evil.example"), false);
  assert.equal(P.houseFile("/house", "card.json"), "/house/card.json");
  assert.equal(P.houseFile("/house", "mind.json"), "/house/mind.json");
  assert.equal(P.houseFile("/house", "../Desktop/notes.txt"), null);
  assert.equal(P.houseFile("/house", "hwid.txt"), null);
  assert.deepEqual(P.readMachineMark(), { read: false, raw: null, id: "" });
});

test("clipboard and file-system grants stay denied; geolocation is not a standing grant", async () => {
  P.clearWeatherLocate();
  assert.equal(P.allowPermission("geolocation", 1_000), false);
  assert.equal(P.armWeatherLocate(1_000), 1_000 + P.WEATHER_LOCATE_MS);
  assert.equal(P.allowPermission("geolocation", 1_000), true);
  assert.equal(P.allowPermission("geolocation", 1_000 + P.WEATHER_LOCATE_MS), false);
  P.clearWeatherLocate();
  assert.equal(P.allowPermission("geolocation", 1_500), false);
  assert.equal(P.allowPermission("clipboard-read"), false);
  assert.equal(P.allowPermission("display-capture"), false);
  assert.equal(P.allowPermission("fileSystem"), false);

  let watched = 0;
  const seen = [];
  P.holdWeatherLocate();
  const silent = await P.readWeatherHere(
    {
      getCurrentPosition() {
        seen.push("silent");
      },
    },
  );
  assert.equal(silent, null);
  assert.deepEqual(seen, []);
  P.noteWeatherLocateYes();
  const fix = await P.readWeatherHere(
    {
      getCurrentPosition(ok, _err, opts) {
        seen.push(opts);
        assert.equal(P.allowPermission("geolocation"), true);
        ok({ coords: { latitude: 47.6, longitude: -122.3 } });
      },
      watchPosition() {
        watched += 1;
      },
    },
  );
  assert.deepEqual(fix, { lat: 47.6, lon: -122.3 });
  assert.equal(seen[0].maximumAge, 0);
  assert.equal(seen[0].enableHighAccuracy, false);
  assert.equal(watched, 0);
  assert.equal(P.allowPermission("geolocation"), false);
  assert.equal(await P.readWeatherHere(undefined), null);
  P.noteWeatherLocateYes();
  P.holdWeatherLocate();
  assert.equal(await P.readWeatherHere(
    {
      getCurrentPosition() {
        seen.push("held");
      },
    },
  ), null);
  assert.deepEqual(seen, [seen[0]]);
  P.noteWeatherLocateYes();
  const again = await P.readWeatherHere(
    {
      getCurrentPosition(ok) {
        seen.push("again");
        ok({ coords: { latitude: 1, longitude: 2 } });
      },
    },
  );
  assert.deepEqual(again, { lat: 1, lon: 2 });
  assert.equal(seen.filter((x) => x === "again").length, 1);
  assert.equal(await P.readWeatherHere(
    {
      getCurrentPosition() {
        seen.push("third");
      },
    },
  ), null);
  assert.equal(seen.includes("third"), false);
  assert.equal(P.ipPlace(), null);
  assert.equal(P.ipPlace(true), null);
  assert.match(plates, /readWeatherHere/);
  assert.match(plates, /ipPlace\(/);
  assert.match(plates, /HERE_SEND/);
  assert.match(plates, /HERE_ASK/);
  assert.match(plates, /HERE_YES/);
  assert.match(plates, /locateGate/);
  assert.match(plates, /sharePlace/);
  assert.match(plates, /loadCard\(\)/);
  const useAt = plates.indexOf("function useHere");
  const confirmAt = plates.indexOf("async function confirmHere");
  const useBody = plates.slice(useAt, confirmAt);
  assert.match(useBody, /locateGate\(areas, false\)/);
  assert.doesNotMatch(useBody, /readWeatherHere|reverseUrl|sharePlace|noteWeatherLocateYes/);
  const declineAt = plates.indexOf("function declineHere");
  const confirmBody = plates.slice(confirmAt, declineAt);
  assert.match(confirmBody, /locateGate\(areas, true\)/);
  assert.match(confirmBody, /noteWeatherLocateYes/);
  assert.match(confirmBody, /holdWeatherLocate/);
  assert.ok(confirmBody.indexOf("locateGate") < confirmBody.indexOf("noteWeatherLocateYes"));
  assert.ok(confirmBody.indexOf("noteWeatherLocateYes") < confirmBody.indexOf("readWeatherHere"));
  const declineBody = plates.slice(declineAt, declineAt + 280);
  assert.match(declineBody, /holdWeatherLocate/);
  assert.doesNotMatch(declineBody, /readWeatherHere|noteWeatherLocateYes|getCurrentPosition/);
  assert.ok(confirmBody.indexOf("sharePlace") < confirmBody.indexOf("reverseUrl"));
  assert.match(confirmBody, /geocodeMaySend\("reverse"/);
  assert.ok(confirmBody.indexOf('geocodeMaySend("reverse"') < confirmBody.indexOf("reverseUrl"));
  assert.ok(confirmBody.indexOf("reverseUrl") < confirmBody.indexOf("readReverse(shown"));
  assert.doesNotMatch(confirmBody, /fetch\(/);
  const forecastEffect = plates.slice(plates.indexOf("const gate = forecastGate"), plates.indexOf("async function search"));
  assert.doesNotMatch(forecastEffect, /readWeatherHere|noteWeatherLocateYes|getCurrentPosition|armWeatherLocate/);
  const openToggle = plates.slice(plates.indexOf("onClick={() => chrome.toggleOpen"), plates.indexOf("onClick={() => chrome.toggleOpen") + 80);
  assert.doesNotMatch(openToggle, /readWeatherHere|noteWeatherLocateYes|getCurrentPosition/);
  assert.doesNotMatch(demo, /readWeatherHere|noteWeatherLocateYes|getCurrentPosition/);
  assert.match(room, /DeskWeatherPlate/);
  assert.doesNotMatch(confirmBody, /latitude=\$\{fix|longitude=\$\{fix/);
  assert.match(plates, /forecastGate/);
  assert.match(plates, /SAVED_HERE_ASK/);
  assert.match(plates, /SAVED_HERE_YES/);
  assert.match(plates, /confirmSavedHere/);
  const savedAt = plates.indexOf("function confirmSavedHere");
  const savedBody = plates.slice(savedAt, savedAt + 500);
  assert.match(savedBody, /ackSavedHere\(areas\)/);
  assert.doesNotMatch(savedBody, /readWeatherHere|reverseUrl|sharePlace|armWeatherLocate|getCurrentPosition/);
  const gateAt = plates.indexOf("forecastGate(areas, card.hereForecastAck)");
  const forecastAt = plates.indexOf("forecastUrl(gate.area.lat, gate.area.lon)");
  assert.ok(gateAt > 0 && forecastAt > gateAt);
  assert.match(forecastEffect, /forecastMaySend/);
  assert.ok(forecastEffect.indexOf("forecastMaySend") < forecastEffect.indexOf("forecastUrl"));
  assert.ok(forecastEffect.indexOf("forecastUrl") < forecastEffect.indexOf("readForecast(line"));
  assert.match(forecastEffect, /forecastMayLeave/);
  assert.match(forecastEffect, /json == null/);
  assert.match(forecastEffect, /setUnread\(true\)/);
  assert.doesNotMatch(forecastEffect, /fetch\(/);
  assert.match(plates, /forecastHonesty/);
  const areasFile = readSource(join(root, "src/lib/pets/weather-areas.ts"));
  assert.match(areasFile, /WEATHER_TIMEOUT_MS/);
  assert.match(areasFile, /AbortController/);
  assert.match(areasFile, /WeatherTimeout/);
  const newsFile = readSource(join(root, "src/lib/pets/news.ts"));
  assert.match(newsFile, /NEWS_TIMEOUT_MS/);
  assert.match(newsFile, /AbortController/);
  assert.match(newsFile, /NewsTimeout/);
  const marketFile = readSource(join(root, "src/lib/pets/market.ts"));
  assert.match(marketFile, /QUOTE_TIMEOUT_MS/);
  assert.match(marketFile, /AbortController/);
  assert.match(marketFile, /QuoteTimeout/);
  const radioFile = readSource(join(root, "src/lib/pets/house-music.ts"));
  assert.match(radioFile, /RADIO_TIMEOUT_MS/);
  assert.match(radioFile, /AbortController/);
  assert.match(radioFile, /RadioTimeout/);
  assert.match(plates, /id="weather-forecast-net"/);
  assert.match(plates, /id="weather-geocode-net"/);
  assert.match(plates, /id="weather-reverse-net"/);
  assert.match(plates, /geocodeHonesty\("look"\)/);
  assert.match(plates, /geocodeHonesty\("reverse"\)/);
  const searchAt = plates.indexOf("async function search");
  const searchBody = plates.slice(searchAt, plates.indexOf("function useHere"));
  assert.match(searchBody, /geocodeMaySend\("look"/);
  assert.ok(searchBody.indexOf('geocodeMaySend("look"') < searchBody.indexOf("geocodeUrl("));
  assert.ok(searchBody.indexOf("geocodeUrl(") < searchBody.indexOf("readGeocode(shown"));
  assert.match(searchBody, /json == null/);
  assert.match(searchBody, /WEATHER_CANT_REACH/);
  assert.doesNotMatch(searchBody, /fetch\(/);
  assert.doesNotMatch(searchBody, /readWeatherHere|reverseUrl|noteWeatherLocateYes|getCurrentPosition/);
  assert.equal(plates.split("geocodeUrl(").length - 1, 1);
  assert.equal(plates.split("reverseUrl(").length - 1, 1);
  assert.doesNotMatch(forecastEffect, /geocodeUrl\(|reverseUrl\(/);
  const openAt = plates.indexOf("{open ? (");
  const askAt = plates.indexOf('id="weather-saved-ask"');
  assert.ok(openAt > 0 && askAt > openAt);
  assert.doesNotMatch(plates, /getCurrentPosition|watchPosition|maximumAge:\s*600/);
  const tickAt = plates.indexOf("setInterval");
  assert.ok(tickAt > 0);
  assert.doesNotMatch(plates.slice(tickAt, tickAt + 240), /readWeatherHere|noteWeatherLocateYes|getCurrentPosition/);
  assert.doesNotMatch(plates.slice(tickAt, tickAt + 400), /forecastUrl/);
  assert.doesNotMatch(plates, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  const src = readSource(join(root, "src/lib/pets/presence.ts"));
  assert.doesNotMatch(src, /watchPosition/);
  assert.doesNotMatch(src, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|fetch\(/);
  const keeper = readSource(join(root, "src/components/desk/keeper-card.tsx"));
  const pet = readSource(join(root, "../desktop/renderer/pet.js"));
  const html = readSource(join(root, "../desktop/renderer/index.html"));
  const newsAt = pet.indexOf("function fetchNews");
  const marketAt = pet.indexOf("function fetchMarket");
  const newsBody = pet.slice(newsAt, marketAt);
  assert.ok(newsBody.indexOf("newsHonesty") < newsBody.indexOf("newsMaySend"));
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("popularRssUrl"));
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("readRss(line"));
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("readFeatured(line)"));
  assert.doesNotMatch(newsBody, /fetch\(N\.newsUrl\(/);
  assert.doesNotMatch(newsBody, /fetch\(url\)\.then\(\(r\) => r\.text\(\)\)/);
  const marketBody = pet.slice(marketAt, pet.indexOf("function sitSleepAid"));
  assert.ok(marketBody.indexOf("quoteHonesty") < marketBody.indexOf("quoteMaySend"));
  assert.ok(marketBody.indexOf("quoteMaySend") < marketBody.indexOf("readGeckoMany(line"));
  assert.ok(marketBody.indexOf("readTerminal(line") > marketBody.indexOf("quoteMaySend"));
  assert.ok(marketBody.indexOf("readYahoo(line") > marketBody.indexOf("quoteMaySend"));
  assert.ok(marketBody.indexOf("readNft(line") > marketBody.indexOf("quoteMaySend"));
  assert.doesNotMatch(marketBody, /fetch\(url\)\.then\(\(r\) => r\.json\(\)\)/);
  const radioBody = pet.slice(pet.indexOf("function lookupRadio"), pet.indexOf("function skyLabel"));
  assert.ok(radioBody.indexOf("radioMaySend") < radioBody.indexOf("readRadioSearch"));
  assert.doesNotMatch(radioBody, /fetch\(url,/);
  const coinAt = pet.indexOf('e.target.id === "market-add"');
  const nftAt = pet.indexOf('e.target.id === "nft-add"');
  assert.ok(pet.slice(coinAt, nftAt).indexOf("quoteLookMaySend") < pet.slice(coinAt, nftAt).indexOf("readQuoteSearch"));
  assert.ok(pet.slice(nftAt, nftAt + 1500).indexOf("quoteLookMaySend") < pet.slice(nftAt, nftAt + 1500).indexOf("readQuoteSearch"));
  const refreshAt = pet.lastIndexOf("fetchNews();\n  fetchMarket();");
  assert.ok(refreshAt > 0, "the news and market refresh is found");
  assert.doesNotMatch(pet.slice(refreshAt - 180, refreshAt + 40), /popularRssUrl|geckoManyUrl|yahooUrl|newsUrl\(/);
  assert.match(html, /id="news-net"/);
  assert.match(html, /id="market-net"/);
  assert.match(html, /id="market-look-net"/);
  assert.match(html, /id="hud-radio-net"/);
  assert.match(html, /this look-up sends the typed name\. this computer's network address goes with the https request to the quote host, as any client\./);
  assert.match(html, /this find sends the station look-up\. this computer's network address goes with the https request to the radio host, as any client\./);
  assert.match(plates, /id="news-net"/);
  assert.match(plates, /newsMaySend/);
  const popAt = plates.indexOf("popularRssUrl()");
  assert.ok(plates.lastIndexOf("if (!open) return", popAt) < popAt);
  assert.ok(plates.indexOf("if (!newsMaySend") < popAt);
  assert.ok(plates.indexOf("if (!newsMaySend") < plates.indexOf("readRss(line"));
  assert.ok(plates.indexOf("if (!newsMaySend") < plates.indexOf("readFeatured(line)"));
  assert.doesNotMatch(plates, /fetch\(newsUrl\(\)\)/);
  assert.doesNotMatch(plates, /fetch\(popularRssUrl/);
  assert.match(plates, /quoteMaySend/);
  assert.ok(plates.indexOf("if (!quoteMaySend") < plates.indexOf("readGeckoMany(line"));
  assert.ok(plates.indexOf("if (!quoteLookMaySend") < plates.indexOf("readQuoteSearch("));
  const radioFn = keeper.indexOf("function lookupRadio");
  assert.ok(keeper.indexOf("radioMaySend", radioFn) < keeper.indexOf("readRadioSearch", radioFn));
  assert.doesNotMatch(keeper.slice(radioFn, radioFn + 900), /fetch\(url,/);
  assert.match(keeper, /id="hud-radio-net"/);
  const musicEffect = keeper.slice(keeper.indexOf("const src = playSrc(music)"), keeper.indexOf("const src = sleepPlaySrc"));
  assert.ok(musicEffect.indexOf("streamMaySend") < musicEffect.indexOf("openStationStream"));
  assert.ok(musicEffect.indexOf("openStationStream") < musicEffect.indexOf("new Audio"));
  assert.match(keeper, /const \[streamAsked, setStreamAsked\] = useState\(false\)/);
  assert.ok(keeper.indexOf("setStreamAsked(true)") < keeper.indexOf("writeMusic(next, ask"));
  assert.match(keeper, /id="hud-stream-net"/);
  const sitAt = pet.indexOf("function sitMusic");
  const sitBody = pet.slice(sitAt, pet.indexOf("function ruiSleepBout"));
  assert.ok(sitBody.indexOf("streamMaySend") < sitBody.indexOf("openStationStream"));
  assert.ok(sitBody.indexOf("openStationStream") < sitBody.indexOf("new Audio"));
  const playAt = pet.indexOf("hudMusicPlay.addEventListener");
  const playBody = pet.slice(playAt, playAt + 900);
  assert.ok(playBody.indexOf("streamAsked = true") < playBody.indexOf("persistCard"));
  assert.ok(playBody.indexOf("persistCard") < playBody.indexOf("sitMusic"));
  const pickAt = pet.indexOf("function fillRadioHits");
  const pickBody = pet.slice(pickAt, pet.indexOf("function radioLineInView"));
  assert.ok(pickBody.indexOf("streamAsked = true") < pickBody.indexOf("persistCard"));
  const bootAt = pet.indexOf("window.PetRoster.loadHouseRoster");
  const bootBody = pet.slice(bootAt, pet.indexOf("bindGuiHarness"));
  assert.match(bootBody, /sitMusic\(\)/);
  assert.doesNotMatch(bootBody, /streamAsked = true/);
  assert.match(html, /id="hud-stream-net"/);
  assert.match(pet, /let streamAsked = false/);
  assert.match(pet, /let talkAsked = false/);
  assert.match(html, /id="hud-talk-net"/);
  const talkAt = pet.indexOf('if (cmd === "talk")');
  const talkBody = pet.slice(talkAt, talkAt + 500);
  assert.ok(talkBody.indexOf("talkHonesty") < talkBody.indexOf("askMind"));
  assert.doesNotMatch(bootBody, /talkAsked = true/);
  assert.doesNotMatch(bootBody, /askMind\(/);
});

test("a dropped file is not a gift and is not read", () => {
  const dropped = P.refuseFileDrop({ types: ["Files", "text/uri-list"], fileCount: 1 });
  assert.deepEqual(dropped, { accept: false, read: false, files: true });
  const plain = P.refuseFileDrop({ types: ["text/plain"], files: [] });
  assert.equal(plain.files, false);
  assert.equal(plain.read, false);
});

test("the desk does not list user folders or read a window title", () => {
  for (const folder of ["Desktop", "Documents", "Downloads", "/home/keeper/Projects"]) {
    assert.deepEqual(P.listHostFolder(folder), { listed: false, names: [] });
  }
  const row = {
    title: "homework.docx — Notepad",
    document: "homework.docx",
    path: "C:\\Users\\keeper\\Desktop\\homework.docx",
  };
  assert.equal(P.windowCaption(row), null);
  assert.equal(P.hostPathLabel(row.path, false), "");
  assert.equal(P.hostPathLabel(row.path, true), row.path);
  const src = readSource(join(root, "src/lib/pets/presence.ts"));
  assert.doesNotMatch(src, /readdir|showDirectoryPicker|webkitdirectory|getDirectory/);
});

test("a focused field keeps the key, and a key outside it is not logged", () => {
  let reads = 0;
  const field = {
    get key() {
      reads += 1;
      return "hunter2";
    },
    target: { tagName: "INPUT" },
  };
  const noted = P.classifyKey(field);
  assert.deepEqual(noted, { record: false, field: true, toggle: false });
  assert.equal(reads, 0);
  assert.equal(JSON.stringify(noted).includes("hunter2"), false);

  const ignored = P.classifyKey({ key: "hunter2", target: { tagName: "BODY" } });
  assert.deepEqual(ignored, { record: false, field: false, toggle: false });
  assert.equal(JSON.stringify(ignored).includes("hunter2"), false);
  const buf = [];
  assert.deepEqual(P.recordKeystroke(buf, { key: "hunter2" }), { record: false, keys: [] });
  assert.deepEqual(buf, []);
  const dismiss = P.classifyKey({ key: "Escape", target: { tagName: "DIV" } });
  assert.deepEqual(dismiss, { record: false, field: false, toggle: "dismiss" });
  assert.equal(JSON.stringify(dismiss).includes("Escape"), false);
  assert.equal(P.classifyKey({ key: "Escape", target: { tagName: "TEXTAREA" } }).field, true);
  assert.match(room, /classifyKey\(e\)/);
  const src = readSource(join(root, "src/lib/pets/presence.ts"));
  assert.doesNotMatch(src, /SetWindowsHook|globalShortcut|keylog|uiohook|localStorage/);
});

test("the living desk and /demo install the drop guard", () => {
  assert.match(room, /installFileDropGuard/);
  assert.match(demo, /CompanionRoom/);
  const src = readSource(join(root, "src/lib/pets/presence.ts"));
  assert.doesNotMatch(src, /getData|getAsFile|FileReader|showOpenFilePicker|webkitdirectory/);
});
