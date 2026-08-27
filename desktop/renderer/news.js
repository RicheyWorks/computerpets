/** Honest headlines. Wikipedia In the news — no key, no invented copy. */
(function (root) {
  const NEWS_SOURCE = "Wikipedia In the news";
  const NEWS_HOST = "en.wikipedia.org";
  const CANT_REACH = "can't reach";
  const NO_HEADLINES = "no headlines yet";

  function newsUrl(now) {
    now = now || new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    return `https://${NEWS_HOST}/api/rest_v1/feed/featured/${y}/${m}/${d}`;
  }

  function clip(text, n) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n == null ? 180 : n);
  }

  function parseNews(json) {
    if (!json || typeof json !== "object" || !Array.isArray(json.news)) return [];
    const out = [];
    for (const row of json.news) {
      if (!row || typeof row !== "object") continue;
      const links = Array.isArray(row.links) ? row.links : [];
      const first = links[0] && typeof links[0] === "object" ? links[0] : null;
      const titles = first && first.titles && typeof first.titles === "object" ? first.titles.normalized : "";
      const title = clip(first && (first.normalizedtitle || titles || first.title), 90);
      const pages = first && first.content_urls && typeof first.content_urls === "object" ? first.content_urls : null;
      const url = pages && pages.desktop && pages.desktop.page ? String(pages.desktop.page) : "";
      const summary = clip(row.story || (first && (first.extract || first.description)), 200);
      if (!title) continue;
      out.push({
        title,
        url: url || `https://${NEWS_HOST}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
        summary,
      });
    }
    return out.slice(0, 8);
  }

  function newsLine(items, unread) {
    if (unread) return CANT_REACH;
    if (!items || !items.length) return NO_HEADLINES;
    return items[0].title;
  }

  const api = { NEWS_SOURCE, NEWS_HOST, CANT_REACH, NO_HEADLINES, newsUrl, parseNews, newsLine };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetNews = api;
})(typeof window !== "undefined" ? window : globalThis);
