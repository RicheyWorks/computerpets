/** Honest headlines. Popular = Google News top. World = Wikipedia In the news. Topics = Google News RSS. X = Google News site:x.com when reachable — else Open on X. A send waits until the open news plate shows this computer's network address on that https request. The featured page also refuses inside `readFeatured` when that wikipedia line is missing. An RSS read refuses inside `readRss` when that news-host line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can flip to unread / "can't reach". A late body is not parsed. Same map as desktop `news.js`. */
import { clientNetLine } from "./weather-areas.ts";

export const NEWS_SOURCE = "Wikipedia In the news";
export const TOPIC_SOURCE = "Google News";
export const POPULAR_SOURCE = "Google News · Popular";
export const X_SOURCE = "Google News · X";
export const NEWS_HOST = "en.wikipedia.org";
export const TOPIC_HOST = "news.google.com";
export const X_HOST = "x.com";
export const CANT_REACH = "can't reach";
export const NO_HEADLINES = "no headlines yet";
/** The closed plate's header before the first headline: headlines are read only while the plate is open. */
export const NEWS_WAITS = "open to see headlines";
export const FAVORITES_EMPTY = "No favorites yet — star a headline or topic.";
export const TOPIC_LABEL = "News topic";
export const TOPIC_PLACEHOLDER = "A topic — esports, Halo, baseball, football";
export const TOPIC_TRUTH =
  "Popular is Google News top stories. World is Wikipedia In the news. A topic you name is looked up on Google News. X shows Google News stories from x.com when it can — or press Open on X. No made-up headlines.";
export const WORLD_ID = "world";
export const MAX_TOPICS = 20;
export const MAX_FAVORITES = 24;
export const TOPIC_CHARS = 48;
export const NEWS_TABS = ["popular", "topics", "x", "favorites"] as const;
export const SUGGESTION_TOPICS = ["Esports", "Halo", "Baseball", "Football", "Basketball", "Soccer", "NFL", "MLB"] as const;

export type NewsTab = (typeof NEWS_TABS)[number];

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

export type NewsFavorite = {
  id: string;
  kind: "headline" | "topic";
  title: string;
  url: string;
  summary: string;
  topicId: string;
  query: string;
};

export type NewsPrefs = {
  topics: NewsTopic[];
  currentId: string;
  tab: NewsTab;
  favorites: NewsFavorite[];
};

function clip(text: unknown, n = 180) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, n);
}

/** Room for a whole Google News article link. A cut link opens a broken page. */
export const LINK_CHARS = 2048;

/**
 * Only a web page may be a headline link. A feed that sends javascript:, data:, or a
 * relative path gets no link, and the title stays plain words.
 */
export function webLink(url: unknown) {
  const text = clip(url, LINK_CHARS);
  return /^https?:\/\/[^\s]/i.test(text) ? text : "";
}

/**
 * The featured story is Wikipedia markup. The plate shows its words, not its tags.
 * A stray angle bracket is dropped so the words cannot become markup again.
 */
export function plainText(text: unknown) {
  return String(text || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_m, d: string) => {
      const n = Number(d);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    })
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => {
      const n = parseInt(h, 16);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
    })
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;|&gt;/g, "")
    .replace(/&amp;/g, "&")
    .replace(/[<>]/g, "")
    .replace(/\s+([,.;:!?])/g, "$1");
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
  return { topics: [worldTopic()], currentId: WORLD_ID, tab: "popular", favorites: [] };
}

export function parseTab(raw: unknown): NewsTab {
  const t = typeof raw === "string" ? raw.toLowerCase() : "";
  return (NEWS_TABS as readonly string[]).includes(t) ? (t as NewsTab) : "popular";
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

export function parseFavorite(raw: unknown): NewsFavorite | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const kind = o.kind === "topic" ? "topic" : "headline";
  if (kind === "topic") {
    const topic = parseTopic(o.topic || o);
    if (!topic || topic.id === WORLD_ID) return null;
    return {
      id: typeof o.id === "string" && o.id ? o.id : `fav-topic-${topic.id}`,
      kind: "topic",
      title: topic.name,
      url: "",
      summary: topic.query,
      topicId: topic.id,
      query: topic.query,
    };
  }
  const title = clip(o.title, 90);
  const url = webLink(o.url);
  if (!title) return null;
  const id = typeof o.id === "string" && o.id ? o.id : `fav-${hash(title + "|" + url)}`;
  return {
    id,
    kind: "headline",
    title,
    url,
    summary: clip(o.summary, 80),
    topicId: typeof o.topicId === "string" ? o.topicId : "",
    query: clip(o.query, TOPIC_CHARS),
  };
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
  next.tab = parseTab(o.newsTab != null ? o.newsTab : o.tab);
  const favRaw = Array.isArray(o.newsFavorites) ? o.newsFavorites : Array.isArray(o.favorites) ? o.favorites : [];
  next.favorites = favRaw.map(parseFavorite).filter((f): f is NewsFavorite => !!f).slice(0, MAX_FAVORITES);
  return next;
}

