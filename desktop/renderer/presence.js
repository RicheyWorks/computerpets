/** Presence drop guard. A file dragged onto the desk is not opened and not read. */
(function (root) {
  function typesOf(transfer) {
    if (!transfer || transfer.types == null) return [];
    try {
      return Array.from(transfer.types).map((t) => String(t));
    } catch {
      return [];
    }
  }

  function hasHostFiles(transfer) {
    if (!transfer) return false;
    const types = typesOf(transfer);
    const count = transfer.files && typeof transfer.files.length === "number" ? transfer.files.length : 0;
    return count > 0 || types.indexOf("Files") >= 0 || types.indexOf("text/uri-list") >= 0 || types.indexOf("application/x-moz-file") >= 0;
  }

  function onHostDrag(event) {
    const transfer = event && event.dataTransfer;
    if (!hasHostFiles(transfer)) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      transfer.dropEffect = "none";
    } catch {
      /* ignore */
    }
  }

  function install(target) {
    const node = target || (typeof document !== "undefined" ? document : null);
    if (!node || typeof node.addEventListener !== "function") return function () {};
    node.addEventListener("dragenter", onHostDrag, true);
    node.addEventListener("dragover", onHostDrag, true);
    node.addEventListener("drop", onHostDrag, true);
    return function () {
      node.removeEventListener("dragenter", onHostDrag, true);
      node.removeEventListener("dragover", onHostDrag, true);
      node.removeEventListener("drop", onHostDrag, true);
    };
  }

  const FIELD_TAGS = { INPUT: 1, TEXTAREA: 1, SELECT: 1 };

  function isFocusedField(event) {
    if (!event || typeof event !== "object") return false;
    if (event.focused === true || event.field === true) return true;
    const target = event.target;
    if (!target || typeof target !== "object") return false;
    if (target.isContentEditable === true) return true;
    const tag = String(target.tagName || target.tag || "").toUpperCase();
    if (FIELD_TAGS[tag]) return true;
    if (typeof target.closest === "function") {
      try {
        return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * A key outside a focused field is not a presence log.
   * A focused field keeps the character. This does not read it.
   * Escape outside a field may dismiss a menu. The key text is not returned.
   */
  function keyText(event) {
    if (!event || typeof event !== "object" || !("key" in event)) return "";
    const value = event.key;
    return typeof value === "string" ? value : "";
  }

  function classifyKey(event) {
    if (isFocusedField(event)) return { record: false, field: true, toggle: false };
    if (keyText(event) === "Escape") return { record: false, field: false, toggle: "dismiss" };
    return { record: false, field: false, toggle: false };
  }

  /** Refuse a keystroke log. The buffer is not appended. The key is not returned. */
  function recordKeystroke(_buffer, _event) {
    return { record: false, keys: [] };
  }

  const WEATHER_LOCATE_MS = 120000;
  let weatherLocateYes = false;

  /** The Send the place button. A cached Chromium grant is not this yes. */
  function noteWeatherLocateYes() {
    weatherLocateYes = true;
  }

  /** Don't send, and any path that must not leave a yes armed. */
  function holdWeatherLocate() {
    weatherLocateYes = false;
  }

  function weatherLocateOptions() {
    return { maximumAge: 0, timeout: WEATHER_LOCATE_MS, enableHighAccuracy: false };
  }

  function closeWeatherLocate(hooks) {
    if (!hooks || typeof hooks.clear !== "function") return Promise.resolve();
    try {
      return Promise.resolve(hooks.clear()).then(
        () => {},
        () => {},
      );
    } catch {
      return Promise.resolve();
    }
  }

  /**
   * IP place is not a location grant. There is no keeper control that asks
   * to use the network's city, so this returns nothing. A consent argument
   * does not open a lookup. Callers must not fetch a network city.
   */
  function ipPlace() {
    return null;
  }

  /** The page does not read a machine id. License binding is the overlay main process. */
  function readMachineMark() {
    return { read: false, raw: null, id: "" };
  }

  /**
   * One weather-button fix after noteWeatherLocateYes. A second call in the
   * session does not call getCurrentPosition until that yes is noted again.
   * maximumAge is 0, so a cached position is not a silent re-read.
   * A prior browser allow can still satisfy the fresh yes without a new OS or browser prompt.
   * This cannot revoke that grant. Electron 44 ResetPermission is empty.
   * A timer or a panel reopen does not note the yes.
   */
  function readWeatherHere(geo, hooks) {
    if (!weatherLocateYes) return Promise.resolve(null);
    weatherLocateYes = false;
    let pending = Promise.resolve();
    if (hooks && typeof hooks.arm === "function") {
      try {
        pending = Promise.resolve(hooks.arm());
      } catch (err) {
        pending = Promise.reject(err);
      }
    }
    const opts = weatherLocateOptions();
    return pending
      .then(
        () =>
          new Promise((resolve) => {
            if (!geo || typeof geo.getCurrentPosition !== "function") {
              resolve(null);
              return;
            }
            let settled = false;
            const done = (value) => {
              if (settled) return;
              settled = true;
              resolve(value);
            };
            try {
              geo.getCurrentPosition(
                (pos) => {
                  const coords = pos && pos.coords;
                  const lat = coords ? Number(coords.latitude) : NaN;
                  const lon = coords ? Number(coords.longitude) : NaN;
                  done(Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null);
                },
                () => done(null),
                opts,
              );
            } catch {
              done(null);
            }
          }),
      )
      .then(
        (fix) => closeWeatherLocate(hooks).then(() => fix),
        (err) =>
          closeWeatherLocate(hooks).then(() => {
            throw err;
          }),
      );
  }

  const api = {
    hasHostFiles,
    install,
    classifyKey,
    recordKeystroke,
    ipPlace,
    readMachineMark,
    readWeatherHere,
    weatherLocateOptions,
    noteWeatherLocateYes,
    holdWeatherLocate,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPresence = api;
  if (typeof document !== "undefined") install(document);
})(typeof window !== "undefined" ? window : globalThis);
