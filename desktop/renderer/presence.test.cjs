const assert = require("node:assert/strict");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { test } = require("node:test");
const Presence = require("../presence.cjs");
const Guard = require("./presence.js");
const { readSource } = require("../test-source.cjs");

const mainSrc = readSource(join(__dirname, "..", "main.cjs"));
const preloadSrc = readSource(join(__dirname, "..", "preload.cjs"));
const sealSrc = readSource(join(__dirname, "..", "presence", "open-link.cjs"));
const petSrc = readSource(join(__dirname, "pet.js"));
const htmlSrc = readSource(join(__dirname, "index.html"));
const settingsSrc = readSource(join(__dirname, "settings.html"));
const enumSrc = readSource(join(__dirname, "..", "windows-enum.cjs"));
const guardSrc = readSource(join(__dirname, "presence.js"));
const areasSrc = readSource(join(__dirname, "weather-areas.js"));
const webSrc = readSource(join(__dirname, "..", "..", "web", "src", "lib", "pets", "presence.ts"));
const roomSrc = readSource(join(__dirname, "..", "..", "web", "src", "components", "desk", "companion-room.tsx"));
const pySrc = readSource(join(__dirname, "..", "..", "client", "computerpets_client", "presence.py"));
const appSrc = readSource(join(__dirname, "..", "..", "client", "computerpets_client", "app.py"));

test("presence writes stay inside userData house files", () => {
  const home = join(tmpdir(), "computerpets-user");
  const card = Presence.houseFile(home, "card.json");
  const mind = Presence.houseFile(home, "mind.json");
  assert.equal(card, join(home, "card.json"));
  assert.equal(mind, join(home, "mind.json"));
  assert.equal(Presence.houseFile(home, "../secrets.txt"), null);
  assert.equal(Presence.houseFile(home, "..\\secrets.txt"), null);
  assert.equal(Presence.houseFile(home, "/etc/passwd"), null);
  assert.equal(Presence.houseFile(home, "C:\\Windows\\win.ini"), null);
  assert.equal(Presence.houseFile(home, "Desktop/homework.txt"), null);
  assert.equal(Presence.houseFile(home, "Desktop\\homework.txt"), null);
  assert.equal(Presence.houseFile(home, "hwid.txt"), null);
  assert.deepEqual(Presence.readMachineMark(), { read: false, raw: null, id: "" });
  assert.deepEqual(Guard.readMachineMark(), { read: false, raw: null, id: "" });
  assert.equal(Presence.houseFile("", "card.json"), null);
  assert.equal(Presence.houseFile(home, "card.json/../../x"), null);
});

test("in-page navigation is refused, including a dropped file URL", () => {
  assert.equal(Presence.allowNavigation(), false);
  assert.equal(Presence.allowNavigation("file:///home/keeper/homework.html"), false);
  assert.equal(Presence.allowNavigation("https://evil.example/exfil"), false);
});

test("clipboard, screen capture, and the file system stay denied; geolocation is not a standing grant", () => {
  Presence.clearWeatherLocate();
  assert.equal(Presence.allowPermission("geolocation", 1_000), false);
  assert.equal(Presence.armWeatherLocate(1_000), 1_000 + Presence.WEATHER_LOCATE_MS);
  assert.equal(Presence.allowPermission("geolocation", 1_000), true);
  assert.equal(Presence.allowPermission("clipboard-read", 1_000), false);
  assert.equal(Presence.allowPermission("geolocation", 1_000 + Presence.WEATHER_LOCATE_MS), false);
  Presence.clearWeatherLocate();
  assert.equal(Presence.allowPermission("geolocation", 1_500), false);
  for (const name of ["clipboard-read", "clipboard-sanitized-write", "display-capture", "media", "keyboardLock", "fileSystem", "midi", ""]) {
    assert.equal(Presence.allowPermission(name, 1_000), false, name);
  }
});

