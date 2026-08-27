/** Honest headlines. Wikipedia In the news — no key, no invented copy. Named topics use Google News RSS. Same map as desktop `news.js`. */

export const NEWS_SOURCE = "Wikipedia In the news";
export const TOPIC_SOURCE = "Google News";
export const NEWS_HOST = "en.wikipedia.org";
export const TOPIC_HOST = "news.google.com";
export const CANT_REACH = "can't reach";
export const NO_HEADLINES = "no headlines yet";
export const TOPIC_LABEL = "News topic";
export const TOPIC_PLACEHOLDER = "A topic — Tacoma crime, marijuana news";
export const TOPIC_TRUTH = "World is Wikipedia In the news. A named topic is Google News RSS.";
export const WORLD_ID = "world";
export const MAX_TOPICS = 8;
export const TOPIC_CHARS = 48;

export type NewsItem = {
  title: string;
  url: string;
  summary: string;
};

export type NewsTopic = {
  id: string;
  name: string;
  query: string;
};

export type NewsPrefs = {
  topics: NewsTopic[];
  currentId: string;
};

function clip(text: unknown, n = 180) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

function hash(text: string) {
  let n = 0;
  for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(n).toString(36);
}

export function worldTopic(): NewsTopic {
  return { id: WORLD_ID, name: "World", query: "" };
}

export function blankNewsPrefs(): NewsPrefs {
  return { topics: [worldTopic()], currentId: WORLD_ID };
}

export function parseTopic(raw: unknown): NewsTopic | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const query = clip(o.query || o.name, TOPIC_CHARS);
  const name = clip(o.name, TOPIC_CHARS) || query;
  const id = typeof o.id === "string" && o.id ? o.id : query ? `n-${hash(query)}` : "";
  if (!id || !name) return null;
  if (id === WORLD_ID) return worldTopic();
  return { id, name, query: query || name };
}

export function parseNewsPrefs(raw: unknown): NewsPrefs {
  const next = blankNewsPrefs();
  if (!raw || typeof raw !== "object") return next;
  const o = raw as Record<string, unknown>;
  const list = Array.isArray(o.newsPrefs) ? o.newsPrefs : Array.isArray(o.topics) ? o.topics : [];
  const topics = list.map(parseTopic).filter((t): t is NewsTopic => !!t);
  const hasWorld = topics.some((t) => t.id === WORLD_ID);
  next.topics = (hasWorld ? topics : [worldTopic(), ...topics]).slice(0, MAX_TOPICS);
  const want = typeof o.currentNewsId === "string" ? o.currentNewsId : typeof o.currentId === "string" ? o.currentId : WORLD_ID;
  next.currentId = next.topics.some((t) => t.id === want) ? want : WORLD_ID;
  return next;
}

export function currentTopic(prefs: NewsPrefs | undefined | null): NewsTopic {
  const house = prefs && prefs.topics ? prefs : parseNewsPrefs(prefs);
  return house.topics.find((t) => t.id === house.currentId) || house.topics[0] || worldTopic();
}

export function addTopic(prefs: unknown, topic: unknown): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  const next = parseTopic(topic);
  if (!next || next.id === WORLD_ID) return house;
  const exists = house.topics.findIndex((t) => t.id === next.id || t.query === next.query);
  if (exists >= 0) house.topics[exists] = { ...house.topics[exists]!, ...next };
  else house.topics = [...house.topics, next].slice(0, MAX_TOPICS);
  house.currentId = next.id;
  return house;
}

export function removeTopic(prefs: unknown, id: string): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  if (id === WORLD_ID) return house;
  house.topics = house.topics.filter((t) => t.id !== id);
  if (!house.topics.some((t) => t.id === WORLD_ID)) house.topics.unshift(worldTopic());
  if (house.currentId === id) house.currentId = WORLD_ID;
  return house;
}

export function pickTopic(prefs: unknown, id: string): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  if (house.topics.some((t) => t.id === id)) house.currentId = id;
  return house;
}

export function newsUrl(now = new Date()) {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  return `https://${NEWS_HOST}/api/rest_v1/feed/featured/${y}/${m}/${d}`;
}

export function topicRssUrl(query: string) {
  const q = clip(query, TOPIC_CHARS);
  if (!q) return "";
  return `https://${TOPIC_HOST}/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
}

function decodeXml(text: unknown) {
  return String(text || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function parseRss(xml: unknown): NewsItem[] {
  if (typeof xml !== "string" || !xml) return [];
  const out: NewsItem[] = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml)) && out.length < 8) {
    const block = m[1] || "";
    const title = clip(decodeXml((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]), 90);
    const link = clip(decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]), 240);
    const source = clip(decodeXml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1]), 40);
    if (!title) continue;
    out.push({ title, url: link, summary: source });
  }
  return out;
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
  if (unread && (!items || !items.length)) return CANT_REACH;
  if (!items || !items.length) return NO_HEADLINES;
  return items[0]!.title;
}

export function sourceLine(topic?: NewsTopic | null) {
  return topic && topic.id !== WORLD_ID && topic.query ? `${TOPIC_SOURCE} · ${topic.name}` : NEWS_SOURCE;
}
