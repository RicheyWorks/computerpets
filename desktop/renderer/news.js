/** Honest headlines. Popular = Google News top. World = Wikipedia In the news. Topics = Google News RSS. X = Google News site:x.com when reachable — else Open on X. A send waits until the open news plate shows this computer's network address on that https request. The featured page also refuses inside readFeatured when that wikipedia line is missing. An RSS read refuses inside readRss when that news-host line is missing. A host that never answers times out after twelve seconds. That miss rejects so the plate can flip to unread / "can't reach". A late body is not parsed. No invented keys or headlines. */
(function (root) {
  const NEWS_SOURCE = "Wikipedia In the news";
  const TOPIC_SOURCE = "Google News";
  const POPULAR_SOURCE = "Google News · Popular";
  const X_SOURCE = "Google News · X";
  const NEWS_HOST = "en.wikipedia.org";
  const TOPIC_HOST = "news.google.com";
  const X_HOST = "x.com";
  const CANT_REACH = "can't reach";
  const NO_HEADLINES = "no headlines yet";
  /** The closed plate's header before the first headline: headlines are read only while the plate is open. */
  const NEWS_WAITS = "open to see headlines";
  const FAVORITES_EMPTY = "No favorites yet — star a headline or topic.";
  const TOPIC_LABEL = "News topic";
  const TOPIC_PLACEHOLDER = "A topic — esports, Halo, baseball, football";
  const TOPIC_TRUTH =
    "Popular is Google News top stories. World is Wikipedia In the news. A topic you name is looked up on Google News. X shows Google News stories from x.com when it can — or press Open on X. No made-up headlines.";
  const WORLD_ID = "world";
  const MAX_TOPICS = 20;
  const MAX_FAVORITES = 24;
  const TOPIC_CHARS = 48;
  const NEWS_TABS = ["popular", "topics", "x", "favorites"];
  const SUGGESTION_TOPICS = ["Esports", "Halo", "Baseball", "Football", "Basketball", "Soccer", "NFL", "MLB"];

  function clip(text, n) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n == null ? 180 : n);
  }

  /** Room for a whole Google News article link. A cut link opens a broken page. */
  const LINK_CHARS = 2048;

  /**
   * Only a web page may be a headline link. A feed that sends javascript:, data:, or a
   * relative path gets no link, and the title stays plain words.
   */
  function webLink(url) {
    const text = clip(url, LINK_CHARS);
    return /^https?:\/\/[^\s]/i.test(text) ? text : "";
  }

  /**
   * The featured story is Wikipedia markup. The plate shows its words, not its tags.
   * A stray angle bracket is dropped so the words cannot become markup again.
   */
  function plainText(text) {
    return String(text || "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&#(\d+);/g, function (_m, d) {
        const n = Number(d);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : "";
      })
      .replace(/&#x([0-9a-f]+);/gi, function (_m, h) {
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

  function hash(text) {
    let n = 0;
    for (let i = 0; i < text.length; i++) n = (n * 31 + text.charCodeAt(i)) | 0;
    return Math.abs(n).toString(36);
  }

  function worldTopic() {
    return { id: WORLD_ID, name: "World", query: "" };
  }

  function blankNewsPrefs() {
    return { topics: [worldTopic()], currentId: WORLD_ID, tab: "popular", favorites: [] };
  }

  function parseTab(raw) {
    const t = typeof raw === "string" ? raw.toLowerCase() : "";
    return NEWS_TABS.includes(t) ? t : "popular";
  }

  function parseTopic(raw) {
    if (!raw || typeof raw !== "object") return null;
    const query = clip(raw.query || raw.name, TOPIC_CHARS);
    const name = clip(raw.name, TOPIC_CHARS) || query;
    const id = typeof raw.id === "string" && raw.id ? raw.id : query ? `n-${hash(query)}` : "";
    if (!id || !name) return null;
    if (id === WORLD_ID) return worldTopic();
    return { id, name, query: query || name };
  }

  function parseFavorite(raw) {
    if (!raw || typeof raw !== "object") return null;
    const kind = raw.kind === "topic" ? "topic" : "headline";
    if (kind === "topic") {
      const topic = parseTopic(raw.topic || raw);
      if (!topic || topic.id === WORLD_ID) return null;
      return {
        id: typeof raw.id === "string" && raw.id ? raw.id : `fav-topic-${topic.id}`,
        kind: "topic",
        title: topic.name,
        url: "",
        summary: topic.query,
        topicId: topic.id,
        query: topic.query,
      };
    }
    const title = clip(raw.title, 90);
    const url = webLink(raw.url);
    if (!title) return null;
    const id = typeof raw.id === "string" && raw.id ? raw.id : `fav-${hash(title + "|" + url)}`;
    return {
      id,
      kind: "headline",
      title,
      url,
      summary: clip(raw.summary, 80),
      topicId: typeof raw.topicId === "string" ? raw.topicId : "",
      query: clip(raw.query, TOPIC_CHARS),
    };
  }

  function parseNewsPrefs(raw) {
    const next = blankNewsPrefs();
    if (!raw || typeof raw !== "object") return next;
    const list = Array.isArray(raw.newsPrefs) ? raw.newsPrefs : Array.isArray(raw.topics) ? raw.topics : [];
    const topics = list.map(parseTopic).filter(Boolean);
    const hasWorld = topics.some((t) => t.id === WORLD_ID);
    next.topics = (hasWorld ? topics : [worldTopic()].concat(topics)).slice(0, MAX_TOPICS);
    const want = typeof raw.currentNewsId === "string" ? raw.currentNewsId : typeof raw.currentId === "string" ? raw.currentId : WORLD_ID;
    next.currentId = next.topics.some((t) => t.id === want) ? want : WORLD_ID;
    next.tab = parseTab(raw.newsTab != null ? raw.newsTab : raw.tab);
    const favRaw = Array.isArray(raw.newsFavorites) ? raw.newsFavorites : Array.isArray(raw.favorites) ? raw.favorites : [];
    next.favorites = favRaw.map(parseFavorite).filter(Boolean).slice(0, MAX_FAVORITES);
    return next;
  }

  function toCardPatch(prefs) {
    const house = prefs && prefs.topics ? prefs : parseNewsPrefs(prefs);
    return {
      newsPrefs: house.topics,
      currentNewsId: house.currentId,
      newsTab: house.tab,
      newsFavorites: house.favorites,
    };
  }

  function currentTopic(prefs) {
    const house = prefs && prefs.topics ? prefs : parseNewsPrefs(prefs);
    return house.topics.find((t) => t.id === house.currentId) || house.topics[0] || worldTopic();
  }

  function addTopic(prefs, topic) {
    const house = parseNewsPrefs(prefs);
    const next = parseTopic(topic);
    if (!next || next.id === WORLD_ID) return house;
    const exists = house.topics.findIndex((t) => t.id === next.id || t.query === next.query);
    if (exists >= 0) house.topics[exists] = { ...house.topics[exists], ...next };
    else house.topics = house.topics.concat(next).slice(0, MAX_TOPICS);
    house.currentId = next.id;
    house.tab = "topics";
    return house;
  }

  function removeTopic(prefs, id) {
    const house = parseNewsPrefs(prefs);
    if (id === WORLD_ID) return house;
    house.topics = house.topics.filter((t) => t.id !== id);
    if (!house.topics.some((t) => t.id === WORLD_ID)) house.topics.unshift(worldTopic());
    if (house.currentId === id) house.currentId = WORLD_ID;
    return house;
  }

  function pickTopic(prefs, id) {
    const house = parseNewsPrefs(prefs);
    if (house.topics.some((t) => t.id === id)) {
      house.currentId = id;
      if (house.tab === "popular" || house.tab === "favorites") house.tab = "topics";
    }
    return house;
  }

  function moveTopic(prefs, id, dir) {
    const house = parseNewsPrefs(prefs);
    const i = house.topics.findIndex((t) => t.id === id);
    if (i < 0 || id === WORLD_ID) return house;
    const j = i + (Number(dir) < 0 ? -1 : 1);
    if (j <= 0 || j >= house.topics.length) return house;
    const copy = house.topics.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    house.topics = copy;
    return house;
  }

  function pickTab(prefs, tab) {
    const house = parseNewsPrefs(prefs);
    house.tab = parseTab(tab);
    return house;
  }

  function addFavorite(prefs, raw) {
    const house = parseNewsPrefs(prefs);
    const next = parseFavorite(raw);
    if (!next) return house;
    const exists = house.favorites.findIndex(
      (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
    );
    if (exists >= 0) house.favorites[exists] = next;
    else house.favorites = house.favorites.concat(next).slice(0, MAX_FAVORITES);
    return house;
  }

  function removeFavorite(prefs, id) {
    const house = parseNewsPrefs(prefs);
    house.favorites = house.favorites.filter((f) => f.id !== id);
    return house;
  }

  function toggleFavorite(prefs, raw) {
    const house = parseNewsPrefs(prefs);
    const next = parseFavorite(raw);
    if (!next) return house;
    const exists = house.favorites.find(
      (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
    );
    if (exists) return removeFavorite(house, exists.id);
    return addFavorite(house, next);
  }

  function isFavorite(prefs, raw) {
    const house = parseNewsPrefs(prefs);
    const next = parseFavorite(raw);
    if (!next) return false;
    return house.favorites.some(
      (f) => f.id === next.id || (f.kind === next.kind && f.title === next.title && f.url === next.url && f.topicId === next.topicId),
    );
  }

  function newsUrl(now) {
    now = now || new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const d = String(now.getUTCDate()).padStart(2, "0");
    return `https://${NEWS_HOST}/api/rest_v1/feed/featured/${y}/${m}/${d}`;
  }

  function topicRssUrl(query) {
    const q = clip(query, TOPIC_CHARS);
    if (!q) return "";
    return `https://${TOPIC_HOST}/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  }

  function popularRssUrl() {
    return `https://${TOPIC_HOST}/rss?hl=en-US&gl=US&ceid=US:en`;
  }

  function xTopicRssUrl(query) {
    const q = clip(query, TOPIC_CHARS) || "news";
    const search = `${q} (site:x.com OR site:twitter.com)`;
    return `https://${TOPIC_HOST}/rss/search?q=${encodeURIComponent(search)}&hl=en-US&gl=US&ceid=US:en`;
  }

  function xSearchUrl(query) {
    const q = clip(query, TOPIC_CHARS) || "news";
    return `https://${X_HOST}/search?q=${encodeURIComponent(q)}&src=typed_query`;
  }

  function decodeXml(text) {
    return String(text || "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  function parseRss(xml) {
    if (typeof xml !== "string" || !xml) return [];
    const out = [];
    const re = /<item>([\s\S]*?)<\/item>/gi;
    let m;
    while ((m = re.exec(xml)) && out.length < 8) {
      const block = m[1];
      const title = clip(decodeXml((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]), 90);
      const link = webLink(decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]));
      const source = clip(decodeXml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1]), 40);
      if (!title) continue;
      out.push({ title, url: link, summary: source });
    }
    return out;
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
      const url = pages && pages.desktop && pages.desktop.page ? webLink(pages.desktop.page) : "";
      const summary = clip(plainText(row.story || (first && (first.extract || first.description))), 200);
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
  function newsLine(items, unread, closed) {
    if (unread && (!items || !items.length)) return CANT_REACH;
    if (!items || !items.length) return closed ? NEWS_WAITS : NO_HEADLINES;
    return items[0].title;
  }

  function sharedNet(host) {
    let areas = root.PetWeatherAreas;
    if (!areas && typeof module !== "undefined" && module.exports) {
      try {
        areas = require("./weather-areas.js");
        root.PetWeatherAreas = areas;
      } catch (err) {
        areas = null;
      }
    }
    if (!areas || typeof areas.clientNetLine !== "function") return "";
    return areas.clientNetLine(host);
  }

  const NEWS_RSS_NET = sharedNet("the news host");
  const NEWS_WIKI_NET = sharedNet("the wikipedia host");
  const NEWS_RSS_HONESTY = NEWS_RSS_NET ? `this news send reads the rss feed. ${NEWS_RSS_NET}` : "";
  const NEWS_WIKI_HONESTY = NEWS_WIKI_NET ? `this news send reads the featured page. ${NEWS_WIKI_NET}` : "";

  function newsSendKind(prefs) {
    const house = parseNewsPrefs(prefs);
    const tab = house.tab || "popular";
    if (tab === "favorites") return "none";
    if (tab === "popular" || tab === "x") return "rss";
    const topic = currentTopic(house);
    if (topic && topic.id !== WORLD_ID && topic.query) return "rss";
    return "wiki";
  }

  function newsHonesty(prefs) {
    const kind = newsSendKind(prefs);
    if (kind === "rss") return NEWS_RSS_HONESTY;
    if (kind === "wiki") return NEWS_WIKI_HONESTY;
    return "";
  }

  function newsMaySend(prefs, lineInView) {
    const line = newsHonesty(prefs);
    const kind = newsSendKind(prefs);
    const net = kind === "rss" ? NEWS_RSS_NET : kind === "wiki" ? NEWS_WIKI_NET : "";
    return lineInView === true && !!net && line.indexOf(net) !== -1;
  }

  function featuredMayLeave(shown) {
    if (!NEWS_WIKI_HONESTY) return false;
    return typeof shown === "string" && shown.indexOf(NEWS_WIKI_HONESTY) !== -1;
  }

  function rssMayLeave(shown) {
    if (!NEWS_RSS_HONESTY) return false;
    return typeof shown === "string" && shown.indexOf(NEWS_RSS_HONESTY) !== -1;
  }

  /** Twelve seconds covers headers and the body. Matches weather page and overlay plate IPC. */
  const NEWS_TIMEOUT_MS = 12_000;

  /** A silent news or wikipedia host. Callers flip the plate to unread / "can't reach". */
  class NewsTimeout extends Error {
    constructor() {
      super("news request timed out");
      this.name = "NewsTimeout";
    }
  }

  function isNewsTimeout(err) {
    return !!(
      err &&
      (err.name === "NewsTimeout" ||
        err.name === "AbortError" ||
        err.name === "TimeoutError" ||
        err.code === "ABORT_ERR")
    );
  }

  /**
   * One outbound news read. The timer covers headers and the body.
   * A timeout rejects with NewsTimeout. The caller does not get a body.
   * A late body after the deadline is not parsed.
   */
  function readBody(url, fetchImpl, kind, timeoutMs) {
    const go = typeof fetchImpl === "function" ? fetchImpl : fetch;
    if (typeof go !== "function") return Promise.reject(new NewsTimeout());
    const ms = typeof timeoutMs === "number" ? timeoutMs : NEWS_TIMEOUT_MS;
    const ctrl = new AbortController();
    let settled = false;
    let timer;

    return new Promise(function (resolve, reject) {
      timer = setTimeout(function () {
        if (settled) return;
        settled = true;
        ctrl.abort();
        reject(new NewsTimeout());
      }, ms);

      Promise.resolve()
        .then(function () {
          return go(url, { signal: ctrl.signal });
        })
        .then(function (res) {
          if (kind === "json") {
            return res && typeof res.json === "function" ? res.json() : null;
          }
          return res && typeof res.text === "function" ? res.text() : null;
        })
        .then(function (body) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(body);
        })
        .catch(function (err) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          if (isNewsTimeout(err)) reject(new NewsTimeout());
          else reject(err);
        });
    });
  }

  /** The only featured-page fetch. A miss resolves to null and does not call fetch. A hang rejects. */
  function readFeatured(shown, fetchImpl, timeoutMs) {
    if (!featuredMayLeave(shown)) return Promise.resolve(null);
    return readBody(newsUrl(), fetchImpl, "json", timeoutMs);
  }

  /** The only RSS fetch. A miss resolves to null and does not call fetch. A hang rejects. */
  function readRss(shown, url, fetchImpl, timeoutMs) {
    if (!rssMayLeave(shown) || !url) return Promise.resolve(null);
    return readBody(url, fetchImpl, "text", timeoutMs);
  }

  function sourceLine(topic, tab) {
    const mode = tab == null || tab === "" ? "topics" : parseTab(tab);
    if (mode === "popular") return POPULAR_SOURCE;
    if (mode === "x") {
      const row = topic && topic.id === WORLD_ID ? null : topic;
      return row && row.query ? `${X_SOURCE} · ${row.name}` : `${X_SOURCE} · news`;
    }
    if (mode === "favorites") return "Favorites";
    const row = topic && topic.id === WORLD_ID ? null : topic;
    return row && row.query ? `${TOPIC_SOURCE} · ${row.name}` : NEWS_SOURCE;
  }

  const api = {
    NEWS_SOURCE,
    TOPIC_SOURCE,
    POPULAR_SOURCE,
    X_SOURCE,
    NEWS_HOST,
    TOPIC_HOST,
    X_HOST,
    CANT_REACH,
    NO_HEADLINES,
    NEWS_WAITS,
    FAVORITES_EMPTY,
    TOPIC_LABEL,
    TOPIC_PLACEHOLDER,
    TOPIC_TRUTH,
    WORLD_ID,
    MAX_TOPICS,
    MAX_FAVORITES,
    TOPIC_CHARS,
    NEWS_TABS,
    SUGGESTION_TOPICS,
    blankNewsPrefs,
    parseTab,
    parseTopic,
    parseFavorite,
    parseNewsPrefs,
    toCardPatch,
    currentTopic,
    addTopic,
    removeTopic,
    pickTopic,
    moveTopic,
    pickTab,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    newsUrl,
    topicRssUrl,
    popularRssUrl,
    xTopicRssUrl,
    xSearchUrl,
    parseRss,
    parseNews,
    plainText,
    LINK_CHARS,
    webLink,
    newsLine,
    sourceLine,
    NEWS_RSS_NET,
    NEWS_WIKI_NET,
    NEWS_RSS_HONESTY,
    NEWS_WIKI_HONESTY,
    newsSendKind,
    newsHonesty,
    newsMaySend,
    featuredMayLeave,
    rssMayLeave,
    NEWS_TIMEOUT_MS,
    NewsTimeout,
    readFeatured,
    readRss,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetNews = api;
})(typeof window !== "undefined" ? window : globalThis);