test("a weather read asks once, then the grant closes, and it does not watch", async () => {
  Presence.clearWeatherLocate();
  Presence.holdWeatherLocate();
  let watched = 0;
  const seen = [];
  const geo = {
    getCurrentPosition(ok, _err, opts) {
      seen.push(opts);
      assert.equal(Presence.allowPermission("geolocation"), true);
      ok({ coords: { latitude: 47.6, longitude: -122.3 } });
    },
    watchPosition() {
      watched += 1;
    },
  };
  const log = [];
  const silent = await Presence.readWeatherHere(geo, {
    arm() {
      log.push("arm");
    },
  });
  assert.equal(silent, null);
  assert.equal(seen.length, 0);
  assert.deepEqual(log, []);
  Presence.noteWeatherLocateYes();
  const fix = await Presence.readWeatherHere(geo, {
    arm() {
      log.push("arm");
    },
    clear() {
      log.push("clear");
    },
  });
  assert.deepEqual(fix, { lat: 47.6, lon: -122.3 });
  assert.deepEqual(log, ["arm", "clear"]);
  assert.equal(seen.length, 1);
  assert.equal(seen[0].maximumAge, 0);
  assert.equal(seen[0].enableHighAccuracy, false);
  assert.equal(watched, 0);
  assert.equal(Presence.allowPermission("geolocation"), false);
  assert.equal(Presence.ipPlace(), null);
  assert.equal(Presence.ipPlace(true), null);
  assert.equal(Guard.ipPlace(), null);
  assert.equal(Guard.ipPlace(true), null);

  const missed = await Presence.readWeatherHere(null);
  assert.equal(missed, null);
  assert.equal(Presence.allowPermission("geolocation"), false);

  const pageOpts = [];
  Guard.holdWeatherLocate();
  const pageSilent = await Guard.readWeatherHere(geo);
  assert.equal(pageSilent, null);
  assert.equal(seen.length, 1);
  Guard.noteWeatherLocateYes();
  const page = await Guard.readWeatherHere(
    {
      getCurrentPosition(ok, _err, opts) {
        pageOpts.push(opts);
        ok({ coords: { latitude: 1, longitude: 2 } });
      },
      watchPosition() {
        watched += 1;
      },
    },
    {
      arm() {
        log.push("page-arm");
      },
      clear() {
        log.push("page-clear");
      },
    },
  );
  assert.deepEqual(page, { lat: 1, lon: 2 });
  assert.equal(pageOpts[0].maximumAge, 0);
  assert.equal(watched, 0);
  assert.deepEqual(log.slice(-2), ["page-arm", "page-clear"]);
});

test("a second locate in the session needs a fresh in-app yes", async () => {
  Presence.holdWeatherLocate();
  Guard.holdWeatherLocate();
  let calls = 0;
  let armed = 0;
  const geo = {
    getCurrentPosition(ok) {
      calls += 1;
      ok({ coords: { latitude: 47.61, longitude: -122.33 } });
    },
  };
  const hooks = {
    arm() {
      armed += 1;
    },
    clear() {},
  };
  assert.equal(await Presence.readWeatherHere(geo, hooks), null);
  assert.equal(calls, 0);
  assert.equal(armed, 0);
  assert.equal(Presence.allowPermission("geolocation"), false);

  Presence.noteWeatherLocateYes();
  const first = await Presence.readWeatherHere(geo, hooks);
  assert.deepEqual(first, { lat: 47.61, lon: -122.33 });
  assert.equal(calls, 1);
  assert.equal(armed, 1);
  assert.equal(Presence.allowPermission("geolocation"), false);

  assert.equal(await Presence.readWeatherHere(geo, hooks), null);
  assert.equal(calls, 1);
  assert.equal(armed, 1);

  Presence.noteWeatherLocateYes();
  Presence.holdWeatherLocate();
  assert.equal(await Presence.readWeatherHere(geo, hooks), null);
  assert.equal(calls, 1);

  Presence.noteWeatherLocateYes();
  const second = await Presence.readWeatherHere(geo, hooks);
  assert.deepEqual(second, { lat: 47.61, lon: -122.33 });
  assert.equal(calls, 2);
  assert.equal(armed, 2);

  Guard.noteWeatherLocateYes();
  let pageCalls = 0;
  const page = await Guard.readWeatherHere({
    getCurrentPosition(ok) {
      pageCalls += 1;
      ok({ coords: { latitude: 1, longitude: 2 } });
    },
  });
  assert.deepEqual(page, { lat: 1, lon: 2 });
  assert.equal(await Guard.readWeatherHere(geo), null);
  assert.equal(pageCalls, 1);
  Guard.noteWeatherLocateYes();
  Guard.holdWeatherLocate();
  assert.equal(await Guard.readWeatherHere(geo), null);
  assert.equal(pageCalls, 1);
});

