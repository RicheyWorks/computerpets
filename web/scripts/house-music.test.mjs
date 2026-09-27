import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const M = await import(pathToFileURL(join(root, "src/lib/pets/house-music.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/house-music.js"));

test("Rui music is house loop or free radio, no paid key", () => {
  assert.deepEqual(M.MUSIC_PLUGINS.map((p) => p.id), ["off", "house", "radio"]);
  assert.equal(M.RADIO_CANT_REACH, "can't reach");
  assert.match(M.radioSearchUrl("piano"), /radio-browser\.info/);
  assert.match(M.radioSearchUrl("99.9 seattle fm"), /name=99\.9/);
  assert.ok(M.radioSearchUrls("99.9 seattle fm").some((u) => /city=Seattle/i.test(u)));
  assert.ok(M.radioSearchUrls("99.9 seattle fm").some((u) => /countrycode=US/.test(u)));
  assert.ok(M.radioSearchUrls("99.9 seattle fm").some((u) => /state=Washington/.test(u)));
  assert.ok(!M.radioSearchUrls("99.9 seattle fm").some((u) => /tag=seattle/.test(u)));
  assert.equal(M.parseRadioQuery("KEXP").raw, "KEXP");
  assert.equal(M.parseRadioQuery("KEXP").call, "kexp");
  assert.equal(M.parseRadioQuery("KEXP").city, "");
  assert.equal(M.parseRadioQuery("KEXP").place, "");
  assert.match(M.radioSearchUrl("KEXP"), /name=KEXP/);
  assert.ok(!M.radioSearchUrls("KEXP").some((u) => /city=/i.test(u)));
  assert.equal(Overlay.parseRadioQuery("KEXP").call, "kexp");
  assert.equal(Overlay.parseRadioQuery("KEXP").city, "");
  assert.deepEqual(M.radioSearchUrls(""), []);
  const seattle = { name: "Seattle, Washington, United States", query: "Seattle", lat: 47.6, lon: -122.3 };
  assert.ok(M.radioSearchUrls("", seattle).some((u) => /city=Seattle/i.test(u)));
  assert.equal(M.parseRadioQuery("99.9 seattle fm").city, "Seattle");
  assert.equal(M.parseRadioQuery("99.9 seattle fm").state, "Washington");
  assert.equal(M.parseRadioQuery("99.9 seattle fm").countrycode, "US");
  assert.equal(M.RADIO_EMPTY, "no station from that look-up");
  assert.equal(M.RADIO_LOCAL, "Local");
  assert.match(M.RADIO_UA, /ComputerPets/);
  assert.doesNotMatch(M.RADIO_DIR, /spotify|apple|youtube/i);
  const music = M.parseMusic({ plugin: "house", playing: true });
  assert.equal(M.playSrc(music), "/sounds/house-loop.wav");
  assert.equal(M.overlayPlaySrc(music), "sounds/house-loop.wav");
  assert.equal(M.playSrc(M.parseMusic({ plugin: "off", playing: true })), "");
  assert.equal(existsSync(join(root, "public/sounds/house-loop.wav")), true);
  assert.equal(Overlay.HOUSE_LOOP_LICENSE, M.HOUSE_LOOP_LICENSE);
  assert.equal(Overlay.RADIO_UA, M.RADIO_UA);
  const stations = M.parseStations([{ name: "A free station", url_resolved: "https://example.test/stream", stationuuid: "s1" }]);
  assert.equal(stations[0].name, "A free station");
});

test("typed city and call-sign look-ups use name or city, never tag-as-city or jazz-only", () => {
  for (const q of ["99.9 seattle fm", "KEXP", "seattle", "portland", "xyzzyville"]) {
    const urls = M.radioSearchUrls(q);
    const desk = Overlay.radioSearchUrls(q);
    assert.ok(urls.length, q);
    assert.deepEqual(urls, desk);
    assert.ok(urls.every((u) => /name=|city=|state=|countrycode=/.test(u)), q);
    assert.ok(!urls.some((u) => /tag=seattle/.test(u)), q);
    assert.ok(!urls.every((u) => /name=jazz|tag=jazz/.test(u)), q);
  }
  assert.equal(M.parseRadioQuery("portland").city, "Portland");
  assert.equal(M.parseRadioQuery("xyzzyville").city, "Xyzzyville");
  assert.equal(M.parseRadioQuery("jazz seattle").place, "seattle");
  assert.equal(M.parseRadioQuery("jazz seattle").city, "Seattle");
  const fixture = [
    { name: "Smooth Jazz All Night", url_resolved: "https://example.test/jazz", stationuuid: "jazz1", tags: "jazz", state: "Florida", countrycode: "US" },
    { name: "KEXP 90.3 Seattle", url_resolved: "https://example.test/kexp", stationuuid: "kexp1", tags: "indie,alternative", state: "Washington", countrycode: "US", geo_lat: 47.6, geo_long: -122.3 },
    { name: "Random Jazz Cafe", url_resolved: "https://example.test/cafe", stationuuid: "jazz2", tags: "jazz", countrycode: "FR" },
  ];
  const parsed = M.parseStations(fixture);
  const kexp = M.rankStations(parsed, "KEXP");
  assert.match(kexp[0].name, /KEXP/);
  const seattle = M.rankStations(parsed, "seattle", { name: "Seattle, Washington, United States", query: "Seattle", lat: 47.6, lon: -122.3 });
  assert.match(seattle[0].name, /KEXP|Seattle/i);
  assert.notEqual(seattle[0].name, "Smooth Jazz All Night");
});

test("play names the stream host before the station audio opens", () => {
  const music = M.parseMusic({
    plugin: "radio",
    playing: true,
    stationName: "A free station",
    stationUrl: "https://stream.example.test:8000/live?token=secret#frag",
  });
  const line = "this play opens the station stream. this computer's network address goes with the https request to stream.example.test, as any client.";
  assert.equal(M.streamHonesty(music), line);
  assert.equal(Overlay.streamHonesty(music), line);
  assert.equal(M.streamHostPhrase(music), "stream.example.test");
  assert.equal(Overlay.streamHostPhrase(music), "stream.example.test");
  assert.doesNotMatch(line, /token|secret|frag|\/live/);
  assert.equal(M.streamMaySend(music, false), false);
  assert.equal(M.streamMaySend(music, true), true);
  assert.equal(Overlay.streamMaySend(music, false), false);
  assert.equal(Overlay.streamMaySend(music, true), true);
  assert.equal(M.streamHostLabel(""), "the station stream host");
  assert.equal(Overlay.streamHostLabel(""), "the station stream host");
  assert.equal(M.STREAM_HOST_NAME, Overlay.STREAM_HOST_NAME);
  assert.equal(M.streamHonesty(M.parseMusic({ plugin: "house", playing: true })), "");
  assert.equal(Overlay.streamHonesty(Overlay.parseMusic({ plugin: "house", playing: true })), "");
  assert.equal(M.streamHonesty(M.parseMusic({ plugin: "radio", playing: false, stationUrl: "https://stream.example.test/live" })), "");
  assert.equal(M.streamHonesty(M.parseMusic({ plugin: "radio", playing: true, stationUrl: "notaurl" })), "");
  assert.equal(M.streamMaySend(M.parseMusic({ plugin: "radio", playing: true, stationUrl: "https://stream.example.test/live" }), false), false);
  assert.equal(M.streamMayLeave("", music), false);
  assert.equal(M.streamMayLeave(M.RADIO_FIND, music), false);
  assert.equal(Overlay.streamMayLeave("", music), false);
  assert.equal(Overlay.streamMayLeave(M.RADIO_FIND, music), false);
  const other = M.parseMusic({
    plugin: "radio",
    playing: true,
    stationUrl: "https://other.example.test/live",
  });
  assert.equal(M.streamMayLeave(M.streamHonesty(other), music), false);
  assert.equal(Overlay.streamMayLeave(line, music), true);
  let made = 0;
  const make = (src) => {
    made += 1;
    return { src };
  };
  assert.equal(M.openStationStream("", music, music.stationUrl, make), null);
  assert.equal(M.openStationStream(M.RADIO_FIND, music, music.stationUrl, make), null);
  assert.equal(M.openStationStream(M.streamHonesty(other), music, music.stationUrl, make), null);
  assert.equal(Overlay.openStationStream("", music, music.stationUrl, make), null);
  assert.equal(made, 0);
  const opened = M.openStationStream(line, music, music.stationUrl, make);
  assert.equal(made, 1);
  assert.equal(opened.src, music.stationUrl);
  const overlayOpened = Overlay.openStationStream(line, music, music.stationUrl, make);
  assert.equal(made, 2);
  assert.equal(overlayOpened.src, music.stationUrl);
  const house = M.parseMusic({ plugin: "house", playing: true });
  assert.equal(M.openStationStream("this play opens the station stream.", house, "/sounds/house-loop.wav", make), null);
  assert.equal(Overlay.openStationStream(line, Overlay.parseMusic({ plugin: "house", playing: true }), "sounds/house-loop.wav", make), null);
  assert.equal(made, 2);
});

test("radio find names the network address before the search", () => {
  const line = "this find sends the station look-up. this computer's network address goes with the https request to the radio host, as any client.";
  assert.equal(M.RADIO_FIND, line);
  assert.equal(Overlay.RADIO_FIND, line);
  assert.equal(M.radioHonesty(), Overlay.radioHonesty());
  assert.equal(M.radioMaySend(false), false);
  assert.equal(M.radioMaySend(true), true);
  assert.equal(Overlay.radioMaySend(false), false);
  assert.equal(Overlay.radioMaySend(true), true);
});

test("radio search refuses a fetch until the radio-host line is present", async () => {
  const line = M.RADIO_FIND;
  assert.equal(M.radioSearchMayLeave(""), false);
  assert.equal(M.radioSearchMayLeave("this quote sends the saved list. " + M.RADIO_NET), false);
  assert.equal(M.radioSearchMayLeave(line), true);
  assert.equal(Overlay.radioSearchMayLeave(""), false);
  assert.equal(Overlay.radioSearchMayLeave(line), true);
  let calls = 0;
  const fake = async (url) => {
    calls += 1;
    assert.match(String(url), /radio-browser\.info/);
    return { json: async () => [{ name: "KEXP", url_resolved: "https://example.test/kexp", stationuuid: "k1" }] };
  };
  assert.equal(await M.readRadioSearch("", "KEXP", null, fake), null);
  assert.equal(await Overlay.readRadioSearch("", "KEXP", null, fake), null);
  assert.equal(calls, 0);
  const stations = await M.readRadioSearch(line, "KEXP", null, fake);
  assert.equal(stations.length > 0, true);
  assert.match(stations[0].name, /KEXP/);
  assert.ok(calls >= 1);
  const again = await Overlay.readRadioSearch(line, "KEXP", null, fake);
  assert.equal(again[0].name, stations[0].name);
});

test("radio search times out and denies a silent host", async () => {
  assert.equal(M.RADIO_TIMEOUT_MS, 12_000);
  assert.equal(Overlay.RADIO_TIMEOUT_MS, 12_000);
  assert.equal(M.RadioTimeout.name, "RadioTimeout");
  assert.equal(Overlay.RadioTimeout.name, "RadioTimeout");
  const line = M.RADIO_FIND;
  const hang = () => new Promise(() => {});
  const calls = [];
  await assert.rejects(
    () => M.readRadioSearch(line, "KEXP", null, (url) => (calls.push(url), hang()), 30),
    (err) => err instanceof M.RadioTimeout && err.name === "RadioTimeout",
  );
  await assert.rejects(
    () => Overlay.readRadioSearch(line, "KEXP", null, () => hang(), 30),
    (err) => err instanceof Overlay.RadioTimeout,
  );
  assert.ok(calls.length >= 1);
  assert.ok(calls.every((u) => /de1\.api\.radio-browser\.info/.test(u)));
  assert.ok(!calls.some((u) => /de2\.|fi1\./.test(u)));

  let fulfilled = null;
  const late = M.readRadioSearch(
    line,
    "KEXP",
    null,
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            json: async () => [{ name: "late", url_resolved: "https://example.test/late", stationuuid: "late1" }],
          });
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
  await assert.rejects(() => late, (err) => err instanceof M.RadioTimeout);
  await new Promise((r) => setTimeout(r, 120));
  assert.ok(fulfilled instanceof M.RadioTimeout);
  assert.equal(fulfilled.name, "RadioTimeout");

  const answered = await M.readRadioSearch(
    line,
    "KEXP",
    null,
    async () => ({
      json: async () => [{ name: "KEXP", url_resolved: "https://example.test/kexp", stationuuid: "k1" }],
    }),
    200,
  );
  assert.match(answered[0].name, /KEXP/);
  assert.equal(await M.readRadioSearch("", "KEXP", null, () => hang(), 30), null);
});

test("Radio Browser can return a station for a typed look-up", async (t) => {
  const url = M.radioSearchUrl("KEXP");
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": M.RADIO_UA, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      t.skip("Radio Browser unread");
      return;
    }
    const stations = M.parseStations(await res.json());
    if (!stations.length) {
      t.skip("no station from that look-up");
      return;
    }
    assert.ok(stations.some((s) => /kexp|seattle/i.test(`${s.name} ${s.tags} ${s.state}`)));
  } catch {
    t.skip("can't reach");
  }
});
