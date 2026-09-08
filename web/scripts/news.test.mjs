import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = await import(pathToFileURL(join(root, "src/lib/pets/news.ts")).href);
const Overlay = createRequire(import.meta.url)(join(root, "../desktop/renderer/news.js"));

test("news is Wikipedia In the news, not invented copy", () => {
  assert.equal(N.NEWS_SOURCE, "Wikipedia In the news");
  assert.equal(N.CANT_REACH, "can't reach");
  assert.equal(N.NO_HEADLINES, "no headlines yet");
  assert.match(N.newsUrl(new Date(Date.UTC(2026, 7, 27))), /en\.wikipedia\.org\/api\/rest_v1\/feed\/featured\/2026\/08\/27/);
  assert.equal(N.newsLine([], false), "no headlines yet");
  assert.equal(N.newsLine([], true), "can't reach");
  const items = N.parseNews({
    news: [
      {
        story: "A house line.",
        links: [{ normalizedtitle: "A real headline", content_urls: { desktop: { page: "https://en.wikipedia.org/wiki/A_real_headline" } } }],
      },
    ],
  });
  assert.equal(items[0].title, "A real headline");
  assert.equal(items[0].summary, "A house line.");
  assert.equal(N.newsLine(items), "A real headline");
  assert.equal(N.newsLine(items, true), "A real headline");
  assert.equal(Overlay.NEWS_SOURCE, N.NEWS_SOURCE);
  assert.equal(Overlay.parseNews({ news: [] }).length, 0);
  assert.equal(N.WORLD_ID, "world");
  assert.equal(N.currentTopic(N.blankNewsPrefs()).name, "World");
  let prefs = N.addTopic(N.blankNewsPrefs(), { name: "Tacoma WA crime", query: "Tacoma WA crime" });
  assert.equal(N.currentTopic(prefs).query, "Tacoma WA crime");
  assert.match(N.topicRssUrl("marijuana news"), /news\.google\.com\/rss\/search/);
  assert.equal(N.sourceLine(N.currentTopic(prefs), "topics"), "Google News · Tacoma WA crime");
  const rss = N.parseRss("<rss><channel><item><title>A topic line</title><link>https://example.com/a</link><source>Paper</source></item></channel></rss>");
  assert.equal(rss[0].title, "A topic line");
  assert.equal(rss[0].summary, "Paper");
  assert.equal(Overlay.parseRss("<rss><channel><item><title>A topic line</title><link>https://example.com/a</link></item></channel></rss>")[0].title, "A topic line");
});

test("custom topics raise MAX, add/remove/reorder, suggestion chips map", () => {
  assert.equal(N.MAX_TOPICS, 20);
  assert.equal(Overlay.MAX_TOPICS, 20);
  assert.match(N.TOPIC_PLACEHOLDER, /esports|Halo|baseball|football/i);
  assert.ok(N.SUGGESTION_TOPICS.includes("Esports"));
  assert.ok(N.SUGGESTION_TOPICS.includes("Halo"));
  let prefs = N.blankNewsPrefs();
  for (const name of ["esports", "Halo", "baseball", "football", "basketball"]) {
    prefs = N.addTopic(prefs, { name, query: name });
  }
  assert.equal(prefs.topics.length, 6); // world + 5
  assert.equal(prefs.tab, "topics");
  const before = prefs.topics.map((t) => t.id);
  prefs = N.moveTopic(prefs, before[2], 1);
  assert.notEqual(prefs.topics.map((t) => t.id).join(","), before.join(","));
  prefs = N.removeTopic(prefs, prefs.topics.find((t) => t.query === "Halo").id);
  assert.equal(prefs.topics.some((t) => t.query === "Halo"), false);
  // fill to MAX
  prefs = N.blankNewsPrefs();
  for (let i = 0; i < 30; i++) prefs = N.addTopic(prefs, { name: `topic ${i}`, query: `topic ${i}` });
  assert.equal(prefs.topics.length, N.MAX_TOPICS);
  assert.equal(Overlay.addTopic(Overlay.blankNewsPrefs(), { name: "NFL", query: "NFL" }).topics.length, 2);
});

test("Popular and X URL builders + honest source labels", () => {
  assert.match(N.popularRssUrl(), /news\.google\.com\/rss\?/);
  assert.equal(N.sourceLine(null, "popular"), N.POPULAR_SOURCE);
  assert.match(N.xTopicRssUrl("Halo"), /site%3Ax\.com|site:x\.com|x\.com/);
  assert.match(N.xTopicRssUrl("Halo"), /news\.google\.com\/rss\/search/);
  assert.match(N.xSearchUrl("Halo"), /x\.com\/search\?q=Halo/);
  assert.equal(N.sourceLine({ id: "n-1", name: "Halo", query: "Halo" }, "x"), "Google News · X · Halo");
  assert.equal(Overlay.xSearchUrl("esports"), N.xSearchUrl("esports"));
  assert.equal(Overlay.popularRssUrl(), N.popularRssUrl());
});

test("Favorites persist and empty honestly", () => {
  assert.equal(N.FAVORITES_EMPTY.includes("No favorites yet"), true);
  let prefs = N.addTopic(N.blankNewsPrefs(), { name: "baseball", query: "baseball" });
  prefs = N.toggleFavorite(prefs, { kind: "topic", name: "baseball", query: "baseball", id: prefs.currentId });
  assert.equal(prefs.favorites.length, 1);
  assert.equal(N.isFavorite(prefs, { kind: "topic", id: prefs.currentId, name: "baseball", query: "baseball" }), true);
  prefs = N.toggleFavorite(prefs, { kind: "headline", title: "A game", url: "https://example.com/g", summary: "Wire" });
  assert.equal(prefs.favorites.length, 2);
  prefs = N.pickTab(prefs, "favorites");
  assert.equal(prefs.tab, "favorites");
  assert.equal(N.sourceLine(null, prefs.tab), "Favorites");
  const patch = N.toCardPatch(prefs);
  assert.equal(patch.newsTab, "favorites");
  assert.equal(patch.newsFavorites.length, 2);
  const again = N.parseNewsPrefs(patch);
  assert.equal(again.favorites.length, 2);
  assert.equal(Overlay.toggleFavorite(Overlay.blankNewsPrefs(), { kind: "headline", title: "A", url: "https://a" }).favorites.length, 1);
});