test("window payloads stay rects — titles and paths are dropped", () => {
  const scrubbed = Presence.scrubWindows([
    {
      id: "9",
      x: 10,
      y: 20,
      width: 300,
      height: 200,
      title: "homework.docx — Notepad",
      className: "CabinetWClass",
      path: "C:\\Users\\keeper\\Desktop\\homework.docx",
    },
    { id: "", x: 1, y: 1, width: 1, height: 1 },
  ]);
  assert.deepEqual(scrubbed, [{ id: "9", x: 10, y: 20, width: 300, height: 200 }]);
  assert.equal(JSON.stringify(scrubbed).includes("homework"), false);
  assert.equal(JSON.stringify(scrubbed).includes("Cabinet"), false);
});

test("presence does not list Desktop, Documents, or Downloads", () => {
  for (const folder of ["Desktop", "Documents", "Downloads", "C:\\Users\\keeper\\Pictures", "/home/keeper/Projects"]) {
    const listed = Presence.listHostFolder(folder);
    assert.deepEqual(listed, { listed: false, names: [] });
  }
  assert.doesNotMatch(readSource(join(__dirname, "..", "presence.cjs")), /readdir|readdirSync|Get-ChildItem|listdir/);
});

test("a window caption is never a title, and a path needs consent", () => {
  const row = {
    title: "homework.docx — Notepad",
    document: "homework.docx",
    path: "C:\\Users\\keeper\\Documents\\homework.docx",
    className: "CabinetWClass",
  };
  assert.equal(Presence.windowCaption(row), null);
  assert.equal(Presence.hostPathLabel(row.path, false), "");
  assert.equal(Presence.hostPathLabel(row.path, undefined), "");
  assert.equal(Presence.hostPathLabel(row.path, true), row.path);
  assert.equal(Presence.hostPathLabel("  ", true), "");
});

test("a focused field keeps the key, and a key outside it is not logged", () => {
  let fieldReads = 0;
  const field = {
    get key() {
      fieldReads += 1;
      return "hunter2";
    },
    target: { tagName: "INPUT" },
  };
  const noted = Presence.classifyKey(field);
  assert.deepEqual(noted, { record: false, field: true, toggle: false });
  assert.equal(fieldReads, 0);
  assert.equal(JSON.stringify(noted).includes("hunter2"), false);

  let logReads = 0;
  const outside = {
    get key() {
      logReads += 1;
      return "hunter2";
    },
    target: { tagName: "BODY" },
  };
  const ignored = Presence.classifyKey(outside);
  assert.deepEqual(ignored, { record: false, field: false, toggle: false });
  assert.equal(JSON.stringify(ignored).includes("hunter2"), false);
  const buf = [];
  const logged = Presence.recordKeystroke(buf, outside);
  assert.deepEqual(logged, { record: false, keys: [] });
  assert.deepEqual(buf, []);
  assert.equal(logReads, 1);

  const dismiss = Presence.classifyKey({ key: "Escape", target: { tagName: "DIV" } });
  assert.deepEqual(dismiss, { record: false, field: false, toggle: "dismiss" });
  assert.equal(JSON.stringify(dismiss).includes("Escape"), false);
  const inField = Presence.classifyKey({ key: "Escape", target: { tagName: "TEXTAREA" } });
  assert.equal(inField.field, true);
  assert.equal(inField.toggle, false);

  const guardNote = Guard.classifyKey({ key: "q", target: { tagName: "SELECT" } });
  assert.deepEqual(guardNote, { record: false, field: true, toggle: false });
  assert.deepEqual(Guard.recordKeystroke(["q"], { key: "q" }), { record: false, keys: [] });
  assert.doesNotMatch(readSource(join(__dirname, "..", "presence.cjs")), /SetWindowsHook|globalShortcut|keylog|uiohook/);
  assert.doesNotMatch(guardSrc, /SetWindowsHook|globalShortcut|keylog|uiohook|localStorage/);
});

