/** Honest headlines. Wikipedia In the news — no key, no invented copy. Named topics use Google News RSS. */
(function (root) {
  const NEWS_SOURCE = "Wikipedia In the news";
  const TOPIC_SOURCE = "Google News";
  const NEWS_HOST = "en.wikipedia.org";
  const TOPIC_HOST = "news.google.com";
  const CANT_REACH = "can't reach";
  const NO_HEADLINES = "no headlines yet";
  const TOPIC_LABEL = "News topic";
  const TOPIC_PLACEHOLDER = "A topic — Tacoma crime, marijuana news";
  const TOPIC_TRUTH = "World is Wikipedia In the news. A named topic is Google News RSS.";
  const WORLD_ID = "world";
  const MAX_TOPICS = 8;
  const TOPIC_CHARS = 48;

  function clip(text, n) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, n == null ? 180 : n);
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
    return { topics: [worldTopic()], currentId: WORLD_ID };
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

  function parseNewsPrefs(raw) {
    const next = blankNewsPrefs();
    if (!raw || typeof raw !== "object") return next;
    const list = Array.isArray(raw.newsPrefs) ? raw.newsPrefs : Array.isArray(raw.topics) ? raw.topics : [];
    const topics = list.map(parseTopic).filter(Boolean);
    const hasWorld = topics.some((t) => t.id === WORLD_ID);
    next.topics = (hasWorld ? topics : [worldTopic()].concat(topics)).slice(0, MAX_TOPICS);
    const want = typeof raw.currentNewsId === "string" ? raw.currentNewsId : typeof raw.currentId === "string" ? raw.currentId : WORLD_ID;
    next.currentId = next.topics.some((t) => t.id === want) ? want : WORLD_ID;
    return next;
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
    if (house.topics.some((t) => t.id === id)) house.currentId = id;
    return house;
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
      const link = clip(decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1]), 240);
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
    if (unread && (!items || !items.length)) return CANT_REACH;
    if (!items || !items.length) return NO_HEADLINES;
    return items[0].title;
  }

  function sourceLine(topic) {
    const row = topic && topic.id === WORLD_ID ? null : topic;
    return row && row.query ? `${TOPIC_SOURCE} · ${row.name}` : NEWS_SOURCE;
  }

  const api = {
    NEWS_SOURCE,
    TOPIC_SOURCE,
    NEWS_HOST,
    TOPIC_HOST,
    CANT_REACH,
    NO_HEADLINES,
    TOPIC_LABEL,
    TOPIC_PLACEHOLDER,
    TOPIC_TRUTH,
    WORLD_ID,
    MAX_TOPICS,
    blankNewsPrefs,
    parseTopic,
    parseNewsPrefs,
    currentTopic,
    addTopic,
    removeTopic,
    pickTopic,
    newsUrl,
    topicRssUrl,
    parseRss,
    parseNews,
    newsLine,
    sourceLine,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetNews = api;
})(typeof window !== "undefined" ? window : globalThis);
