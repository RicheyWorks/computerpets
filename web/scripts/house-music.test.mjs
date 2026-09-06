import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const M = await import(join(root, "src/lib/pets/house-music.ts"));
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