test("a host file drop is not a gift and is not read", () => {
  const file = Presence.refuseFileDrop({ types: ["Files", "text/uri-list"], fileCount: 1 });
  assert.deepEqual(file, { accept: false, read: false, files: true });
  const uri = Presence.refuseFileDrop({ types: ["text/uri-list"], files: { length: 0 } });
  assert.equal(uri.files, true);
  assert.equal(uri.read, false);
  const text = Presence.refuseFileDrop({ types: ["text/plain"], files: { length: 0 } });
  assert.equal(text.files, false);
  assert.equal(text.read, false);
  assert.equal(Guard.hasHostFiles({ types: ["Files"], files: { length: 1 } }), true);
  assert.equal(Guard.hasHostFiles({ types: ["text/plain"], files: { length: 0 } }), false);
});

test("install cancels a file drop and does not read the path", () => {
  const events = {};
  const node = {
    addEventListener(type, fn) {
      events[type] = fn;
    },
    removeEventListener() {},
  };
  const stop = Guard.install(node);
  let prevented = false;
  const transfer = { types: ["Files", "text/uri-list"], files: { length: 1 }, dropEffect: "copy" };
  events.drop({
    dataTransfer: transfer,
    preventDefault() {
      prevented = true;
    },
    stopPropagation() {},
  });
  assert.equal(prevented, true);
  assert.equal(transfer.dropEffect, "none");
  assert.equal(Object.prototype.hasOwnProperty.call(transfer, "path"), false);
  events.dragover({
    dataTransfer: { types: ["text/plain"], files: { length: 0 } },
    preventDefault() {
      throw new Error("plain text is not a host file");
    },
    stopPropagation() {},
  });
  stop();
});

test("the drop guard never reads a path or the file bytes", () => {
  assert.doesNotMatch(guardSrc, /getData|getAsFile|FileReader|readAsText|getPathForFile|webUtils|showOpenFilePicker/);
  assert.match(guardSrc, /dropEffect = "none"/);
  assert.match(htmlSrc, /presence\.js/);
  assert.match(settingsSrc, /presence\.js/);
});

