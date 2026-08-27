import { useEffect, useMemo, useRef, useState } from "react";
import {
  addArea,
  currentArea,
  forecastUrl,
  geocodeUrl,
  NO_AREA,
  parseForecast,
  parseGeocode,
  pickArea,
  plateLine,
  removeArea,
  renameArea,
  type LiveSky,
  type WeatherArea,
} from "@/lib/pets/weather-areas";
import { CANT_REACH, NEWS_SOURCE, newsLine, newsUrl, NO_HEADLINES, parseNews, type NewsItem } from "@/lib/pets/news";
import { loadCard, saveCard, type CardPrefs } from "@/lib/pets/card";
import type { DeskWindow } from "@/lib/pets/windows";
import { cn } from "@/lib/utils";

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
  const [geoOffer, setGeoOffer] = useState(false);
  const areas = useMemo(() => areasOf(card), [card]);
  const area = currentArea(areas);

  useEffect(() => {
    let granted = false;
    if (navigator.permissions?.query) {
      void navigator.permissions.query({ name: "geolocation" }).then((p) => {
        if (p.state === "granted") setGeoOffer(true);
      }).catch(() => undefined);
    }
    return () => {
      granted = true;
      void granted;
    };
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
    if (!url) return;
    setLooking(true);
    try {
      const json = await (await fetch(url)).json();
      setHits(parseGeocode(json));
    } catch {
      setHits([]);
    } finally {
      setLooking(false);
    }
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
        "desk-plate pointer-events-auto absolute left-[4%] top-[8%] z-[4] w-[min(18rem,42%)] rounded-sm border border-border/50 bg-surface/80 shadow-lg",
        open && "w-[min(22rem,52%)]",
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">Weather</span>
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
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void search();
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="A city or place"
              aria-label="Look up an area"
            />
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
          ) : query && !looking ? (
            <p className="mt-2 text-subtle">No place from that look-up.</p>
          ) : null}
          {geoOffer ? (
            <button
              type="button"
              className="mt-2"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    add({
                      id: "here",
                      name: "This computer",
                      query: "this computer",
                      lat: pos.coords.latitude,
                      lon: pos.coords.longitude,
                    });
                  },
                  () => undefined,
                  { maximumAge: 600_000 },
                );
              }}
            >
              Use this computer's location
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function DeskNewsPlate() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(newsUrl())
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const next = parseNews(json);
        setItems(next);
        setUnread(!next.length);
      })
      .catch(() => {
        if (!cancelled) setUnread(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <article
      data-hit
      data-desk-plate="news"
      className={cn(
        "desk-plate pointer-events-auto absolute right-[8%] top-[8%] z-[4] w-[min(18rem,40%)] rounded-sm border border-border/50 bg-surface/80 shadow-lg",
        open && "w-[min(22rem,48%)]",
      )}
    >
      <button type="button" className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left" onClick={() => setOpen((v) => !v)}>
        <span className="text-[10px] uppercase tracking-[0.16em] text-subtle">News</span>
        <span className="truncate text-sm text-ink">{newsLine(items, unread)}</span>
      </button>
      {open ? (
        <div className="border-t border-border/40 px-3 py-2 text-sm">
          <p className="text-[10px] uppercase tracking-[0.16em] text-subtle">{NEWS_SOURCE}</p>
          {unread && !items.length ? <p className="text-subtle">{CANT_REACH}</p> : null}
          {!unread && !items.length ? <p className="text-subtle">{NO_HEADLINES}</p> : null}
          <ul className="mt-2 space-y-2">
            {items.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                  {item.title}
                </a>
                {item.summary ? <p className="text-subtle">{item.summary}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

export { WEATHER_ID, NEWS_ID };
