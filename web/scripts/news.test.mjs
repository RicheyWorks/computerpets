import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = await import(join(root, "src/lib/pets/news.ts"));
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
  assert.equal(N.newsLine(items), "A real headline");
  assert.equal(Overlay.NEWS_SOURCE, N.NEWS_SOURCE);
  assert.equal(Overlay.parseNews({ news: [] }).length, 0);
});
