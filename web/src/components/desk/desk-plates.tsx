import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { holdWeatherLocate, ipPlace, noteWeatherLocateYes, readWeatherHere } from "@/lib/pets/presence";
import {
  ackSavedHere,
  addArea,
  currentArea,
  favoriteAreas,
  forecastGate,
  forecastHonesty,
  forecastMayLeave,
  forecastMaySend,
  forecastUrl,
  GEOCODE_NET,
  geocodeHonesty,
  geocodeMaySend,
  geocodeUrl,
  readForecast,
  readGeocode,
  readReverse,
  AREA_LABEL,
  AREA_PLACEHOLDER,
  AREA_TRUTH,
  CANT_REACH as WEATHER_CANT_REACH,
  FAVORITES_EMPTY as WEATHER_FAVORITES_EMPTY,
  HERE_ASK,
  HERE_FAIL,
  HERE_HELD,
  HERE_KEPT,
  HERE_NO,
  HERE_SEND,
  HERE_SENT,
  HERE_YES,
  dayLabel,
  isFavorite,
  locateGate,
  NO_AREA,
  parseAreas,
  parseForecast,
  SAVED_HERE_ASK,
  SAVED_HERE_HELD,
  SAVED_HERE_NO,
  SAVED_HERE_SENT,
  SAVED_HERE_YES,
  parseGeocode,
  parseReverse,
  pickArea,
  pickTab,
  plateLine,
  removeArea,
  renameArea,
  reverseUrl,
  sharePlace,
  stickHereForecastAck,
  toCardPatch,
  toggleFavorite,
  TYPE_A_CITY,
  WEATHER_TABS,
  type LiveSky,
  type WeatherArea,
} from "@/lib/pets/weather-areas";
import {
  addTopic,
  CANT_REACH,
  currentTopic,
  FAVORITES_EMPTY,
  isFavorite,
  moveTopic,
  NEWS_TABS,
  newsHonesty,
  newsLine,
  newsMaySend,
  NO_HEADLINES,
  parseNews,
  parseNewsPrefs,
  parseRss,
  readFeatured,
  readRss,
  pickTab,
  pickTopic,
  popularRssUrl,
  removeFavorite,
  removeTopic,
  sourceLine,
  SUGGESTION_TOPICS,
  TOPIC_LABEL,
  TOPIC_PLACEHOLDER,
  TOPIC_TRUTH,
  toCardPatch as newsToCardPatch,
  toggleFavorite,
  topicRssUrl,
  WORLD_ID,
  xSearchUrl,
  xTopicRssUrl,
  type NewsItem,
  type NewsTab,
} from "@/lib/pets/news";
import {
  addMarketplace,
  addNft,
  addTicker,
  currentNft,
  currentTicker,
  DEFAULT_MARKETPLACES,
  detectContract,
  favoriteRows,
  FAVORITES_EMPTY as MARKET_FAVORITES_EMPTY,
  formatPrice,
  isFavoriteNft,
  isFavoriteTicker,
  MARKET_LABEL,
  MARKET_PLACEHOLDER,
  MARKET_TRUTH,
  moveMarketplace,
  moveNft,
  moveTicker,
  NFT_LABEL,
  NFT_MARKETPLACES,
  NFT_PLACEHOLDER,
  NFT_TRUTH,
  NO_NFT,
  NO_QUOTE,
  parseGeckoMany,
  parseMarket,
  parseNftLive,
  parseSearchCoins,
  pickBestSearchCoin,
  parseSearchNfts,
  parseTerminalToken,
  parseTicker,
  parseYahoo,
  QUOTE_LOOK,
  quoteHonesty,
  quoteLookMaySend,
  quoteMaySend,
  pickNft,
  pickTicker,
  plateLine as marketLine,
  nftLine,
  readGeckoMany,
  readNft,
  readQuoteSearch,
  readTerminal,
  readYahoo,
  removeMarketplace,
  removeNft,
  removeTicker,
  searchUrl,
  toCardPatch,
  toggleFavoriteNft,
  toggleFavoriteTicker,
  type MarketLive,
  type NftLive,
  CANT_REACH as MARKET_CANT_REACH,
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
import { PLATE_LINES, RETRY_LABEL, plateProblem } from "@/lib/plain-error";


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
  /** Why the forecast did not load (plain; raw error in the console). Try again bumps attempt. */
  const [problem, setProblem] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<WeatherArea[]>([]);
  const [looking, setLooking] = useState(false);
  const [hereLine, setHereLine] = useState("");
  const [hereAsk, setHereAsk] = useState(false);
  const [savedLine, setSavedLine] = useState("");
  const [lookLine, setLookLine] = useState("");
  const liveKey = useRef("");
  const areas = useMemo(() => parseAreas(card), [card]);
  const area = currentArea(areas);
  const tab = areas.tab;
  const chrome = usePlateChrome("weather");
  const shownGate = forecastGate(areas, card.hereForecastAck);
  const lineInView = open && tab === "current";
  const honesty = forecastHonesty(shownGate);
  const forecastWaiting = !live && shownGate.act === "send" && !lineInView;

  function keepAreas(house: ReturnType<typeof parseAreas>) {
    const ack = stickHereForecastAck(house, card.hereForecastAck);
    if (house.currentId !== areas.currentId) setSavedLine("");
    setCard(writeCard({ ...toCardPatch(house), hereForecastAck: ack }));
  }

  useEffect(() => {
    setCard(loadCard());
  }, []);

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
    const gate = forecastGate(areas, card.hereForecastAck);
    const key = gate.area ? `${gate.area.id}:${gate.area.lat}:${gate.area.lon}` : "";
    if (!forecastMaySend(gate, open && tab === "current") || gate.act !== "send" || !gate.area) {
      if (gate.act !== "send" || liveKey.current !== key) {
        liveKey.current = "";
        setLive(null);
        setUnread(false);
        onSky?.(null);
      }
      return;
    }
    const line = forecastHonesty(gate);
    const url = forecastUrl(gate.area.lat, gate.area.lon);
    if (!url || !forecastMayLeave(line)) return;
    let cancelled = false;
    liveKey.current = "";
    setLive(null);
    setUnread(false);
    setProblem(null);
    void readForecast(line, url)
      .then((json) => {
        if (cancelled) return;
        if (json == null) {
          liveKey.current = "";
          setUnread(true);
          setProblem(plateProblem("forecast", null));
          setLive(null);
          onSky?.(null);
          return;
        }
        const next = parseForecast(json);
        liveKey.current = next ? key : "";
        setUnread(!next);
        setProblem(next ? null : plateProblem("forecast", null));
        setLive(next);
        onSky?.(next);
      })
      .catch((err) => {
        if (cancelled) return;
        liveKey.current = "";
        setUnread(true);
        setProblem(plateProblem("forecast", err));
        setLive(null);
        onSky?.(null);
      });
    return () => {
      cancelled = true;
    };
  }, [areas, card.hereForecastAck, onSky, open, tab, attempt]);

  function geocodeShown(id: string) {
    if (typeof document === "undefined") return "";
    const el = document.getElementById(id);
    return el ? el.textContent || "" : "";
  }

  function geocodeLineShown(id: string) {
    return geocodeShown(id).includes(GEOCODE_NET);
  }

  async function search() {
    const shown = geocodeShown("weather-geocode-net");
    if (!geocodeMaySend("look", geocodeLineShown("weather-geocode-net"))) {
      setHits([]);
      return;
    }
    const url = geocodeUrl(query);
    if (!url) {
      setLookLine(TYPE_A_CITY);
      setHits([]);
      return;
    }
    setLooking(true);
    setLookLine("");
    try {
      const json = await readGeocode(shown, url);
      if (json == null) {
        setHits([]);
        setLookLine(WEATHER_CANT_REACH);
        return;
      }
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

  function useHere() {
    setHereLine("");
    const gate = locateGate(areas, false);
    if (gate.act === "keep") {
      setHereAsk(false);
      setHereLine(HERE_KEPT);
      if (!area || area.id !== gate.area.id) keepAreas(pickArea(areas, gate.area.id));
      return;
    }
    setHereAsk(true);
  }

  async function confirmHere() {
    const gate = locateGate(areas, true);
    if (gate.act !== "locate") {
      holdWeatherLocate();
      setHereAsk(false);
      if (gate.act === "keep") {
        setHereLine(HERE_KEPT);
        if (!area || area.id !== gate.area.id) keepAreas(pickArea(areas, gate.area.id));
      }
      return;
    }
    setHereAsk(false);
    function keep(next: WeatherArea) {
      const house = addArea(areas, next);
      const ack = ackSavedHere(house);
      setCard(writeCard({ ...toCardPatch(house), hereForecastAck: ack }));
      setHits([]);
      setQuery("");
      setHereLine(HERE_SENT);
    }
    function unnamed(lat: number, lon: number): WeatherArea {
      return { id: "here", name: "This computer", query: "this computer", lat, lon };
    }
    if (ipPlace() != null) {
      holdWeatherLocate();
      setHereLine(HERE_FAIL);
      return;
    }
    noteWeatherLocateYes();
    const fix = await readWeatherHere(typeof navigator === "undefined" ? undefined : navigator.geolocation);
    if (!fix) {
      setHereLine(HERE_FAIL);
      return;
    }
    const place = sharePlace(fix.lat, fix.lon);
    if (!place) {
      setHereLine(HERE_FAIL);
      return;
    }
    const shown = geocodeShown("weather-reverse-net");
    if (!geocodeMaySend("reverse", geocodeLineShown("weather-reverse-net"))) {
      keep(unnamed(place.lat, place.lon));
      return;
    }
    const url = reverseUrl(place.lat, place.lon);
    if (!url) {
      keep(unnamed(place.lat, place.lon));
      return;
    }
    try {
      const json = await readReverse(shown, url);
      if (json == null) {
        keep(unnamed(place.lat, place.lon));
        return;
      }
      const named = parseReverse(json);
      keep(
        named
          ? { id: "here", name: named.name, query: "this computer", lat: place.lat, lon: place.lon }
          : unnamed(place.lat, place.lon),
      );
    } catch {
      keep(unnamed(place.lat, place.lon));
    }
  }

  function declineHere() {
    holdWeatherLocate();
    setHereAsk(false);
    setHereLine(HERE_HELD);
  }

  function confirmSavedHere() {
    const gate = forecastGate(areas, card.hereForecastAck);
    if (gate.act !== "hold") return;
    const ack = ackSavedHere(areas);
    if (!ack) return;
    setCard(writeCard({ hereForecastAck: ack }));
    setSavedLine(SAVED_HERE_SENT);
  }

  function declineSavedHere() {
    setSavedLine(SAVED_HERE_HELD);
  }

  function add(hit: WeatherArea) {
    keepAreas(addArea(areas, hit));
    setHits([]);
    setQuery("");
  }

  const favs = favoriteAreas(areas);

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
        <span className="truncate text-sm text-ink">{plateLine(areas, live, unread, shownGate.act === "hold", forecastWaiting)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="Weather sections">
            {WEATHER_TABS.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                data-on={tab === id ? "1" : "0"}
                className="rounded-full border border-border/50 px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
                onClick={() => keepAreas(pickTab(areas, id))}
              >
                {id === "current" ? "Current" : "Favorites"}
              </button>
            ))}
          </div>
          {tab === "favorites" ? (
            !favs.length ? (
              <p className="text-subtle">{WEATHER_FAVORITES_EMPTY}</p>
            ) : (
              <ul className="space-y-1">
                {favs.map((row) => (
                  <li key={row.id} className="flex items-center gap-2">
                    <button type="button" data-on={row.id === areas.currentId ? "1" : "0"} onClick={() => keepAreas(pickArea(areas, row.id))}>
                      {row.name}
                    </button>
                    <button type="button" className="weather-star" title="Favorite place" onClick={() => keepAreas(toggleFavorite(areas, row.id))}>
                      ★
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <>
              {shownGate.act === "hold" ? (
                <div id="weather-saved-ask" className="mb-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">{SAVED_HERE_ASK}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button type="button" onClick={confirmSavedHere}>
                      {SAVED_HERE_YES}
                    </button>
                    <button type="button" onClick={declineSavedHere}>
                      {SAVED_HERE_NO}
                    </button>
                  </div>
                  {savedLine ? <p className="mt-1 text-subtle">{savedLine}</p> : null}
                </div>
              ) : honesty ? (
                <p id="weather-forecast-net" className="mb-2 text-[10px] uppercase tracking-[0.16em] text-subtle">
                  {honesty}
                </p>
              ) : null}
              {savedLine && shownGate.act !== "hold" ? <p className="mb-2 text-subtle">{savedLine}</p> : null}
              {!area ? <p className="text-subtle">{NO_AREA}</p> : null}
              {area && live ? (
                <p>
                  {area.name}. {live.label}
                  {live.windKmh != null ? ` · wind ${Math.round(live.windKmh)}` : ""}. Open-Meteo.
                </p>
              ) : null}
              {area && unread ? (
                <p className="text-subtle" role="status" data-plate-problem="forecast">
                  {problem ?? PLATE_LINES.forecast}{" "}
                  <button type="button" className="underline underline-offset-2" onClick={() => setAttempt((n) => n + 1)}>
                    {RETRY_LABEL}
                  </button>
                </p>
              ) : null}
              {live?.daily?.length ? (
                <ul className="mt-2 space-y-1 text-subtle">
                  {live.daily.map((d) => (
                    <li key={d.day}>
                      {d.day} · {dayLabel(d)}
                      {d.maxC != null ? ` · ${Math.round(d.maxC)}°` : ""}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ul className="mt-3 space-y-1">
                {areas.areas.map((row) => (
                  <li key={row.id} className="flex items-center gap-2">
                    <button type="button" data-on={row.id === areas.currentId ? "1" : "0"} onClick={() => keepAreas(pickArea(areas, row.id))}>
                      {row.name}
                    </button>
                    <button type="button" className="weather-star" title="Favorite place" onClick={() => keepAreas(toggleFavorite(areas, row.id))}>
                      {isFavorite(areas, row.id) ? "★" : "☆"}
                    </button>
                    <input
                      aria-label={`Name ${row.name}`}
                      defaultValue={row.name}
                      onBlur={(e) => {
                        keepAreas(renameArea(areas, row.id, e.target.value));
                      }}
                    />
                    <button type="button" onClick={() => keepAreas(removeArea(areas, row.id))}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{AREA_TRUTH}</p>
              <p id="weather-geocode-net" className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">
                {geocodeHonesty("look")}
              </p>
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
              <button type="button" className="mt-2" aria-describedby="weather-here-send" onClick={() => useHere()}>
                Use this computer&apos;s location
              </button>
              <p id="weather-here-send" className="mt-1 text-[10px] uppercase tracking-[0.16em] text-subtle">
                {HERE_SEND}
              </p>
              <p id="weather-reverse-net" className="mt-1 text-[10px] uppercase tracking-[0.16em] text-subtle">
                {geocodeHonesty("reverse")}
              </p>
              {hereAsk ? (
                <div id="weather-here-ask" className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="basis-full text-[10px] uppercase tracking-[0.16em] text-subtle">{HERE_ASK}</p>
                  <button type="button" onClick={() => void confirmHere()}>
                    {HERE_YES}
                  </button>
                  <button type="button" onClick={declineHere}>
                    {HERE_NO}
                  </button>
                </div>
              ) : null}
              {hereLine ? <p className="mt-1 text-subtle">{hereLine}</p> : null}
            </>
          )}
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
  /** Why headlines did not load; with older items kept, it says they are from earlier. Try again bumps attempt. */
  const [problem, setProblem] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const itemsRef = useRef<NewsItem[]>(items);
  itemsRef.current = items;
  const [query, setQuery] = useState("");
  const prefs = useMemo(() => parseNewsPrefs(card), [card]);
  const topic = currentTopic(prefs);
  const tab = prefs.tab as NewsTab;
  const chrome = usePlateChrome("news");

  function keepNews(house: ReturnType<typeof parseNewsPrefs>) {
    setCard(writeCard(newsToCardPatch(house)));
  }

  useEffect(() => {
    if (!open) return;
    const line = newsHonesty(prefs);
    if (!line) {
      if (tab === "favorites") {
        setUnread(false);
        setProblem(null);
      }
      return;
    }
    setProblem(null);
    let cancelled = false;
    /** A feed that answered: keep what it gave; an empty or unreadable answer is said plainly. */
    function landed(next: NewsItem[]) {
      if (next.length) setItems(next);
      setUnread(!next.length);
      setProblem(next.length ? null : plateProblem(itemsRef.current.length ? "newer" : "headlines", null));
    }
    async function load() {
      const el = document.getElementById("news-net");
      const shown = !!el && (el.textContent || "").includes(line);
      if (!newsMaySend(prefs, shown)) return;
      try {
        if (tab === "favorites") {
          if (!cancelled) {
            setUnread(false);
            setProblem(null);
          }
          return;
        }
        if (tab === "popular") {
          const xml = await readRss(line, popularRssUrl());
          if (xml == null || cancelled) return;
          landed(parseRss(xml));
          return;
        }
        if (tab === "x") {
          const xml = await readRss(line, xTopicRssUrl(topic.query || "news"));
          if (xml == null || cancelled) return;
          landed(parseRss(xml));
          return;
        }
        if (topic.id !== WORLD_ID && topic.query) {
          const xml = await readRss(line, topicRssUrl(topic.query));
          if (xml == null || cancelled) return;
          landed(parseRss(xml));
          return;
        }
        const json = await readFeatured(line);
        if (json == null || cancelled) return;
        landed(parseNews(json));
      } catch (err) {
        if (cancelled) return;
        const kept = itemsRef.current.length > 0;
        setUnread((was) => was || !kept);
        setProblem(plateProblem(kept ? "newer" : "headlines", err));
      }
    }
    void load();
    const id = window.setInterval(() => void load(), 20 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [open, prefs, tab, topic.id, topic.query, attempt]);

  return (
    <article
      data-hit
      data-desk-plate="news"
      className={cn(
        "desk-plate pointer-events-auto absolute z-[4] w-[min(18rem,40%)] rounded-sm border border-border/50 shadow-lg",
        open && "w-[min(24rem,52%)]",
      )}
      style={{
        ...chrome.style,
        background: "color-mix(in srgb, var(--plate-bg, #161412) 82%, transparent)",
        color: "var(--plate-fg, #f2ece3)",
      }}
    >
      <button type="button" className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left" onPointerDown={chrome.onTogglePointerDown} onPointerMove={chrome.onTogglePointerMove} onPointerUp={chrome.onTogglePointerUp} onClick={() => chrome.toggleOpen(setOpen)}>
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">News</span>
        <span className="truncate text-sm text-ink">{newsLine(tab === "favorites" ? prefs.favorites.map((f) => ({ title: f.title, url: f.url, summary: f.summary })) : items, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="News sections">
            {NEWS_TABS.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                data-on={tab === id ? "1" : "0"}
                className="rounded-full border border-border/50 px-2 py-1 text-[10px] uppercase tracking-[0.12em]"
                onClick={() => keepNews(pickTab(prefs, id))}
              >
                {id === "x" ? "X" : id[0]!.toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          {newsHonesty(prefs) ? (
            <p id="news-net" className="text-[10px] uppercase tracking-[0.16em] text-subtle">
              {newsHonesty(prefs)}
            </p>
          ) : null}
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">{sourceLine(topic, tab)}</p>
          {tab === "favorites" ? (
            prefs.favorites.length ? (
              <ul className="mt-2 space-y-2">
                {prefs.favorites.map((fav) => (
                  <li key={fav.id} className="flex items-start gap-2">
                    {fav.kind === "topic" ? (
                      <button type="button" onClick={() => keepNews(pickTopic(prefs, fav.topicId))}>
                        {fav.title}
                      </button>
                    ) : fav.url ? (
                      <a href={fav.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                        {fav.title}
                      </a>
                    ) : (
                      <span>{fav.title}</span>
                    )}
                    <button type="button" aria-label="Remove favorite" onClick={() => keepNews(removeFavorite(prefs, fav.id))}>
                      ★
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-subtle">{FAVORITES_EMPTY}</p>
            )
          ) : (
            <>
              {problem ? (
                <p className="text-subtle" role="status" data-plate-problem="news">
                  {problem}{" "}
                  <button type="button" className="underline underline-offset-2" onClick={() => setAttempt((n) => n + 1)}>
                    {RETRY_LABEL}
                  </button>
                </p>
              ) : unread && !items.length ? (
                <p className="text-subtle">{CANT_REACH}</p>
              ) : null}
              {!unread && !problem && !items.length ? <p className="text-subtle">{NO_HEADLINES}</p> : null}
              {tab === "x" && !items.length ? (
                <p className="mt-1">
                  <a href={xSearchUrl(topic.query || "news")} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                    Open on X
                  </a>
                </p>
              ) : null}
              <ul className="mt-2 space-y-2">
                {items.map((item) => (
                  <li key={item.url || item.title} className="flex items-start gap-2">
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                        {item.title}
                      </a>
                    ) : (
                      <span>{item.title}</span>
                    )}
                    {item.summary ? <p className="text-subtle">{item.summary}</p> : null}
                    <button
                      type="button"
                      aria-label="Favorite headline"
                      onClick={() => keepNews(toggleFavorite(prefs, { kind: "headline", title: item.title, url: item.url, summary: item.summary }))}
                    >
                      {isFavorite(prefs, { kind: "headline", title: item.title, url: item.url }) ? "★" : "☆"}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tab === "topics" ? (
            <>
              <ul className="mt-3 space-y-1">
                {prefs.topics.map((row, idx) => (
                  <li key={row.id} className="flex flex-wrap items-center gap-2">
                    <button type="button" data-on={row.id === prefs.currentId ? "1" : "0"} onClick={() => keepNews(pickTopic(prefs, row.id))}>
                      {row.name}
                    </button>
                    {row.id !== WORLD_ID ? (
                      <>
                        <button type="button" onClick={() => keepNews(toggleFavorite(prefs, { kind: "topic", id: row.id, name: row.name, query: row.query }))}>
                          {isFavorite(prefs, { kind: "topic", id: row.id, name: row.name, query: row.query }) ? "★" : "☆"}
                        </button>
                        <button type="button" disabled={idx <= 1} onClick={() => keepNews(moveTopic(prefs, row.id, -1))}>
                          Up
                        </button>
                        <button type="button" disabled={idx === prefs.topics.length - 1} onClick={() => keepNews(moveTopic(prefs, row.id, 1))}>
                          Down
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            keepNews(removeTopic(prefs, row.id));
                          }}
                        >
                          Remove
                        </button>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap gap-1">
                {SUGGESTION_TOPICS.map((name) => (
                  <button key={name} type="button" className="rounded-full border border-border/40 px-2 py-0.5 text-[11px]" onClick={() => keepNews(addTopic(prefs, { name, query: name }))}>
                    {name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{TOPIC_TRUTH}</p>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!query.trim()) return;
                  keepNews(addTopic(prefs, { name: query, query }));
                  setQuery("");
                }}
              >
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  {TOPIC_LABEL}
                  <input type="text" autoComplete="off" spellCheck={false} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={TOPIC_PLACEHOLDER} aria-label={TOPIC_LABEL} />
                </label>
                <button type="submit">Add</button>
              </form>
            </>
          ) : (
            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{TOPIC_TRUTH}</p>
          )}
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
  const [coinLives, setCoinLives] = useState<Record<string, MarketLive>>({});
  const [unread, setUnread] = useState(false);
  /** Why the current coin or stock price did not load. Try again bumps attempt. */
  const [problem, setProblem] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [nftLive, setNftLive] = useState<NftLive | null>(null);
  const [nftUnread, setNftUnread] = useState(false);
  const [query, setQuery] = useState("");
  const [nftQuery, setNftQuery] = useState("");
  const [truth, setTruth] = useState("");
  const [nftTruth, setNftTruth] = useState("");
  const [coinHits, setCoinHits] = useState<ReturnType<typeof parseSearchCoins>>([]);
  const [nftHits, setNftHits] = useState<ReturnType<typeof parseSearchNfts>>([]);
  const house = useMemo(() => parseMarket(card), [card]);
  const ticker = currentTicker(house);
  const nft = currentNft(house);
  const chrome = usePlateChrome("market");

  function keep(patch: Partial<CardPrefs>) {
    setCard(writeCard(patch));
  }

  function keepHouse(next: ReturnType<typeof parseMarket>) {
    keep(toCardPatch(next));
  }

  useEffect(() => {
    // Seed defaults into card when empty so customize persists.
    if ((!card.marketTickers || !card.marketTickers.length) && house.tickers.length) {
      keep(toCardPatch(house));
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const line = quoteHonesty(house);
    const el = document.getElementById("market-net");
    const shown = !!line && !!el && (el.textContent || "").includes(line);
    if (!quoteMaySend(house, shown)) {
      if (!house.tickers.length) {
        setLive(null);
        setUnread(false);
      }
      if (!nft) {
        setNftLive(null);
        setNftUnread(false);
      }
      return;
    }
    let cancelled = false;
    const geckoIds = house.tickers.filter((r) => r.kind === "crypto" && r.geckoId && !r.address).map((r) => r.geckoId);
    const contracts = house.tickers.filter((r) => r.kind === "crypto" && r.address);
    const jobs: Promise<void>[] = [];

    if (geckoIds.length) {
      jobs.push(
        readGeckoMany(line, geckoIds)
          .then((json) => {
            if (json == null || cancelled) return;
            const lives = parseGeckoMany(json);
            setCoinLives((prev) => ({ ...prev, ...lives }));
            if (ticker?.geckoId && lives[ticker.geckoId]) {
              setLive(lives[ticker.geckoId]!);
              setUnread(false);
              setProblem(null);
            } else if (ticker?.geckoId && geckoIds.includes(ticker.geckoId)) {
              // Answered, but not with this coin (a rate-limit or error body): say so instead of "…" forever.
              setUnread(true);
              setProblem(plateProblem("price", null));
            }
          })
          .catch((err) => {
            if (cancelled) return;
            setUnread(true);
            setProblem(plateProblem("price", err));
          }),
      );
    }

    for (const row of contracts) {
      jobs.push(
        readTerminal(line, row.platform || "solana", row.address)
          .then((json) => {
            if (json == null || cancelled) return;
            const next = parseTerminalToken(json);
            if (!next) {
              if (ticker?.id === row.id) {
                setUnread(true);
                setProblem(plateProblem("price", null));
              }
              return;
            }
            setCoinLives((prev) => ({ ...prev, [row.platform + ":" + row.address]: next, [row.address]: next }));
            if (ticker?.id === row.id) {
              setLive(next);
              setUnread(false);
              setProblem(null);
            }
          })
          .catch((err) => {
            if (cancelled || ticker?.id !== row.id) return;
            setUnread(true);
            setProblem(plateProblem("price", err));
          }),
      );
    }

    if (ticker?.kind === "stock") {
      jobs.push(
        readYahoo(line, ticker.symbol)
          .then((json) => {
            if (json == null || cancelled) return;
            const next = parseYahoo(json);
            if (next) setLive(next);
            setUnread(!next);
            setProblem(next ? null : plateProblem("price", null));
          })
          .catch((err) => {
            if (cancelled) return;
            setUnread(true);
            setProblem(plateProblem("price", err));
          }),
      );
    }

    if (nft) {
      jobs.push(
        readNft(line, nft.geckoId)
          .then((json) => {
            if (json == null || cancelled) return;
            const next = parseNftLive(json);
            if (next) setNftLive(next);
            setNftUnread(!next);
          })
          .catch(() => {
            if (!cancelled) setNftUnread(true);
          }),
      );
    }

    if (!house.tickers.length) {
      setLive(null);
      setUnread(false);
      setProblem(null);
    }
    if (!nft) {
      setNftLive(null);
      setNftUnread(false);
    }

    return () => {
      cancelled = true;
    };
  }, [open, house, house.tickers, house.nfts, ticker?.id, nft?.id, attempt]);

  async function lookupCoins() {
    const typed = query;
    const contract = detectContract(typed);
    // Coins pane forces crypto resolve even if classify once guessed stock.
    const next = contract
      ? parseTicker(typed)
      : parseTicker({ symbol: typed, kind: "crypto", query: typed });
    if (contract && next) {
      keepHouse(addTicker(house, next));
      setQuery("");
      setTruth("");
      setCoinHits([]);
      return;
    }
    // Known majors already carry geckoId — add immediately.
    if (next && next.geckoId) {
      keepHouse(addTicker(house, next));
      setQuery("");
      setTruth("");
      setCoinHits([]);
      return;
    }
    // Free-typed new tickers: CoinGecko search → best match → crypto watch list.
    const look = document.getElementById("market-look-net");
    const lookShown = !!look && (look.textContent || "").includes(QUOTE_LOOK);
    if (!quoteLookMaySend(lookShown)) return;
    if (!searchUrl(typed)) {
      setTruth("type a coin, ticker, or contract");
      return;
    }
    setTruth("looking up…");
    try {
      const json = await readQuoteSearch(QUOTE_LOOK, typed);
      if (json == null) {
        // Nothing was sent; do not leave "looking up…" standing.
        setTruth("");
        return;
      }
      const coins = parseSearchCoins(json);
      const best = pickBestSearchCoin(coins, typed);
      if (!best) {
        setCoinHits([]);
        setTruth("no coin from that look-up — try a mint or contract");
        return;
      }
      keepHouse(addTicker(house, { ...best, kind: "crypto" }));
      setQuery("");
      setTruth("");
      setCoinHits(coins);
    } catch {
      setCoinHits([]);
      setTruth(MARKET_CANT_REACH);
    }
  }

  async function lookupNfts() {
    const typed = nftQuery;
    const look = document.getElementById("market-look-net");
    const lookShown = !!look && (look.textContent || "").includes(QUOTE_LOOK);
    if (!quoteLookMaySend(lookShown)) return;
    if (!searchUrl(typed)) {
      setNftTruth("type a collection name");
      return;
    }
    setNftTruth("looking up…");
    try {
      const json = await readQuoteSearch(QUOTE_LOOK, typed);
      if (json == null) {
        setNftTruth("");
        return;
      }
      const found = parseSearchNfts(json);
      setNftHits(found);
      setNftTruth(found.length ? "" : "no collection from that look-up");
    } catch {
      setNftHits([]);
      setNftTruth(MARKET_CANT_REACH);
    }
  }

  const haveMp = new Set(house.marketplaces.map((m) => m.id));

  return (
    <article
      data-hit
      data-desk-plate="market"
      className={cn(
        "desk-plate pointer-events-auto absolute z-[4] w-[min(18rem,42%)] rounded-sm border border-border/50 shadow-lg",
        open && "w-[min(36rem,92%)]",
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
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">{MARKET_LABEL}</span>
        <span className="truncate text-sm text-ink">{marketLine(house, live, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          {quoteHonesty(house) ? (
            <p id="market-net" className="text-[10px] uppercase tracking-[0.16em] text-subtle">
              {quoteHonesty(house)}
            </p>
          ) : null}
          <p id="market-look-net" className="text-[10px] uppercase tracking-[0.16em] text-subtle">
            {QUOTE_LOOK}
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <section className="rounded-sm border border-border/40 p-2" aria-label="Coins" style={{ background: "color-mix(in srgb, var(--plate-bg, #161412) 70%, transparent)" }}>
              <h3 className="text-[10px] uppercase tracking-[0.16em] text-subtle">Coins</h3>
              {!house.tickers.length ? <p className="text-subtle">{NO_QUOTE}</p> : null}
              <ul className="mt-2 space-y-1">
                {house.tickers.map((row) => {
                  const keyed = row.geckoId ? coinLives[row.geckoId] : undefined;
                  const addr = row.address ? coinLives[`${row.platform}:${row.address}`] || coinLives[row.address] : undefined;
                  const rowLive = keyed || addr || (ticker?.id === row.id ? live : null);
                  const price = rowLive ? formatPrice(rowLive.price) : unread && ticker?.id === row.id ? MARKET_CANT_REACH : "…";
                  const kind = row.address ? (row.platform === "solana" ? "mint" : "contract") : row.kind;
                  return (
                    <li key={row.id} className="flex flex-wrap items-center gap-2">
                      <button type="button" data-on={row.id === house.currentId ? "1" : "0"} onClick={() => keepHouse(pickTicker(house, row.id))}>
                        {row.symbol} · {price}
                      </button>
                      <span className="text-[10px] text-subtle">{kind}</span>
                      <button type="button" aria-label="Favorite coin" onClick={() => keepHouse(toggleFavoriteTicker(house, row.id))}>
                        {isFavoriteTicker(house, row.id) ? "★" : "☆"}
                      </button>
                      <button type="button" onClick={() => keepHouse(moveTicker(house, row.id, -1))}>Up</button>
                      <button type="button" onClick={() => keepHouse(moveTicker(house, row.id, 1))}>Down</button>
                      <button type="button" onClick={() => keepHouse(removeTicker(house, row.id))}>Remove</button>
                    </li>
                  );
                })}
              </ul>
              {unread && problem ? (
                <p className="mt-1 text-subtle" role="status" data-plate-problem="market">
                  {problem}{" "}
                  <button type="button" className="underline underline-offset-2" onClick={() => setAttempt((n) => n + 1)}>
                    {RETRY_LABEL}
                  </button>
                </p>
              ) : null}
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{MARKET_TRUTH}</p>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void lookupCoins();
                }}
              >
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  Add a coin
                  <input type="text" autoComplete="off" spellCheck={false} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={MARKET_PLACEHOLDER} aria-label="Add a coin" />
                </label>
                <button type="submit">Look up</button>
              </form>
              {truth ? <p className="mt-1 text-subtle">{truth}</p> : null}
              {coinHits.length ? (
                <ul className="mt-2 space-y-1">
                  {coinHits.map((hit) => (
                    <li key={hit.id}>
                      <button
                        type="button"
                        onClick={() => {
                          keepHouse(addTicker(house, hit));
                          setCoinHits([]);
                          setQuery("");
                        }}
                      >
                        Add {hit.symbol} · {hit.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="rounded-sm border border-border/40 p-2" aria-label="NFTs" style={{ background: "color-mix(in srgb, var(--plate-bg, #161412) 70%, transparent)" }}>
              <h3 className="text-[10px] uppercase tracking-[0.16em] text-subtle">{NFT_LABEL}</h3>
              <p className="text-subtle">{nft ? nftLine(house, nftLive, nftUnread) : NO_NFT}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">Marketplaces</p>
              <ul className="mt-1 space-y-1">
                {house.marketplaces.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center gap-2">
                    <span>{row.name}</span>
                    <span className="text-[10px] text-subtle">{row.note}</span>
                    <button type="button" onClick={() => keepHouse(moveMarketplace(house, row.id, -1))}>Up</button>
                    <button type="button" onClick={() => keepHouse(moveMarketplace(house, row.id, 1))}>Down</button>
                    <button type="button" onClick={() => keepHouse(removeMarketplace(house, row.id))}>Remove</button>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                {NFT_MARKETPLACES.filter((m) => !haveMp.has(m.id)).map((m) => (
                  <button key={m.id} type="button" onClick={() => keepHouse(addMarketplace(house, m.id))}>
                    Add {m.name}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-subtle">Collections</p>
              <ul className="mt-1 space-y-1">
                {house.nfts.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center gap-2">
                    <button type="button" data-on={row.id === house.currentNftId ? "1" : "0"} onClick={() => keepHouse(pickNft(house, row.id))}>
                      {row.symbol || row.name}
                    </button>
                    <button type="button" aria-label="Favorite NFT" onClick={() => keepHouse(toggleFavoriteNft(house, row.id))}>
                      {isFavoriteNft(house, row.id) ? "★" : "☆"}
                    </button>
                    <button type="button" onClick={() => keepHouse(moveNft(house, row.id, -1))}>Up</button>
                    <button type="button" onClick={() => keepHouse(moveNft(house, row.id, 1))}>Down</button>
                    <button type="button" onClick={() => keepHouse(removeNft(house, row.id))}>Remove</button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">{NFT_TRUTH}</p>
              <form
                className="mt-2 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void lookupNfts();
                }}
              >
                <label className="flex min-w-0 flex-1 flex-col gap-1">
                  Add a collection
                  <input type="text" autoComplete="off" spellCheck={false} value={nftQuery} onChange={(e) => setNftQuery(e.target.value)} placeholder={NFT_PLACEHOLDER} aria-label="Add a collection" />
                </label>
                <button type="submit">Look up</button>
              </form>
              {nftTruth ? <p className="mt-1 text-subtle">{nftTruth}</p> : null}
              {nftHits.length ? (
                <ul className="mt-2 space-y-1">
                  {nftHits.map((hit) => (
                    <li key={hit.id}>
                      <button
                        type="button"
                        onClick={() => {
                          keepHouse(addNft(house, hit));
                          setNftHits([]);
                          setNftQuery("");
                        }}
                      >
                        Add {hit.symbol || hit.name} · {hit.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <section className="rounded-sm border border-border/40 p-2" aria-label="Favorites" style={{ background: "color-mix(in srgb, var(--plate-bg, #161412) 70%, transparent)" }}>
              <h3 className="text-[10px] uppercase tracking-[0.16em] text-subtle">Favorites</h3>
              {(() => {
                const fav = favoriteRows(house);
                if (!fav.tickers.length && !fav.nfts.length) return <p className="mt-2 text-subtle">{MARKET_FAVORITES_EMPTY}</p>;
                return (
                  <>
                    {fav.tickers.length ? (
                      <>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">Coins</p>
                        <ul className="mt-1 space-y-1">
                          {fav.tickers.map((row) => (
                            <li key={row.id} className="flex flex-wrap items-center gap-2">
                              <button type="button" onClick={() => keepHouse(pickTicker(house, row.id))}>
                                {row.symbol}
                              </button>
                              <button type="button" onClick={() => keepHouse(toggleFavoriteTicker(house, row.id))}>
                                ★
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {fav.nfts.length ? (
                      <>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-subtle">NFTs</p>
                        <ul className="mt-1 space-y-1">
                          {fav.nfts.map((row) => (
                            <li key={row.id} className="flex flex-wrap items-center gap-2">
                              <button type="button" onClick={() => keepHouse(pickNft(house, row.id))}>
                                {row.symbol || row.name}
                              </button>
                              <button type="button" onClick={() => keepHouse(toggleFavoriteNft(house, row.id))}>
                                ★
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </>
                );
              })()}
            </section>
          </div>
          {chrome.colorUi}
        </div>
      ) : null}
    </article>
  );
}

export { WEATHER_ID, NEWS_ID };
