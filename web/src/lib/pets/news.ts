/** Honest headlines. Wikipedia In the news — no key, no invented copy. Same map as desktop `news.js`. */

export const NEWS_SOURCE = "Wikipedia In the news";
export const NEWS_HOST = "en.wikipedia.org";
export const CANT_REACH = "can't reach";
export const NO_HEADLINES = "no headlines yet";

export type NewsItem = {
  title: string;
  url: string;
  summary: string;
};

export function newsUrl(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `https://${NEWS_HOST}/api/rest_v1/feed/featured/${y}/${m}/${d}`;
}

function clip(text: unknown, n = 180) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

export function parseNews(json: unknown): NewsItem[] {
  if (!json || typeof json !== "object") return [];
  const news = (json as { news?: unknown }).news;
  if (!Array.isArray(news)) return [];
  const out: NewsItem[] = [];
  for (const row of news) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const links = Array.isArray(o.links) ? o.links : [];
    const first = links[0] && typeof links[0] === "object" ? (links[0] as Record<string, unknown>) : null;
    const titles = first && first.titles && typeof first.titles === "object" ? (first.titles as { normalized?: string }).normalized : "";
    const title = clip(first?.normalizedtitle || titles || first?.title, 90);
    const pages = first && first.content_urls && typeof first.content_urls === "object" ? (first.content_urls as { desktop?: { page?: string } }) : null;
    const url = pages?.desktop?.page ? String(pages.desktop.page) : "";
    const summary = clip(o.story || first?.extract || first?.description, 200);
    if (!title) continue;
    out.push({
      title,
      url: url || `https://${NEWS_HOST}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      summary,
    });
  }
  return out.slice(0, 8);
}

export function newsLine(items: NewsItem[] | undefined, unread = false) {
  if (unread) return CANT_REACH;
  if (!items || !items.length) return NO_HEADLINES;
  return items[0]!.title;
}
