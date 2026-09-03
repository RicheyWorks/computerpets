import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  addArea,
  currentArea,
  forecastUrl,
  geocodeUrl,
  AREA_LABEL,
  AREA_PLACEHOLDER,
  AREA_TRUTH,
  CANT_REACH as WEATHER_CANT_REACH,
  HERE_FAIL,
  ipPlaceUrl,
  NO_AREA,
  parseForecast,
  parseGeocode,
  parseIpPlace,
  parseReverse,
  pickArea,
  plateLine,
  removeArea,
  renameArea,
  reverseUrl,
  TYPE_A_CITY,
  type LiveSky,
  type WeatherArea,
} from "@/lib/pets/weather-areas";
import {
  addTopic,
  CANT_REACH,
  currentTopic,
  NEWS_SOURCE,
  newsLine,
  newsUrl,
  NO_HEADLINES,
  parseNews,
  parseNewsPrefs,
  parseRss,
  pickTopic,
  removeTopic,
  sourceLine,
  TOPIC_LABEL,
  TOPIC_PLACEHOLDER,
  TOPIC_TRUTH,
  topicRssUrl,
  WORLD_ID,
  type NewsItem,
} from "@/lib/pets/news";
import {
  addTicker,
  currentTicker,
  geckoUrl,
  MARKET_LABEL,
  MARKET_PLACEHOLDER,
  MARKET_TRUTH,
  NO_QUOTE,
  parseGecko,
  parseMarket,
  parseTicker,
  parseYahoo,
  pickTicker,
  plateLine as marketLine,
  removeTicker,
  yahooUrl,
  type MarketLive,
} from "@/lib/pets/market";
import { loadCard, saveCard, type CardPrefs } from "@/lib/pets/card";
import type { DeskWindow } from "@/lib/pets/windows";
import {
  SWATCHES,
  applySwatch,
  beginDrag,
  clickMoved,
  endDrag,
  loadPlates,
  moveDrag,
  paintStyle,
  plateOf,
  savePlates,
  setColors,
  type DeskPlate,
  type PlateKey,
} from "@/lib/pets/desk-plates";
import { cn } from "@/lib/utils";


