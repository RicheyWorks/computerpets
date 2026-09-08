/** Overlay leftover house: weather/news plates, Sip, clips, music, ribbon carry. */
(function (root) {
  function $(id) {
    return document.getElementById(id);
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
    line.textContent = A.plateLine(areas, live, unread);
    if (!body) return;
    const area = A.currentArea(areas);
    const liveBits = [];
    if (!area) liveBits.push(`<p>${A.NO_AREA}</p>`);
    else if (unread) liveBits.push(`<p>${area.name} · unread</p>`);
    else if (live) liveBits.push(`<p>${area.name}. ${live.label}. Open-Meteo.</p>`);
    if (live && live.daily) {
      liveBits.push("<ul>");
      for (const d of live.daily) {
        liveBits.push(`<li>${d.day} · ${d.sky}${d.maxC != null ? ` · ${Math.round(d.maxC)}°` : ""}</li>`);
      }
      liveBits.push("</ul>");
    }
    liveBits.push("<ul>");
    for (const row of areas.areas) {
      liveBits.push(
        `<li><button type="button" data-hit data-area-pick="${row.id}" data-on="${row.id === areas.currentId ? "1" : "0"}">${row.name}</button> <button type="button" data-hit data-area-del="${row.id}">Remove</button></li>`,
      );
    }
    liveBits.push("</ul>");
    const liveBox = $("weather-live");
    if (liveBox) liveBox.innerHTML = liveBits.join("");
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
        liveBox.innerHTML = `<p>${source}</p><p>${N.FAVORITES_EMPTY}</p>`;
      } else {
        const bits = prefs.favorites
          .map((fav) => {
            if (fav.kind === "topic") {
              return `<li><button type="button" data-hit data-news-pick="${fav.topicId}">${fav.title}</button> <button type="button" class="news-star" data-hit data-news-unfav="${fav.id}">★</button></li>`;
            }
            const link = fav.url
              ? `<a data-hit href="${fav.url}" target="_blank" rel="noreferrer">${fav.title}</a>`
              : fav.title;
            return `<li>${link}${fav.summary ? `<p>${fav.summary}</p>` : ""} <button type="button" class="news-star" data-hit data-news-unfav="${fav.id}">★</button></li>`;
          })
          .join("");
        liveBox.innerHTML = `<p>${source}</p><ul>${bits}</ul>`;
      }
      return;
    }

    if (tab === "x" && unread && (!items || !items.length)) {
      const open = N.xSearchUrl(topic.query || "news");
      liveBox.innerHTML = `<p>${source}</p><p>${N.CANT_REACH}</p><p><a data-hit href="${open}" target="_blank" rel="noreferrer">Open on X</a></p>`;
      return;
    }
    if (tab === "x" && (!items || !items.length)) {
      const open = N.xSearchUrl(topic.query || "news");
      liveBox.innerHTML = `<p>${source}</p><p>${N.NO_HEADLINES}</p><p><a data-hit href="${open}" target="_blank" rel="noreferrer">Open on X</a></p>`;
      return;
    }
    if (unread && (!items || !items.length)) {
      liveBox.innerHTML = `<p>${source}</p><p>${N.CANT_REACH}</p>`;
      return;
    }
    if (!items || !items.length) {
      liveBox.innerHTML = `<p>${source}</p><p>${N.NO_HEADLINES}</p>`;
      return;
    }
    liveBox.innerHTML = `<p>${source}</p><ul>${items
      .map((it) => {
        const starred = N.isFavorite(prefs, { kind: "headline", title: it.title, url: it.url, summary: it.summary });
        return `<li><a data-hit href="${it.url}" target="_blank" rel="noreferrer">${it.title}</a>${it.summary ? `<p>${it.summary}</p>` : ""} <button type="button" class="news-star" data-hit data-news-fav-headline="${encodeURIComponent(it.title)}" data-url="${encodeURIComponent(it.url || "")}" data-summary="${encodeURIComponent(it.summary || "")}">${starred ? "★" : "☆"}</button></li>`;
      })
      .join("")}</ul>`;
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
      if (!house.tickers.length) liveBox.innerHTML = `<p>${M.NO_QUOTE}</p>`;
      else {
        const rows = house.tickers
          .map((row) => {
            const keyed = row.geckoId ? coinLives[row.geckoId] : null;
            const addrKey = row.address ? coinLives[row.platform + ":" + row.address] || coinLives[row.address] : null;
            const rowLive = keyed || addrKey || (ticker && row.id === ticker.id ? live : null);
            const price = rowLive ? M.formatPrice(rowLive.price) : unread && ticker && row.id === ticker.id ? M.CANT_REACH : "…";
            const kind = row.address ? (row.platform === "solana" ? "mint" : "contract") : row.kind;
            return `<li data-on="${row.id === house.currentId ? "1" : "0"}"><strong>${row.symbol}</strong> · ${price} <span class="market-kind">${kind}</span></li>`;
          })
          .join("");
        liveBox.innerHTML = `<ul class="market-live-list">${rows}</ul>`;
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
      if (!nft) nftBox.innerHTML = `<p>${M.NO_NFT}</p>`;
      else if (nftUnread && !nftLive) nftBox.innerHTML = `<p>${nft.symbol || nft.name} · ${M.CANT_REACH}</p>`;
      else if (!nftLive) nftBox.innerHTML = `<p>${nft.symbol || nft.name} · looking up</p>`;
      else {
        const floor =
          nftLive.floorUsd != null
            ? "$" + M.formatPrice(nftLive.floorUsd)
            : nftLive.floorNative != null
              ? M.formatPrice(nftLive.floorNative) + " " + (nftLive.nativeSymbol || "")
              : "—";
        nftBox.innerHTML = `<p>${nft.name}. Floor ${floor}. CoinGecko.</p>`;
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
        favBox.innerHTML = `<p>${M.FAVORITES_EMPTY || "No favorites yet — star a coin or NFT."}</p>`;
      } else {
        const coinBits = fav.tickers
          .map((row) => `<li><button type="button" data-hit data-ticker-pick="${row.id}">${row.symbol}</button> <button type="button" class="market-star" data-hit data-ticker-fav="${row.id}">★</button></li>`)
          .join("");
        const nftBits = fav.nfts
          .map((row) => `<li><button type="button" data-hit data-nft-pick="${row.id}">${row.symbol || row.name}</button> <button type="button" class="market-star" data-hit data-nft-fav="${row.id}">★</button></li>`)
          .join("");
        favBox.innerHTML = `${coinBits ? `<h4 class="market-subhead">Coins</h4><ul>${coinBits}</ul>` : ""}${nftBits ? `<h4 class="market-subhead">NFTs</h4><ul>${nftBits}</ul>` : ""}`;
      }
    }

  }

  function weatherRect() {
    const el = $("weather-plate");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { id: "desk-weather", x: r.left, y: r.top, width: r.width, height: r.height };
  }

  const api = { playVoice, playStep, paintWeather, paintNews, paintMarket, weatherRect, clipEl };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskHouse = api;
})(typeof window !== "undefined" ? window : globalThis);
