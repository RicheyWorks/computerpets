/** Overlay leftover house: weather/news plates, Sip, clips, music, ribbon carry. */
(function (root) {
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Build one element. Feed words (headlines, places, coin and NFT names) go in as
   * text nodes, never as markup, so a title like <img onerror> shows as those letters.
   * props: text, data (dataset), and plain properties (type, className, title, href...).
   */
  function el(tag, props, kids) {
    const node = document.createElement(tag);
    const p = props || {};
    Object.keys(p).forEach((key) => {
      const value = p[key];
      if (value == null || value === false) return;
      if (key === "text") node.textContent = String(value);
      else if (key === "data") Object.keys(value).forEach((k) => (node.dataset[k] = String(value[k])));
      else node[key] = value;
    });
    (kids || []).forEach((kid) => {
      if (kid == null || kid === false || kid === "") return;
      node.append(kid);
    });
    return node;
  }

  /** A paragraph of plain text. */
  function para(text) {
    return el("p", { text });
  }

  /** Only a web page may become a link. Anything else stays plain words. */
  function webLink(url) {
    const text = String(url || "");
    return /^https?:\/\//i.test(text) ? text : "";
  }

  function link(url, text) {
    const href = webLink(url);
    if (!href) return text;
    return el("a", { href, target: "_blank", rel: "noreferrer", data: { hit: "1" }, text });
  }

  function clipEl(src, volume, onFail) {
    if (!src) return null;
    try {
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, volume == null ? 0.8 : volume));
      const started = audio.play();
      if (started && typeof started.then === "function") {
        started.catch(function () {
          if (typeof onFail === "function") onFail();
        });
      }
      return audio;
    } catch {
      return null;
    }
  }

  let lastVoiceAt = 0;

  /** Play species cry. Returns true if playback was started (or recently started). onFail runs if play() rejects. */
  function playVoice(key, card, onFail) {
    const S = root.PetHouseSounds;
    const C = root.PetCard;
    if (!S || !S.isVoiceKey(key)) {
      if (typeof onFail === "function") onFail();
      return false;
    }
    if (C && C.isMuted(card && card.mutes, "voice")) {
      if (typeof onFail === "function") onFail();
      return false;
    }
    const now = Date.now();
    if (now - lastVoiceAt < 450) return true;
    const guest = C ? C.guestOf(card, key) : { volume: 80 };
    const src = S.overlayVoiceSrc(key);
    if (!src) {
      if (typeof onFail === "function") onFail();
      return false;
    }
    const audio = clipEl(src, guest.volume / 100, onFail);
    if (!audio) {
      if (typeof onFail === "function") onFail();
      return false;
    }
    lastVoiceAt = now;
    return true;
  }

  function playStep(key, card) {
    const S = root.PetHouseSounds;
    const C = root.PetCard;
    if (!S) return;
    if (C && C.isMuted(card && card.mutes, "step")) return;
    const guest = C ? C.guestOf(card, key) : { volume: 80, stepKind: "" };
    const kind = S.stepOf(card && card.stepKind, guest.stepKind, key);
    if (kind === "mute") return;
    const src = S.overlayStepSrc(kind, key);
    if (src) clipEl(src, guest.volume / 100);
  }

  function paintWeather(card, live, unread) {
    const A = root.PetWeatherAreas;
    const line = $("weather-line");
    const body = $("weather-body");
    if (!A || !line) return;
    const areas = A.parseAreas(card);
    const tab = areas.tab || "current";
    const gate = A.forecastGate ? A.forecastGate(card, card.hereForecastAck) : { act: "none", area: null };
    const held = gate.act === "hold";
    const panelOpen = Boolean(body && !body.hidden);
    const lineInView = panelOpen && tab === "current";
    const waiting = !live && gate.act === "send" && !lineInView;
    line.textContent = A.plateLine(areas, live, unread, held, waiting);
    const net = $("weather-forecast-net");
    if (net && A.forecastHonesty) {
      net.textContent = A.forecastHonesty(gate);
      net.hidden = !net.textContent;
    }
    const lookNet = $("weather-geocode-net");
    if (lookNet && A.geocodeHonesty) lookNet.textContent = A.geocodeHonesty("look");
    const revNet = $("weather-reverse-net");
    if (revNet && A.geocodeHonesty) revNet.textContent = A.geocodeHonesty("reverse");
    const savedAsk = $("weather-saved-ask");
    if (savedAsk) savedAsk.hidden = !held;
    const savedAskLine = $("weather-saved-ask-line");
    if (savedAskLine && A.SAVED_HERE_ASK) savedAskLine.textContent = A.SAVED_HERE_ASK;
    if (!body) return;
    const tabs = $("weather-tabs");
    if (tabs) {
      tabs.querySelectorAll("[data-weather-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-weather-tab") === tab;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.dataset.on = on ? "1" : "0";
      });
    }
    const currentPanel = $("weather-current-panel");
    if (currentPanel) currentPanel.hidden = tab !== "current";
    const liveBox = $("weather-live");
    if (!liveBox) return;
    if (tab === "favorites") {
      const favs = A.favoriteAreas ? A.favoriteAreas(areas) : [];
      if (!favs.length) {
        liveBox.replaceChildren(para(A.FAVORITES_EMPTY || "No favorites yet — star a place."));
      } else {
        liveBox.replaceChildren(
          el(
            "ul",
            null,
            favs.map((row) =>
              el("li", null, [
                el("button", { type: "button", data: { hit: "1", areaPick: row.id, on: row.id === areas.currentId ? "1" : "0" }, text: row.name }),
                " ",
                el("button", { type: "button", className: "weather-star", data: { hit: "1", areaFav: row.id }, text: "★" }),
              ]),
            ),
          ),
        );
      }
      return;
    }
    const area = A.currentArea(areas);
    const liveBits = [];
    if (!area) liveBits.push(para(A.NO_AREA));
    else if (held) liveBits.push(para(`${area.name} · ${A.SAVED_HERE_WAIT}`));
    else if (unread) liveBits.push(para(`${area.name} · unread`));
    else if (live) liveBits.push(para(`${area.name}. ${live.label}. Open-Meteo.`));
    if (live && live.daily && !held) {
      const dayWord = (d) => (A.dayLabel ? A.dayLabel(d) : d.sky);
      liveBits.push(
        el(
          "ul",
          null,
          live.daily.map((d) => el("li", { text: `${d.day} · ${dayWord(d)}${d.maxC != null ? ` · ${Math.round(d.maxC)}°` : ""}` })),
        ),
      );
    }
    liveBits.push(
      el(
        "ul",
        null,
        areas.areas.map((row) => {
          const starred = A.isFavorite ? A.isFavorite(areas, row.id) : false;
          return el("li", null, [
            el("button", { type: "button", data: { hit: "1", areaPick: row.id, on: row.id === areas.currentId ? "1" : "0" }, text: row.name }),
            " ",
            el("button", { type: "button", className: "weather-star", title: "Favorite place", data: { hit: "1", areaFav: row.id }, text: starred ? "★" : "☆" }),
            " ",
            el("button", { type: "button", data: { hit: "1", areaDel: row.id }, text: "Remove" }),
          ]);
        }),
      ),
    );
    liveBox.replaceChildren(...liveBits);
  }

  function paintNews(items, unread, card) {
    const N = root.PetNews;
    const line = $("news-line");
    if (!N || !line) return;
    line.textContent = N.newsLine(items, unread);
    const liveBox = $("news-live");
    if (!liveBox) return;
    const prefs = N.parseNewsPrefs(card || {});
    const topic = N.currentTopic(prefs);
    const tab = prefs.tab || "popular";
    const source = N.sourceLine(topic, tab);
    const tabs = $("news-tabs");
    if (tabs) {
      tabs.querySelectorAll("[data-news-tab]").forEach((btn) => {
        const on = btn.getAttribute("data-news-tab") === tab;
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.dataset.on = on ? "1" : "0";
      });
    }
    const topicsPanel = $("news-topics-panel");
    if (topicsPanel) topicsPanel.hidden = tab !== "topics";
    const truth = $("news-truth");
    if (truth) truth.textContent = N.TOPIC_TRUTH;
    const chips = $("news-chips");
    if (chips) {
      chips.replaceChildren();
      for (const name of N.SUGGESTION_TOPICS || []) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.hit = "1";
        btn.dataset.newsChip = name;
        btn.textContent = name;
        chips.appendChild(btn);
      }
    }
    const topics = $("news-topics");
    if (topics) {
      topics.replaceChildren();
      prefs.topics.forEach((row, idx) => {
        const li = document.createElement("li");
        const pick = document.createElement("button");
        pick.type = "button";
        pick.dataset.hit = "1";
        pick.dataset.newsPick = row.id;
        pick.dataset.on = row.id === prefs.currentId ? "1" : "0";
        pick.textContent = row.name;
        li.appendChild(pick);
        const star = document.createElement("button");
        star.type = "button";
        star.className = "news-star";
        star.dataset.hit = "1";
        star.dataset.newsFavTopic = row.id;
        star.textContent = N.isFavorite(prefs, { kind: "topic", id: row.id, name: row.name, query: row.query }) ? "★" : "☆";
        star.title = "Favorite topic";
        if (row.id !== N.WORLD_ID) li.appendChild(star);
        if (row.id !== N.WORLD_ID) {
          const up = document.createElement("button");
          up.type = "button";
          up.dataset.hit = "1";
          up.dataset.newsMove = row.id;
          up.dataset.dir = "-1";
          up.textContent = "Up";
          up.disabled = idx <= 1;
          const down = document.createElement("button");
          down.type = "button";
          down.dataset.hit = "1";
          down.dataset.newsMove = row.id;
          down.dataset.dir = "1";
          down.textContent = "Down";
          down.disabled = idx === prefs.topics.length - 1;
          const del = document.createElement("button");
          del.type = "button";
          del.dataset.hit = "1";
          del.dataset.newsDel = row.id;
          del.textContent = "Remove";
          li.append(up, down, del);
        }
        topics.appendChild(li);
      });
    }

    if (tab === "favorites") {
      if (!prefs.favorites.length) {
        liveBox.replaceChildren(para(source), para(N.FAVORITES_EMPTY));
      } else {
        const rows = prefs.favorites.map((fav) => {
          const unfav = el("button", { type: "button", className: "news-star", data: { hit: "1", newsUnfav: fav.id }, text: "★" });
          if (fav.kind === "topic") {
            return el("li", null, [el("button", { type: "button", data: { hit: "1", newsPick: fav.topicId }, text: fav.title }), " ", unfav]);
          }
          return el("li", null, [link(fav.url, fav.title), fav.summary ? para(fav.summary) : null, " ", unfav]);
        });
        liveBox.replaceChildren(para(source), el("ul", null, rows));
      }
      return;
    }

    if (tab === "x" && (!items || !items.length)) {
      const open = N.xSearchUrl(topic.query || "news");
      liveBox.replaceChildren(para(source), para(unread ? N.CANT_REACH : N.NO_HEADLINES), el("p", null, [link(open, "Open on X")]));
      return;
    }
    if (!items || !items.length) {
      liveBox.replaceChildren(para(source), para(unread ? N.CANT_REACH : N.NO_HEADLINES));
      return;
    }
    const rows = items.map((it) => {
      const starred = N.isFavorite(prefs, { kind: "headline", title: it.title, url: it.url, summary: it.summary });
      const star = el("button", {
        type: "button",
        className: "news-star",
        data: {
          hit: "1",
          newsFavHeadline: encodeURIComponent(it.title),
          url: encodeURIComponent(it.url || ""),
          summary: encodeURIComponent(it.summary || ""),
        },
        text: starred ? "★" : "☆",
      });
      return el("li", null, [link(it.url, it.title), it.summary ? para(it.summary) : null, " ", star]);
    });
    liveBox.replaceChildren(para(source), el("ul", null, rows));
  }

  function paintMarket(card, live, unread, extras) {
    const M = root.PetMarket;
    const line = $("market-line");
    if (!M || !line) return;
    const house = M.parseMarket(card || {});
    const coinLives = (extras && extras.coinLives) || {};
    const nftLive = extras && extras.nftLive;
    const nftUnread = !!(extras && extras.nftUnread);
    line.textContent = M.plateLine(house, live, unread);
    const liveBox = $("market-live");
    const list = $("market-tickers");
    const ticker = M.currentTicker(house);
    if (liveBox) {
      if (!house.tickers.length) liveBox.replaceChildren(para(M.NO_QUOTE));
      else {
        const rows = house.tickers.map((row) => {
          const keyed = row.geckoId ? coinLives[row.geckoId] : null;
          const addrKey = row.address ? coinLives[row.platform + ":" + row.address] || coinLives[row.address] : null;
          const rowLive = keyed || addrKey || (ticker && row.id === ticker.id ? live : null);
          const price = rowLive ? M.formatPrice(rowLive.price) : unread && ticker && row.id === ticker.id ? M.CANT_REACH : "…";
          const kind = row.address ? (row.platform === "solana" ? "mint" : "contract") : row.kind;
          return el("li", { data: { on: row.id === house.currentId ? "1" : "0" } }, [
            el("strong", { text: row.symbol }),
            ` · ${price} `,
            el("span", { className: "market-kind", text: kind }),
          ]);
        });
        liveBox.replaceChildren(el("ul", { className: "market-live-list" }, rows));
      }
    }
    if (list) {
      list.replaceChildren();
      house.tickers.forEach((row, idx) => {
        const li = document.createElement("li");
        const pick = document.createElement("button");
        pick.type = "button";
        pick.dataset.hit = "1";
        pick.dataset.tickerPick = row.id;
        pick.dataset.on = row.id === house.currentId ? "1" : "0";
        pick.textContent = row.symbol + (row.name && row.name !== row.symbol ? " · " + row.name : "");
        const up = document.createElement("button");
        up.type = "button";
        up.dataset.hit = "1";
        up.dataset.tickerMove = row.id;
        up.dataset.dir = "-1";
        up.textContent = "Up";
        up.disabled = idx === 0;
        const down = document.createElement("button");
        down.type = "button";
        down.dataset.hit = "1";
        down.dataset.tickerMove = row.id;
        down.dataset.dir = "1";
        down.textContent = "Down";
        down.disabled = idx === house.tickers.length - 1;
        const del = document.createElement("button");
        del.type = "button";
        del.dataset.hit = "1";
        del.dataset.tickerDel = row.id;
        del.textContent = "Remove";
        const star = document.createElement("button");
        star.type = "button";
        star.className = "market-star";
        star.dataset.hit = "1";
        star.dataset.tickerFav = row.id;
        star.textContent = M.isFavoriteTicker && M.isFavoriteTicker(house, row.id) ? "★" : "☆";
        star.title = "Favorite coin";
        li.append(pick, star, up, down, del);
        list.appendChild(li);
      });
    }
    const nftBox = $("nft-live");
    if (nftBox) {
      const nft = M.currentNft(house);
      if (!nft) nftBox.replaceChildren(para(M.NO_NFT));
      else if (nftUnread && !nftLive) nftBox.replaceChildren(para(`${nft.symbol || nft.name} · ${M.CANT_REACH}`));
      else if (!nftLive) nftBox.replaceChildren(para(`${nft.symbol || nft.name} · looking up`));
      else {
        const floor =
          nftLive.floorUsd != null
            ? "$" + M.formatPrice(nftLive.floorUsd)
            : nftLive.floorNative != null
              ? M.formatPrice(nftLive.floorNative) + " " + (nftLive.nativeSymbol || "")
              : "—";
        nftBox.replaceChildren(para(`${nft.name}. Floor ${floor}. CoinGecko.`));
      }
    }
    const nfts = $("nft-collections");
    if (nfts) {
      nfts.replaceChildren();
      house.nfts.forEach((row, idx) => {
        const li = document.createElement("li");
        const pick = document.createElement("button");
        pick.type = "button";
        pick.dataset.hit = "1";
        pick.dataset.nftPick = row.id;
        pick.dataset.on = row.id === house.currentNftId ? "1" : "0";
        pick.textContent = (row.symbol || row.name) + " · " + row.name;
        const up = document.createElement("button");
        up.type = "button";
        up.dataset.hit = "1";
        up.dataset.nftMove = row.id;
        up.dataset.dir = "-1";
        up.textContent = "Up";
        up.disabled = idx === 0;
        const down = document.createElement("button");
        down.type = "button";
        down.dataset.hit = "1";
        down.dataset.nftMove = row.id;
        down.dataset.dir = "1";
        down.textContent = "Down";
        down.disabled = idx === house.nfts.length - 1;
        const del = document.createElement("button");
        del.type = "button";
        del.dataset.hit = "1";
        del.dataset.nftDel = row.id;
        del.textContent = "Remove";
        const star = document.createElement("button");
        star.type = "button";
        star.className = "market-star";
        star.dataset.hit = "1";
        star.dataset.nftFav = row.id;
        star.textContent = M.isFavoriteNft && M.isFavoriteNft(house, row.id) ? "★" : "☆";
        star.title = "Favorite NFT";
        li.append(pick, star, up, down, del);
        nfts.appendChild(li);
      });
    }
    const markets = $("nft-marketplaces");
    if (markets) {
      markets.replaceChildren();
      house.marketplaces.forEach((row, idx) => {
        const li = document.createElement("li");
        li.className = "nft-marketplace-row";
        const label = document.createElement("span");
        label.textContent = row.name;
        const note = document.createElement("span");
        note.className = "market-kind";
        note.textContent = row.note || "offline";
        const up = document.createElement("button");
        up.type = "button";
        up.dataset.hit = "1";
        up.dataset.mpMove = row.id;
        up.dataset.dir = "-1";
        up.textContent = "Up";
        up.disabled = idx === 0;
        const down = document.createElement("button");
        down.type = "button";
        down.dataset.hit = "1";
        down.dataset.mpMove = row.id;
        down.dataset.dir = "1";
        down.textContent = "Down";
        down.disabled = idx === house.marketplaces.length - 1;
        const del = document.createElement("button");
        del.type = "button";
        del.dataset.hit = "1";
        del.dataset.mpDel = row.id;
        del.textContent = "Remove";
        li.append(label, note, up, down, del);
        markets.appendChild(li);
      });
    }
    const catalog = $("nft-marketplace-catalog");
    if (catalog && M.NFT_MARKETPLACES) {
      catalog.replaceChildren();
      const have = new Set(house.marketplaces.map((m) => m.id));
      for (const row of M.NFT_MARKETPLACES) {
        if (have.has(row.id)) continue;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.hit = "1";
        btn.dataset.mpAdd = row.id;
        btn.textContent = "Add " + row.name;
        catalog.appendChild(btn);
      }
    }
    const favBox = $("market-favorites");
    if (favBox && M.favoriteRows) {
      const fav = M.favoriteRows(house);
      if (!fav.tickers.length && !fav.nfts.length) {
        favBox.replaceChildren(para(M.FAVORITES_EMPTY || "No favorites yet — star a coin or NFT."));
      } else {
        const coinRows = fav.tickers.map((row) =>
          el("li", null, [
            el("button", { type: "button", data: { hit: "1", tickerPick: row.id }, text: row.symbol }),
            " ",
            el("button", { type: "button", className: "market-star", data: { hit: "1", tickerFav: row.id }, text: "★" }),
          ]),
        );
        const nftRows = fav.nfts.map((row) =>
          el("li", null, [
            el("button", { type: "button", data: { hit: "1", nftPick: row.id }, text: row.symbol || row.name }),
            " ",
            el("button", { type: "button", className: "market-star", data: { hit: "1", nftFav: row.id }, text: "★" }),
          ]),
        );
        const parts = [];
        if (coinRows.length) parts.push(el("h4", { className: "market-subhead", text: "Coins" }), el("ul", null, coinRows));
        if (nftRows.length) parts.push(el("h4", { className: "market-subhead", text: "NFTs" }), el("ul", null, nftRows));
        favBox.replaceChildren(...parts);
      }
    }

  }

  function weatherRect() {
    const el = $("weather-plate");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { id: "desk-weather", x: r.left, y: r.top, width: r.width, height: r.height };
  }

  const api = { playVoice, playStep, paintWeather, paintNews, paintMarket, weatherRect, clipEl, webLink };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskHouse = api;
})(typeof window !== "undefined" ? window : globalThis);
