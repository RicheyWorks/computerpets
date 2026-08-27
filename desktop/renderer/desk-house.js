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
    let liveBox = $("weather-live");
    if (!liveBox) {
      body.innerHTML = "";
      liveBox = document.createElement("div");
      liveBox.id = "weather-live";
      body.appendChild(liveBox);
      const truth = document.createElement("p");
      truth.className = "keeper-truth";
      truth.textContent = A.AREA_TRUTH || "Weather area. Named places you add. Not the radio station.";
      body.appendChild(truth);
      const form = document.createElement("form");
      form.id = "weather-add";
      form.innerHTML = `<label>Weather area<input data-hit id="weather-q" type="text" autocomplete="off" spellcheck="false" placeholder="${A.AREA_PLACEHOLDER || "A city or place — weather, not radio"}" aria-label="Weather area" /></label><button data-hit type="submit">Look up</button>`;
      body.appendChild(form);
      const hits = document.createElement("ul");
      hits.id = "weather-hits";
      body.appendChild(hits);
    }
    liveBox.innerHTML = liveBits.join("");
  }

  function paintNews(items, unread) {
    const N = root.PetNews;
    const line = $("news-line");
    const body = $("news-body");
    if (!N || !line) return;
    line.textContent = N.newsLine(items, unread);
    if (!body) return;
    if (unread && (!items || !items.length)) body.innerHTML = `<p>${N.CANT_REACH}</p>`;
    else if (!items || !items.length) body.innerHTML = `<p>${N.NO_HEADLINES}</p>`;
    else {
      body.innerHTML = `<p>${N.NEWS_SOURCE}</p><ul>${items
        .map((it) => `<li><a data-hit href="${it.url}" target="_blank" rel="noreferrer">${it.title}</a></li>`)
        .join("")}</ul>`;
    }
  }

  function weatherRect() {
    const el = $("weather-plate");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { id: "desk-weather", x: r.left, y: r.top, width: r.width, height: r.height };
  }

  const api = { playVoice, playStep, paintWeather, paintNews, weatherRect, clipEl };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetDeskHouse = api;
})(typeof window !== "undefined" ? window : globalThis);