export function toCardPatch(prefs: NewsPrefs | unknown) {
  const house = prefs && typeof prefs === "object" && Array.isArray((prefs as NewsPrefs).topics) ? (prefs as NewsPrefs) : parseNewsPrefs(prefs);
  return {
    newsPrefs: house.topics,
    currentNewsId: house.currentId,
    newsTab: house.tab,
    newsFavorites: house.favorites,
  };
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
  house.tab = "topics";
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
  if (house.topics.some((t) => t.id === id)) {
    house.currentId = id;
    if (house.tab === "popular" || house.tab === "favorites") house.tab = "topics";
  }
  return house;
}

export function moveTopic(prefs: unknown, id: string, dir: number): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  const i = house.topics.findIndex((t) => t.id === id);
  if (i < 0 || id === WORLD_ID) return house;
  const j = i + (Number(dir) < 0 ? -1 : 1);
  if (j <= 0 || j >= house.topics.length) return house;
  const copy = house.topics.slice();
  const tmp = copy[i]!;
  copy[i] = copy[j]!;
  copy[j] = tmp;
  house.topics = copy;
  return house;
}

export function pickTab(prefs: unknown, tab: unknown): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  house.tab = parseTab(tab);
  return house;
}

export function addFavorite(prefs: unknown, raw: unknown): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  const next = parseFavorite(raw);
  if (!next) return house;
  const exists = house.favorites.findIndex(
    (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
  );
  if (exists >= 0) house.favorites[exists] = next;
  else house.favorites = [...house.favorites, next].slice(0, MAX_FAVORITES);
  return house;
}

export function removeFavorite(prefs: unknown, id: string): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  house.favorites = house.favorites.filter((f) => f.id !== id);
  return house;
}

