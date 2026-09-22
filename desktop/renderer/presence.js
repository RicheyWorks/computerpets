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

  const api = { hasHostFiles, install };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPresence = api;
  if (typeof document !== "undefined") install(document);
})(typeof window !== "undefined" ? window : globalThis);