function usePlateChrome(key: PlateKey) {
  const [plate, setPlate] = useState<DeskPlate | null>(null);
  const press = useRef<{ x: number; y: number } | null>(null);
  const skipToggle = useRef(false);
  const plateRef = useRef(plate);
  plateRef.current = plate;

  useEffect(() => {
    const row = plateOf(loadPlates(window.innerWidth, window.innerHeight), key);
    setPlate(row);
  }, [key]);

  function persist(next: DeskPlate) {
    const all = loadPlates(window.innerWidth, window.innerHeight).map((p) => (p.key === key ? next : p));
    savePlates(all);
    setPlate(endDrag(next));
  }

  function onTogglePointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    press.current = { x: e.clientX, y: e.clientY };
    skipToggle.current = false;
  }

  function onTogglePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId) || !press.current || !plateRef.current) return;
    let row = plateRef.current;
    if (!row.dragging && clickMoved(e.clientX - press.current.x, e.clientY - press.current.y)) {
      row = beginDrag(row, press.current.x, press.current.y);
      skipToggle.current = true;
      setPlate(row);
    }
    if (row.dragging) {
      const box = e.currentTarget.closest("article")?.getBoundingClientRect();
      row = moveDrag(row, e.clientX, e.clientY, window.innerWidth, window.innerHeight, box?.width, box?.height);
      setPlate(row);
    }
  }

  function onTogglePointerUp() {
    const row = plateRef.current;
    if (row?.dragging) persist(endDrag(row));
    press.current = null;
  }

  function toggleOpen(setter: (v: boolean | ((b: boolean) => boolean)) => void) {
    if (skipToggle.current) {
      skipToggle.current = false;
      return;
    }
    setter((v) => !v);
  }

  function recolor(patch: { bg?: string; fg?: string; muted?: string }) {
    if (!plateRef.current) return;
    persist(setColors(plateRef.current, patch));
  }

  function swatch(id: string) {
    if (!plateRef.current) return;
    persist(applySwatch(plateRef.current, id));
  }

  const style = plate ? (paintStyle(plate) as CSSProperties) : undefined;

  const colorUi = plate ? (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 text-xs">
        Plate color
        <input type="color" aria-label="Plate color" value={plate.bg} onChange={(e) => recolor({ bg: e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-xs">
        Words
        <input type="color" aria-label="Words color" value={plate.fg} onChange={(e) => recolor({ fg: e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-xs">
        Label
        <input type="color" aria-label="Label color" value={plate.muted} onChange={(e) => recolor({ muted: e.target.value })} />
      </label>
      <div className="flex flex-wrap gap-1">
        {SWATCHES.map((row) => (
          <button
            key={row.id}
            type="button"
            title={row.name}
            aria-label={row.name}
            className="h-5 w-5 rounded-full border border-border/60 p-0"
            style={{ background: row.bg }}
            onClick={() => swatch(row.id)}
          />
        ))}
      </div>
    </div>
  ) : null;

  return {
    style,
    colorUi,
    onTogglePointerDown,
    onTogglePointerMove,
    onTogglePointerUp,
    toggleOpen,
  };
}

const WEATHER_ID = "desk-weather";
const NEWS_ID = "desk-news";

function writeCard(patch: Partial<CardPrefs>) {
  return saveCard({ ...loadCard(), ...patch });
}

function areasOf(card: CardPrefs) {
  return { areas: card.weatherAreas || [], currentId: card.currentAreaId ?? null };
}

export function DeskWeatherPlate({
  onBounds,
  onSky,
}: {
  onBounds?: (win: DeskWindow | null) => void;
  onSky?: (sky: LiveSky | null) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [card, setCard] = useState(() => loadCard());
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState<LiveSky | null>(null);
  const [unread, setUnread] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<WeatherArea[]>([]);
  const [looking, setLooking] = useState(false);
  const [hereLine, setHereLine] = useState("");
  const [lookLine, setLookLine] = useState("");
  const areas = useMemo(() => areasOf(card), [card]);
  const area = currentArea(areas);
  const chrome = usePlateChrome("weather");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const report = () => {
      const stage = el.closest("section") || el.parentElement;
      if (!stage) return;
      const a = el.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      onBounds?.({
        id: WEATHER_ID,
        x: a.left - b.left,
        y: a.top - b.top,
        width: a.width,
        height: a.height,
      });
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    window.addEventListener("resize", report);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", report);
    };
  }, [onBounds, open]);

  useEffect(() => {
    if (!area) {
      setLive(null);
      onSky?.(null);
      return;
    }
    let cancelled = false;
    const url = forecastUrl(area.lat, area.lon);
    if (!url) return;
    void fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const next = parseForecast(json);
        setUnread(!next);
        setLive(next);
        onSky?.(next);
      })
      .catch(() => {
        if (cancelled) return;
        setUnread(true);
        setLive(null);
        onSky?.(null);
      });
    return () => {
      cancelled = true;
    };
  }, [area?.id, area?.lat, area?.lon, onSky]);

  async function search() {
    const url = geocodeUrl(query);
    if (!url) {
      setLookLine(TYPE_A_CITY);
      setHits([]);
      return;
    }
    setLooking(true);
    setLookLine("");
    try {
      const json = await (await fetch(url)).json();
      const found = parseGeocode(json);
      setHits(found);
      if (!found.length) setLookLine("No place from that look-up.");
    } catch {
      setHits([]);
      setLookLine(WEATHER_CANT_REACH);
    } finally {
      setLooking(false);
    }
  }

  async function useHere() {
    setHereLine("");
    function keep(area: WeatherArea) {
      add(area);
      setHereLine("");
    }
    async function fromIp() {
      try {
        const json = await (await fetch(ipPlaceUrl())).json();
        const place = parseIpPlace(json);
        if (!place) {
          setHereLine(HERE_FAIL);
          return;
        }
        keep(place);
      } catch {
        setHereLine(WEATHER_CANT_REACH);
      }
    }
    if (!navigator.geolocation) {
      await fromIp();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = reverseUrl(pos.coords.latitude, pos.coords.longitude);
        if (!url) {
          keep({ id: "here", name: "This computer", query: "this computer", lat: pos.coords.latitude, lon: pos.coords.longitude });
          return;
        }
        void fetch(url)
          .then((r) => r.json())
          .then((json) => {
            const named = parseReverse(json);
            keep(named || { id: "here", name: "This computer", query: "this computer", lat: pos.coords.latitude, lon: pos.coords.longitude });
          })
          .catch(() => {
            void fromIp();
          });
      },
      () => {
        void fromIp();
      },
      { maximumAge: 600_000 },
    );
  }

  function keep(next: CardPrefs) {
    setCard(next);
  }

  function add(hit: WeatherArea) {
    const house = addArea(areas, hit);
    keep(writeCard({ weatherAreas: house.areas, currentAreaId: house.currentId }));
    setHits([]);
    setQuery("");
  }

  return (
    <article
      ref={ref}
      data-hit
      data-desk-plate="weather"
      className={cn(
        "desk-plate pointer-events-auto absolute z-[4] w-[min(18rem,42%)] rounded-sm border border-border/50 shadow-lg",
        open && "w-[min(22rem,52%)]",
      )}
      style={{
        ...chrome.style,
        background: "color-mix(in srgb, var(--plate-bg, #161412) 82%, transparent)",
        color: "var(--plate-fg, #f2ece3)",
      }}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
        onPointerDown={chrome.onTogglePointerDown}
        onPointerMove={chrome.onTogglePointerMove}
        onPointerUp={chrome.onTogglePointerUp}
        onClick={() => chrome.toggleOpen(setOpen)}
      >
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">Weather area</span>
        <span className="truncate text-sm text-ink">{plateLine(areas, live, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          {!area ? <p className="text-subtle">{NO_AREA}</p> : null}
          {area && live ? (
            <p>
              {area.name}. {live.label}
              {live.windKmh != null ? ` · wind ${Math.round(live.windKmh)}` : ""}. Open-Meteo.
            </p>
          ) : null}
          {area && unread ? <p className="text-subtle">Unread. The look-up did not land.</p> : null}
          {live?.daily?.length ? (
            <ul className="mt-2 space-y-1 text-subtle">
              {live.daily.map((d) => (
                <li key={d.day}>
                  {d.day} · {d.sky}
                  {d.maxC != null ? ` · ${Math.round(d.maxC)}°` : ""}
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-3 space-y-1">
            {areas.areas.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                <button type="button" data-on={row.id === areas.currentId ? "1" : "0"} onClick={() => keep(writeCard({ currentAreaId: pickArea(areas, row.id).currentId }))}>
                  {row.name}
                </button>
                <input
                  aria-label={`Name ${row.name}`}
                  defaultValue={row.name}
                  onBlur={(e) => {
                    const house = renameArea(areas, row.id, e.target.value);
                    keep(writeCard({ weatherAreas: house.areas, currentAreaId: house.currentId }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const house = removeArea(areas, row.id);
                    keep(writeCard({ weatherAreas: house.areas, currentAreaId: house.currentId }));
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{AREA_TRUTH}</p>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void search();
            }}
          >
            <label className="flex min-w-0 flex-1 flex-col gap-1">
              {AREA_LABEL}
              <input
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={AREA_PLACEHOLDER}
                aria-label={AREA_LABEL}
              />
            </label>
            <button type="submit">{looking ? "…" : "Look up"}</button>
          </form>
          {hits.length ? (
            <ul className="mt-2 space-y-1">
              {hits.map((hit) => (
                <li key={hit.id}>
                  <button type="button" onClick={() => add(hit)}>
                    Add {hit.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : lookLine ? (
            <p className="mt-2 text-subtle">{lookLine}</p>
          ) : null}
          <button type="button" className="mt-2" onClick={() => void useHere()}>
            Use this computer's location
          </button>
          {hereLine ? <p className="mt-1 text-subtle">{hereLine}</p> : null}
          {chrome.colorUi}
        </div>
      ) : null}
    </article>
  );
}

export function DeskNewsPlate() {
  const [card, setCard] = useState(() => loadCard());
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [unread, setUnread] = useState(false);
  const [query, setQuery] = useState("");
  const prefs = useMemo(() => parseNewsPrefs(card), [card]);
  const topic = currentTopic(prefs);
  const chrome = usePlateChrome("news");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (topic.id !== WORLD_ID && topic.query) {
          const xml = await (await fetch(topicRssUrl(topic.query))).text();
          if (cancelled) return;
          const next = parseRss(xml);
          if (next.length) setItems(next);
          setUnread(!next.length);
          return;
        }
        const json = await (await fetch(newsUrl())).json();
        if (cancelled) return;
        const next = parseNews(json);
        if (next.length) setItems(next);
        setUnread(!next.length);
      } catch {
        if (!cancelled) setUnread((was) => was || !items.length);
      }
    }
    void load();
    const id = window.setInterval(() => void load(), 20 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [topic.id, topic.query]);

  return (
    <article
      data-hit
      data-desk-plate="news"
      className={cn(
        "desk-plate pointer-events-auto absolute z-[4] w-[min(18rem,40%)] rounded-sm border border-border/50 shadow-lg",
        open && "w-[min(22rem,48%)]",
      )}
      style={{
        ...chrome.style,
        background: "color-mix(in srgb, var(--plate-bg, #161412) 82%, transparent)",
        color: "var(--plate-fg, #f2ece3)",
      }}
    >
      <button type="button" className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left" onPointerDown={chrome.onTogglePointerDown} onPointerMove={chrome.onTogglePointerMove} onPointerUp={chrome.onTogglePointerUp} onClick={() => chrome.toggleOpen(setOpen)}>
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">News</span>
        <span className="truncate text-sm text-ink">{newsLine(items, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">{sourceLine(topic)}</p>
          {unread && !items.length ? <p className="text-subtle">{CANT_REACH}</p> : null}
          {!unread && !items.length ? <p className="text-subtle">{NO_HEADLINES}</p> : null}
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.url || item.title}>
                <a href={item.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                  {item.title}
                </a>
                {item.summary ? <p className="text-subtle">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
          <ul className="mt-3 space-y-1">
            {prefs.topics.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                <button type="button" data-on={row.id === prefs.currentId ? "1" : "0"} onClick={() => setCard(writeCard({ newsPrefs: pickTopic(prefs, row.id).topics, currentNewsId: pickTopic(prefs, row.id).currentId }))}>
                  {row.name}
                </button>
                {row.id !== WORLD_ID ? (
                  <button
                    type="button"
                    onClick={() => {
                      const house = removeTopic(prefs, row.id);
                      setCard(writeCard({ newsPrefs: house.topics, currentNewsId: house.currentId }));
                    }}
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{TOPIC_TRUTH}</p>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!query.trim()) return;
              const house = addTopic(prefs, { name: query, query });
              setCard(writeCard({ newsPrefs: house.topics, currentNewsId: house.currentId }));
              setQuery("");
            }}
          >
            <label className="flex min-w-0 flex-1 flex-col gap-1">
              {TOPIC_LABEL}
              <input type="text" autoComplete="off" spellCheck={false} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={TOPIC_PLACEHOLDER} aria-label={TOPIC_LABEL} />
            </label>
            <button type="submit">Look up</button>
          </form>
          {chrome.colorUi}
        </div>
      ) : null}
    </article>
  );
}

export function DeskMarketPlate() {
  const [card, setCard] = useState(() => loadCard());
  const [open, setOpen] = useState(false);
  const [live, setLive] = useState<MarketLive | null>(null);
  const [unread, setUnread] = useState(false);
  const [query, setQuery] = useState("");
  const [truth, setTruth] = useState("");
  const house = useMemo(() => parseMarket(card), [card]);
  const ticker = currentTicker(house);
  const chrome = usePlateChrome("market");

  useEffect(() => {
    if (!ticker) {
      setLive(null);
      setUnread(false);
      return;
    }
    let cancelled = false;
    const url = ticker.kind === "crypto" ? geckoUrl(ticker.geckoId) : yahooUrl(ticker.symbol);
    if (!url) return;
    void fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const next = ticker.kind === "crypto" ? parseGecko(json, ticker.geckoId) : parseYahoo(json);
        if (next) setLive(next);
        setUnread(!next);
      })
      .catch(() => {
        if (!cancelled) setUnread(true);
      });
    const id = window.setInterval(() => {
      void fetch(url)
        .then((r) => r.json())
        .then((json) => {
          const next = ticker.kind === "crypto" ? parseGecko(json, ticker.geckoId) : parseYahoo(json);
          if (next) setLive(next);
          setUnread(!next);
        })
        .catch(() => setUnread(true));
    }, 20 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [ticker?.id, ticker?.kind, ticker?.symbol, ticker?.geckoId]);

  return (
    <article
      data-hit
      data-desk-plate="market"
      className={cn(
        "desk-plate pointer-events-auto absolute z-[4] w-[min(18rem,42%)] rounded-sm border border-border/50 shadow-lg",
        open && "w-[min(22rem,52%)]",
      )}
      style={{
        ...chrome.style,
        background: "color-mix(in srgb, var(--plate-bg, #161412) 82%, transparent)",
        color: "var(--plate-fg, #f2ece3)",
      }}
    >
      <button type="button" className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left" onPointerDown={chrome.onTogglePointerDown} onPointerMove={chrome.onTogglePointerMove} onPointerUp={chrome.onTogglePointerUp} onClick={() => chrome.toggleOpen(setOpen)}>
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">{MARKET_LABEL}</span>
        <span className="truncate text-sm text-ink">{marketLine(house, live, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          {!ticker ? <p className="text-subtle">{NO_QUOTE}</p> : null}
          {ticker && live ? (
            <p>
              {ticker.symbol}. {live.name}. {live.price} {live.currency}. {live.source === "coingecko" ? "CoinGecko" : "Yahoo"}.
            </p>
          ) : null}
          {ticker && unread && !live ? <p className="text-subtle">{CANT_REACH}</p> : null}
          <ul className="mt-3 space-y-1">
            {house.tickers.map((row) => (
              <li key={row.id} className="flex items-center gap-2">
                <button type="button" data-on={row.id === house.currentId ? "1" : "0"} onClick={() => setCard(writeCard({ marketTickers: pickTicker(house, row.id).tickers, currentTickerId: pickTicker(house, row.id).currentId }))}>
                  {row.symbol}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = removeTicker(house, row.id);
                    setCard(writeCard({ marketTickers: next.tickers, currentTickerId: next.currentId }));
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{MARKET_TRUTH}</p>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const next = parseTicker(query);
              if (!next) {
                setTruth("type a ticker");
                return;
              }
              const kept = addTicker(house, next);
              setCard(writeCard({ marketTickers: kept.tickers, currentTickerId: kept.currentId }));
              setQuery("");
              setTruth("");
            }}
          >
            <label className="flex min-w-0 flex-1 flex-col gap-1">
              {MARKET_LABEL}
              <input type="text" autoComplete="off" spellCheck={false} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={MARKET_PLACEHOLDER} aria-label={MARKET_LABEL} />
            </label>
            <button type="submit">Look up</button>
          </form>
          {truth ? <p className="mt-1 text-subtle">{truth}</p> : null}
          {chrome.colorUi}
        </div>
      ) : null}
    </article>
  );
}

export { WEATHER_ID, NEWS_ID };