export function toggleFavorite(prefs: unknown, raw: unknown): NewsPrefs {
  const house = parseNewsPrefs(prefs);
  const next = parseFavorite(raw);
  if (!next) return house;
  const exists = house.favorites.find(
    (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
  );
  if (exists) return removeFavorite(house, exists.id);
  return addFavorite(house, next);
}

export function isFavorite(prefs: unknown, raw: unknown) {
  const house = parseNewsPrefs(prefs);
  const next = parseFavorite(raw);
  if (!next) return false;
  return house.favorites.some(
    (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
  );
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

export function popularRssUrl() {
  return `https://${TOPIC_HOST}/rss?hl=en-US&gl=US&ceid=US:en`;
}

export function xTopicRssUrl(query: string) {
  const q = clip(query, TOPIC_CHARS) || "news";
  const search = `${q} (site:x.com OR site:twitter.com)`;
  return `https://${TOPIC_HOST}/rss/search?q=${encodeURIComponent(search)}&hl=en-US&gl=US&ceid=US:en`;
}

export function xSearchUrl(query: string) {
  const q = clip(query, TOPIC_CHARS) || "news";
  return `https://${X_HOST}/search?q=${encodeURIComponent(q)}&src=typed_query`;
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
    const link = webLink(decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]));
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
    const url = pages?.desktop?.page ? webLink(pages.desktop.page) : "";
    const summary = clip(plainText(o.story || first?.extract || first?.description), 200);
    if (!title) continue;
    out.push({
      title,
      url: url || `https://${NEWS_HOST}/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      summary,
    });
  }
  return out.slice(0, 8);
}

/** `closed`: the plate is shut and has nothing yet, so its header says to open it (NEWS_WAITS). */
export function newsLine(items: NewsItem[] | undefined, unread = false, closed = false) {
  if (unread && (!items || !items.length)) return CANT_REACH;
  if (!items || !items.length) return closed ? NEWS_WAITS : NO_HEADLINES;
  return items[0]!.title;
}

export const NEWS_RSS_NET = clientNetLine("the news host");
export const NEWS_WIKI_NET = clientNetLine("the wikipedia host");
export const NEWS_RSS_HONESTY = `this news send reads the rss feed. ${NEWS_RSS_NET}`;
export const NEWS_WIKI_HONESTY = `this news send reads the featured page. ${NEWS_WIKI_NET}`;

export type NewsSendKind = "rss" | "wiki" | "none";

/** Favorites stay on the card. Popular, X, and a named topic read Google News. World reads Wikipedia. */
export function newsSendKind(prefs: unknown): NewsSendKind {
  const house = parseNewsPrefs(prefs);
  const tab = house.tab || "popular";
  if (tab === "favorites") return "none";
  if (tab === "popular" || tab === "x") return "rss";
  const topic = currentTopic(house);
  if (topic && topic.id !== WORLD_ID && topic.query) return "rss";
  return "wiki";
}

export function newsHonesty(prefs: unknown): string {
  const kind = newsSendKind(prefs);
  if (kind === "rss") return NEWS_RSS_HONESTY;
  if (kind === "wiki") return NEWS_WIKI_HONESTY;
  return "";
}

/**
 * The news host is called only while the keeper can see that line.
 * A closed plate, a load, and the favorites tab are not that view.
 * This does not add a tracker. The caller still owns the twenty-minute refresh.
 */
export function newsMaySend(prefs: unknown, lineInView: boolean): boolean {
  const line = newsHonesty(prefs);
  const kind = newsSendKind(prefs);
  const net = kind === "rss" ? NEWS_RSS_NET : kind === "wiki" ? NEWS_WIKI_NET : "";
  return lineInView === true && net.length > 0 && line.includes(net);
}

/**
 * The featured page leaves only when the painted line names the wikipedia host.
 * A missing line, the rss sentence, and a closed plate do not call fetch.
 */
export function featuredMayLeave(shown: unknown): boolean {
  return NEWS_WIKI_HONESTY.length > 0 && typeof shown === "string" && shown.includes(NEWS_WIKI_HONESTY);
}

/**
 * A Google News RSS read leaves only when the painted line names the news host.
 * A missing line, the wikipedia sentence, and a closed plate do not call fetch.
 */
export function rssMayLeave(shown: unknown): boolean {
  return NEWS_RSS_HONESTY.length > 0 && typeof shown === "string" && shown.includes(NEWS_RSS_HONESTY);
}

type FeaturedFetch = (url: string, init?: RequestInit) => Promise<{ json: () => Promise<unknown> }>;
type RssFetch = (url: string, init?: RequestInit) => Promise<{ text: () => Promise<string> }>;

/** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
export const NEWS_TIMEOUT_MS = 12_000;

/** A silent news or wikipedia host. Callers flip the plate to unread / "can't reach". */
export class NewsTimeout extends Error {
  constructor() {
    super("news request timed out");
    this.name = "NewsTimeout";
  }
}

function isNewsTimeout(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const name = (err as { name?: string }).name;
  const code = (err as { code?: string }).code;
  return name === "NewsTimeout" || name === "AbortError" || name === "TimeoutError" || code === "ABORT_ERR";
}

/**
 * One outbound news read. The timer covers headers and the body.
 * A timeout rejects with NewsTimeout. The caller does not get a body.
 * A late body after the deadline is not parsed.
 */
function readBody<T>(
  url: string,
  fetchImpl: (url: string, init?: RequestInit) => Promise<{ json?: () => Promise<unknown>; text?: () => Promise<string> }>,
  kind: "json" | "text",
  timeoutMs: number = NEWS_TIMEOUT_MS,
): Promise<T | null> {
  if (typeof fetchImpl !== "function") return Promise.reject(new NewsTimeout());

  const ctrl = new AbortController();
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  return new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      ctrl.abort();
      reject(new NewsTimeout());
    }, timeoutMs);

    Promise.resolve()
      .then(() => fetchImpl(url, { signal: ctrl.signal }))
      .then(async (res) => {
        const body =
          kind === "json"
            ? res && typeof res.json === "function"
              ? await res.json()
              : null
            : res && typeof res.text === "function"
              ? await res.text()
              : null;
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(body as T | null);
      })
      .catch((err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (isNewsTimeout(err)) reject(new NewsTimeout());
        else reject(err);
      });
  });
}

/** The only featured-page fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readFeatured(
  shown: unknown,
  fetchImpl: FeaturedFetch = fetch,
  timeoutMs: number = NEWS_TIMEOUT_MS,
): Promise<unknown | null> {
  if (!featuredMayLeave(shown)) return Promise.resolve(null);
  return readBody(newsUrl(), fetchImpl, "json", timeoutMs);
}

/** The only RSS fetch. A miss resolves to null and does not call fetch. A hang rejects. */
export function readRss(
  shown: unknown,
  url: string,
  fetchImpl: RssFetch = fetch,
  timeoutMs: number = NEWS_TIMEOUT_MS,
): Promise<string | null> {
  if (!rssMayLeave(shown) || !url) return Promise.resolve(null);
  return readBody(url, fetchImpl, "text", timeoutMs);
}

export function sourceLine(topic?: NewsTopic | null, tab?: unknown) {
  const mode = tab == null || tab === "" ? "topics" : parseTab(tab);
  if (mode === "popular") return POPULAR_SOURCE;
  if (mode === "x") {
    return topic && topic.id !== WORLD_ID && topic.query ? `${X_SOURCE} · ${topic.name}` : `${X_SOURCE} · news`;
  }
  if (mode === "favorites") return "Favorites";
  return topic && topic.id !== WORLD_ID && topic.query ? `${TOPIC_SOURCE} · ${topic.name}` : NEWS_SOURCE;
}