test("overlay main seals navigation and permissions and scrubs window rows", () => {
  assert.match(mainSrc, /sealDeskContents/);
  assert.match(mainSrc, /OpenLink\.sealContents\(contents, \{\s*presence: Presence,/);
  assert.match(sealSrc, /will-navigate/);
  assert.match(sealSrc, /will-redirect/);
  assert.match(sealSrc, /will-frame-navigate/);
  assert.match(sealSrc, /setWindowOpenHandler/);
  assert.match(sealSrc, /action: "deny"/);
  assert.match(sealSrc, /setPermissionRequestHandler/);
  assert.match(sealSrc, /setPermissionCheckHandler/);
  assert.match(sealSrc, /presence\.allowPermission/);
  assert.match(mainSrc, /weather-locate-arm/);
  assert.match(mainSrc, /weather-locate-clear/);
  assert.match(mainSrc, /weatherLocateSender/);
  assert.match(preloadSrc, /armWeatherLocate/);
  assert.match(preloadSrc, /clearWeatherLocate/);
  assert.match(petSrc, /readWeatherHere/);
  assert.match(petSrc, /armWeatherLocate/);
  assert.match(petSrc, /ipPlace\(/);
  assert.match(petSrc, /locateGate/);
  assert.match(petSrc, /sharePlace/);
  assert.match(petSrc, /storedLivePinNeedsFuzz/);
  assert.match(htmlSrc, /this click sends a place to the forecast host\./);
  assert.match(htmlSrc, /aria-describedby="weather-here-send"/);
  assert.match(htmlSrc, /id="weather-here-ask"/);
  assert.match(htmlSrc, /id="weather-here-yes"/);
  assert.match(htmlSrc, /id="weather-here-no"/);
  assert.match(htmlSrc, /send a place from this computer\? a prior browser allow can satisfy the next locate without a new os or browser prompt\. the house still asks in the app\. this house cannot revoke that grant\./);
  const hereAt = petSrc.indexOf('getElementById("weather-here");');
  const yesAt = petSrc.indexOf('getElementById("weather-here-yes")');
  const hereBody = petSrc.slice(hereAt, yesAt);
  assert.match(hereBody, /locateGate\(card, false\)/);
  assert.doesNotMatch(hereBody, /readWeatherHere|armWeatherLocate|reverseUrl/);
  const yesBody = petSrc.slice(yesAt, yesAt + 1100);
  assert.match(yesBody, /locateGate\(card, true\)/);
  assert.match(yesBody, /noteWeatherLocateYes/);
  assert.ok(yesBody.indexOf("locateGate") < yesBody.indexOf("noteWeatherLocateYes"));
  assert.ok(yesBody.indexOf("noteWeatherLocateYes") < yesBody.indexOf("sendLiveFix"));
  assert.doesNotMatch(yesBody, /readWeatherHere/);
  const noAt = petSrc.indexOf('getElementById("weather-here-no")');
  const noBody = petSrc.slice(noAt, noAt + 450);
  assert.match(noBody, /holdWeatherLocate/);
  assert.doesNotMatch(noBody, /readWeatherHere|noteWeatherLocateYes|getCurrentPosition/);
  const toggleAt = petSrc.indexOf('closest("#weather-toggle")');
  const toggleBody = petSrc.slice(toggleAt, toggleAt + 550);
  assert.doesNotMatch(toggleBody, /noteWeatherLocateYes|holdWeatherLocate|readWeatherHere|getCurrentPosition|armWeatherLocate/);
  const sendAt = petSrc.indexOf("function sendLiveFix");
  const sendBody = petSrc.slice(sendAt, hereAt);
  assert.match(sendBody, /readWeatherHere/);
  assert.ok(sendBody.indexOf("sharePlace") < sendBody.indexOf("reverseUrl"));
  assert.match(sendBody, /geocodeHonesty\("reverse"\)/);
  assert.match(sendBody, /geocodeMaySend\("reverse"/);
  assert.ok(sendBody.indexOf('geocodeHonesty("reverse")') < sendBody.indexOf("reverseUrl"));
  assert.ok(sendBody.indexOf('geocodeMaySend("reverse"') < sendBody.indexOf("reverseUrl"));
  assert.ok(sendBody.indexOf("reverseUrl") < sendBody.indexOf("readReverse(shown"));
  assert.doesNotMatch(sendBody, /fetch\(/);
  assert.doesNotMatch(sendBody, /latitude=\$\{fix|longitude=\$\{fix/);
  assert.equal(require("./weather-areas.js").HERE_SEND, "this click sends a place to the forecast host.");
  assert.equal(require("./weather-areas.js").HERE_YES, "Send the place");
  assert.equal(require("./weather-areas.js").SAVED_HERE_YES, "Use this saved place");
  assert.match(htmlSrc, /id="weather-saved-ask"/);
  assert.match(htmlSrc, /id="weather-saved-yes"/);
  assert.match(htmlSrc, /id="weather-saved-no"/);
  assert.match(htmlSrc, /use this saved computer place for the forecast\? this sends the saved place\. this computer's network address goes with the https request, as any client\. it does not locate again\./);
  assert.match(htmlSrc, /id="weather-forecast-net"/);
  assert.match(htmlSrc, /id="weather-geocode-net"/);
  assert.match(htmlSrc, /id="weather-reverse-net"/);
  assert.match(htmlSrc, /this look-up sends the typed name\. this computer's network address goes with the https request to the geocode host, as any client\./);
  assert.match(htmlSrc, /this reverse lookup sends the rounded place\. this computer's network address goes with the https request to the geocode host, as any client\./);
  const bodyAt = htmlSrc.indexOf('id="weather-body"');
  const savedAskAt = htmlSrc.indexOf('id="weather-saved-ask"');
  const newsAt = htmlSrc.indexOf('id="news-plate"');
  assert.ok(bodyAt < savedAskAt && savedAskAt < newsAt);
  const fetchAt = petSrc.indexOf("function fetchWeather");
  const fetchBody = petSrc.slice(fetchAt, fetchAt + 1600);
  assert.match(fetchBody, /forecastGate\(card, card\.hereForecastAck\)/);
  assert.ok(fetchBody.indexOf("forecastGate") < fetchBody.indexOf("forecastUrl"));
  assert.match(fetchBody, /forecastMaySend/);
  assert.match(fetchBody, /forecastLineInView/);
  assert.ok(fetchBody.indexOf("forecastMaySend") < fetchBody.indexOf("forecastUrl"));
  assert.ok(fetchBody.indexOf("forecastHonesty") < fetchBody.indexOf("forecastUrl"));
  assert.ok(fetchBody.indexOf("forecastUrl") < fetchBody.indexOf("readForecast(line"));
  assert.match(fetchBody, /forecastMayLeave/);
  assert.match(fetchBody, /json == null/);
  assert.match(fetchBody, /weatherUnread = true/);
  assert.doesNotMatch(fetchBody, /fetch\(/);
  assert.doesNotMatch(fetchBody, /reverseUrl|readWeatherHere|armWeatherLocate|getCurrentPosition|noteWeatherLocateYes|geocodeUrl/);
  assert.match(areasSrc, /WEATHER_TIMEOUT_MS/);
  assert.match(areasSrc, /AbortController/);
  assert.match(areasSrc, /WeatherTimeout/);
  assert.equal(require("./weather-areas.js").WEATHER_TIMEOUT_MS, 12_000);
  const newsSrc = readSource(join(__dirname, "news.js"));
  assert.match(newsSrc, /NEWS_TIMEOUT_MS/);
  assert.match(newsSrc, /AbortController/);
  assert.match(newsSrc, /NewsTimeout/);
  assert.equal(require("./news.js").NEWS_TIMEOUT_MS, 12_000);
  const marketSrc = readSource(join(__dirname, "market.js"));
  assert.match(marketSrc, /QUOTE_TIMEOUT_MS/);
  assert.match(marketSrc, /AbortController/);
  assert.match(marketSrc, /QuoteTimeout/);
  assert.equal(require("./market.js").QUOTE_TIMEOUT_MS, 12_000);
  const radioSrc = readSource(join(__dirname, "house-music.js"));
  assert.match(radioSrc, /RADIO_TIMEOUT_MS/);
  assert.match(radioSrc, /AbortController/);
  assert.match(radioSrc, /RadioTimeout/);
  assert.equal(require("./house-music.js").RADIO_TIMEOUT_MS, 12_000);
  const beatAt = petSrc.indexOf("setInterval(readHeartbeat");
  assert.doesNotMatch(petSrc.slice(beatAt, beatAt + 80), /readWeatherHere|noteWeatherLocateYes|getCurrentPosition|armWeatherLocate/);
  const gpuAt = petSrc.indexOf("setInterval(() => {\n  if (!window.PetGpu");
  assert.ok(gpuAt > 0, "the GPU tick is found");
  assert.doesNotMatch(petSrc.slice(gpuAt, gpuAt + 500), /readWeatherHere|noteWeatherLocateYes|getCurrentPosition|armWeatherLocate/);
  const lifeAt = petSrc.indexOf("setInterval(() => {\n  if (document.hidden || !kind || !life)");
  assert.ok(lifeAt > 0, "the life tick is found");
  assert.ok(lifeAt > petSrc.indexOf("function sendLiveFix"));
  assert.doesNotMatch(petSrc.slice(lifeAt), /readWeatherHere|noteWeatherLocateYes|getCurrentPosition|armWeatherLocate/);
  assert.doesNotMatch(petSrc.slice(lifeAt), /forecastUrl\(/);
  assert.doesNotMatch(petSrc.slice(lifeAt), /geocodeUrl\(|reverseUrl\(/);
  const addAt = petSrc.indexOf('e.target.id !== "weather-add"');
  const showAskAt = petSrc.indexOf("function showHereAsk");
  const addBody = petSrc.slice(addAt, showAskAt);
  assert.match(addBody, /geocodeHonesty\("look"\)/);
  assert.match(addBody, /geocodeMaySend\("look"/);
  assert.ok(addBody.indexOf('geocodeHonesty("look")') < addBody.indexOf("geocodeUrl"));
  assert.ok(addBody.indexOf('geocodeMaySend("look"') < addBody.indexOf("geocodeUrl"));
  assert.ok(addBody.indexOf("geocodeUrl") < addBody.indexOf("readGeocode(shown"));
  assert.match(addBody, /json == null/);
  assert.match(addBody, /CANT_REACH/);
  assert.doesNotMatch(addBody, /fetch\(/);
  assert.doesNotMatch(addBody, /reverseUrl|readWeatherHere|getCurrentPosition|noteWeatherLocateYes/);
  assert.equal(petSrc.split("geocodeUrl(").length - 1, 1);
  assert.equal(petSrc.split("reverseUrl(").length - 1, 1);
  const savedYesAt = petSrc.indexOf('getElementById("weather-saved-yes")');
  const savedYesBody = petSrc.slice(savedYesAt, savedYesAt + 700);
  assert.match(savedYesBody, /forecastGate\(card, card\.hereForecastAck\)/);
  assert.match(savedYesBody, /ackSavedHere\(card\)/);
  assert.ok(savedYesBody.indexOf("ackSavedHere") < savedYesBody.indexOf("fetchWeather"));
  assert.doesNotMatch(savedYesBody, /readWeatherHere|armWeatherLocate|reverseUrl|getCurrentPosition/);
  assert.match(petSrc, /ackSavedHere\(house\)/);
  assert.doesNotMatch(petSrc, /getCurrentPosition|watchPosition|maximumAge:\s*600/);
  assert.doesNotMatch(petSrc, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  assert.doesNotMatch(areasSrc, /ipwho\.is|ip-api\.com|ipinfo\.io|ipapi\.co|ipPlaceUrl|parseIpPlace/);
  assert.doesNotMatch(guardSrc, /ipwho\.is|ip-api\.com|ipinfo\.io|fetch\(/);
  assert.match(guardSrc, /function ipPlace/);
  assert.doesNotMatch(guardSrc, /watchPosition/);
  assert.match(guardSrc, /maximumAge: 0/);
  assert.doesNotMatch(settingsSrc, /armWeatherLocate|getCurrentPosition|watchPosition/);
  assert.match(mainSrc, /Presence\.scrubWindows/);
  assert.match(mainSrc, /Presence\.houseFile/);
  assert.doesNotMatch(mainSrc, /clipboard|globalShortcut|desktopCapturer|getPathForFile|showOpenDialog|SetWindowsHook|uiohook|before-input-event/);
  assert.doesNotMatch(preloadSrc, /clipboard|getPathForFile|showOpenFilePicker|readFile/);
  assert.doesNotMatch(petSrc, /dataTransfer|getPathForFile|showOpenFilePicker|clipboard|desktopCapturer/);
  assert.doesNotMatch(enumSrc, /GetWindowText|desktopCapturer|PrintWindow|BitBlt|GetDC/);
  assert.doesNotMatch(enumSrc, /Get-ChildItem|Directory\.GetFiles|Environment\.GetFolderPath|SpecialFolder|KnownFolder|cls\.Replace/);
  assert.match(enumSrc, /shell \? "1" : "0"/);
  const newsFnAt = petSrc.indexOf("function fetchNews");
  const marketFnAt = petSrc.indexOf("function fetchMarket");
  const newsBody = petSrc.slice(newsFnAt, marketFnAt);
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("popularRssUrl"));
  assert.ok(newsBody.indexOf("newsLineInView") < newsBody.indexOf("popularRssUrl"));
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("readRss(line"));
  assert.ok(newsBody.indexOf("newsMaySend") < newsBody.indexOf("readFeatured(line)"));
  assert.doesNotMatch(newsBody, /fetch\(N\.newsUrl\(/);
  assert.doesNotMatch(newsBody, /fetch\(url\)\.then\(\(r\) => r\.text\(\)\)/);
  const marketBody = petSrc.slice(marketFnAt, petSrc.indexOf("function sitSleepAid"));
  assert.ok(marketBody.indexOf("quoteMaySend") < marketBody.indexOf("readGeckoMany(line"));
  assert.ok(marketBody.indexOf("readTerminal(line") > marketBody.indexOf("quoteMaySend"));
  assert.ok(marketBody.indexOf("readYahoo(line") > marketBody.indexOf("quoteMaySend"));
  const radioBody = petSrc.slice(petSrc.indexOf("function lookupRadio"), petSrc.indexOf("function skyLabel"));
  assert.ok(radioBody.indexOf("radioMaySend") < radioBody.indexOf("readRadioSearch"));
  assert.doesNotMatch(radioBody, /fetch\(url,/);
  assert.match(htmlSrc, /id="news-net"/);
  assert.match(htmlSrc, /id="market-net"/);
  assert.match(htmlSrc, /id="hud-radio-net"/);
  assert.match(htmlSrc, /this find sends the station look-up\. this computer's network address goes with the https request to the radio host, as any client\./);
  const sitAt = petSrc.indexOf("function sitMusic");
  const sitBody = petSrc.slice(sitAt, petSrc.indexOf("function ruiSleepBout"));
  assert.ok(sitBody.indexOf("streamMaySend") < sitBody.indexOf("openStationStream"));
  assert.ok(sitBody.indexOf("openStationStream") < sitBody.indexOf("new Audio"));
  const playAt = petSrc.indexOf("hudMusicPlay.addEventListener");
  const playBody = petSrc.slice(playAt, playAt + 900);
  assert.ok(playBody.indexOf("streamAsked = true") < playBody.indexOf("persistCard"));
  const pickAt = petSrc.indexOf("function fillRadioHits");
  const pickBody = petSrc.slice(pickAt, petSrc.indexOf("function radioLineInView"));
  assert.ok(pickBody.indexOf("streamAsked = true") < pickBody.indexOf("persistCard"));
  const bootAt = petSrc.indexOf("window.PetRoster.loadHouseRoster");
  const bootBody = petSrc.slice(bootAt, petSrc.indexOf("bindGuiHarness"));
  assert.match(bootBody, /sitMusic\(\)/);
  assert.doesNotMatch(bootBody, /streamAsked = true/);
  assert.match(htmlSrc, /id="hud-stream-net"/);
  assert.match(petSrc, /let streamAsked = false/);
  assert.match(petSrc, /let talkAsked = false/);
  assert.match(htmlSrc, /id="hud-talk-net"/);
  const talkAt = petSrc.indexOf('if (cmd === "talk")');
  const talkBody = petSrc.slice(talkAt, talkAt + 500);
  assert.ok(talkBody.indexOf("talkHonesty") < talkBody.indexOf("askMind"));
  assert.doesNotMatch(bootBody, /talkAsked = true/);
  assert.doesNotMatch(bootBody, /askMind\(/);
  const refreshAt = petSrc.lastIndexOf("fetchNews();\n  fetchMarket();");
  assert.ok(refreshAt > 0, "the news and market refresh is found");
  assert.doesNotMatch(petSrc.slice(refreshAt - 180, refreshAt + 40), /popularRssUrl|geckoManyUrl|newsUrl\(/);
});

test("desk, demo, and blotter share the same refusal", () => {
  assert.match(webSrc, /card\.json/);
  assert.match(webSrc, /mind\.json/);
  assert.match(webSrc, /return false/);
  assert.match(webSrc, /geolocation/);
  assert.match(webSrc, /function ipPlace/);
  assert.doesNotMatch(webSrc, /ipwho\.is|ip-api\.com|ipinfo\.io|fetch\(/);
  assert.match(webSrc, /installFileDropGuard/);
  assert.match(roomSrc, /installFileDropGuard/);
  assert.match(pySrc, /card\.json/);
  assert.match(pySrc, /def allow_navigation/);
  assert.match(pySrc, /def ip_place/);
  assert.match(pySrc, /return False/);
  assert.doesNotMatch(pySrc, /ipwho|ip-api|ipinfo|urllib|requests/);
  assert.match(appSrc, /ip_place\(/);
  assert.match(appSrc, /seal_widget/);
  assert.match(appSrc, /def dragEnterEvent/);
  assert.match(appSrc, /def dropEvent/);
  assert.doesNotMatch(appSrc, /mimeData\(\)|urls\(\)/);
  assert.match(webSrc, /export function classifyKey/);
  assert.match(webSrc, /export function recordKeystroke/);
  assert.match(roomSrc, /classifyKey\(e\)/);
  assert.match(petSrc, /PetPresence\.classifyKey\(e\)/);
  assert.match(pySrc, /def classify_key/);
  assert.match(pySrc, /def record_keystroke/);
  assert.match(appSrc, /classify_key/);
  assert.match(appSrc, /record_keystroke/);
  assert.doesNotMatch(appSrc, /grabKeyboard|SetWindowsHook|pynput|keyPressEvent|installEventFilter/);
  assert.doesNotMatch(petSrc, /recordKeystroke|keylog|SetWindowsHook/);
  assert.doesNotMatch(roomSrc, /recordKeystroke|keylog/);
  const listenerAt = petSrc.indexOf('document.addEventListener("keydown"');
  const listener = petSrc.slice(listenerAt, listenerAt + 420);
  assert.match(listener, /classifyKey\(e\)/);
  assert.equal(listener.slice(0, listener.indexOf("classifyKey")).includes("e.key"), false);
});
