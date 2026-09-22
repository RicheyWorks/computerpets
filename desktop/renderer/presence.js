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

  const api = { hasHostFiles, install, classifyKey, recordKeystroke };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPresence = api;
  if (typeof document !== "undefined") install(document);
})(typeof window !== "undefined" ? window : globalThis);
