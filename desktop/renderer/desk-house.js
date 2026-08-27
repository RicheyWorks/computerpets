/** Overlay leftover house: weather/news plates, Sip, clips, music, ribbon carry. */
(function (root) {
  function $(id) {
    return document.getElementById(id);
  }

  function clipEl(src, volume) {
    try {
      const audio = new Audio(src);
      audio.volume = Math.max(0, Math.min(1, volume == null ? 0.8 : volume));
      void audio.play();
      return audio;
    } catch {
      return null;
    }
  }

  function playVoice(key, card) {
    const S = root.PetHouseSounds;
    const C = root.PetCard;
    if (!S || !S.isVoiceKey(key)) return;
    if (C && C.isMuted(card && card.mutes, "voice")) return;
    const guest = C ? C.guestOf(card, key) : { volume: 80 };
    clipEl(S.overlayVoiceSrc(key), guest.volume / 100);
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
    const source = N.sourceLine(topic);
    const topics = $("news-topics");
    if (topics) {
      topics.replaceChildren();
      for (const row of prefs.topics) {
        const li = document.createElement("li");
        const pick = document.createElement("button");
        pick.type = "button";
        pick.dataset.hit = "1";
        pick.dataset.newsPick = row.id;
        pick.dataset.on = row.id === prefs.currentId ? "1" : "0";
        pick.textContent = row.name;
        li.appendChild(pick);
        if (row.id !== N.WORLD_ID) {
          const del = document.createElement("button");
          del.type = "button";
          del.dataset.hit = "1";
          del.dataset.newsDel = row.id;
          del.textContent = "Remove";
          li.appendChild(del);
        }
        topics.appendChild(li);
      }
    }
    if (unread && (!items || !items.length)) liveBox.innerHTML = `<p>${source}</p><p>${N.CANT_REACH}</p>`;
    else if (!items || !items.length) liveBox.innerHTML = `<p>${source}</p><p>${N.NO_HEADLINES}</p>`;
    else {
      liveBox.innerHTML = `<p>${source}</p><ul>${items
        .map((it) => `<li><a data-hit href="${it.url}" target="_blank" rel="noreferrer">${it.title}</a>${it.summary ? `<p>${it.summary}</p>` : ""}</li>`)
        .join("")}</ul>`;
    }
  }

  function paintMarket(card, live, unread) {
    const M = root.PetMarket;
    const line = $("market-line");
    if (!M || !line) return;
    const house = M.parseMarket(card || {});
    line.textContent = M.plateLine(house, live, unread);
    const liveBox = $("market-live");
    const list = $("market-tickers");
    const ticker = M.currentTicker(house);
    if (liveBox) {
      if (!ticker) liveBox.innerHTML = `<p>${M.NO_QUOTE}</p>`;
      else if (unread && !live) liveBox.innerHTML = `<p>${ticker.symbol} · ${M.CANT_REACH}</p>`;
      else if (!live) liveBox.innerHTML = `<p>${ticker.symbol} · looking up</p>`;
      else liveBox.innerHTML = `<p>${ticker.symbol}. ${live.name}. ${live.price} ${live.currency}. ${live.source === "coingecko" ? "CoinGecko" : "Yahoo"}.</p>`;
    }
    if (list) {
      list.replaceChildren();
      for (const row of house.tickers) {
        const li = document.createElement("li");
        const pick = document.createElement("button");
        pick.type = "button";
        pick.dataset.hit = "1";
        pick.dataset.tickerPick = row.id;
        pick.dataset.on = row.id === house.currentId ? "1" : "0";
        pick.textContent = row.symbol;
        const del = document.createElement("button");
        del.type = "button";
        del.dataset.hit = "1";
        del.dataset.tickerDel = row.id;
        del.textContent = "Remove";
        li.append(pick, del);
        list.appendChild(li);
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
