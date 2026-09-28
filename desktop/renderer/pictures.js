/**
 * The pet pictures come through Git LFS. A Git without LFS (common on Mac and Linux: Xcode's git,
 * apt's git) copies small text pointers instead of PNGs, and every pet on the glass would be
 * invisible with no word said. desktop.sh / desktop.ps1 check this before npm install; this is the
 * same check for a keeper who starts the overlay straight from `npm start`.
 */
(function (root) {
  const PICTURE = ["sprites", "crow", "idle", "1.png"];
  const POINTER = "version https://git-lfs";
  const LINK = "https://git-lfs.com";
  const STEPS =
    "Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull";
  const TITLE = "The pet pictures did not download";
  const TRAY = "Pet pictures did not download";

  /** "ready" | "lfs-pointers" | "missing", read from renderer/sprites/crow/idle/1.png. */
  function picturesState(rendererDir, io, join) {
    const file = (join || ((...p) => p.join("/")))(rendererDir, ...PICTURE);
    let bytes;
    try {
      bytes = io.readFileSync(file);
    } catch {
      return "missing";
    }
    const head = Buffer.from(bytes).subarray(0, POINTER.length).toString("latin1");
    return head === POINTER ? "lfs-pointers" : "ready";
  }

  /** The plain words the overlay shows instead of invisible pets. */
  function words(state) {
    const why =
      state === "missing"
        ? "The pet pictures are not in this copy of ComputerPets."
        : "They come through Git LFS, which this Git does not have yet.";
    return {
      state,
      title: TITLE,
      message: TITLE + ".",
      detail: `${why} ${STEPS}, and start ComputerPets again.`,
      tray: TRAY,
      link: LINK,
    };
  }

  /** Tray rows while the pictures are missing: what happened, how to fix, and Quit. */
  function trayRows(w) {
    return [
      { label: w.tray, enabled: false },
      { label: "How to fix…", action: "explain" },
      { label: "Open git-lfs.com", action: "link" },
      { type: "separator" },
      { label: "Quit", action: "quit" },
    ];
  }

  const api = { PICTURE, POINTER, LINK, STEPS, TITLE, TRAY, picturesState, words, trayRows };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPictures = api;
})(typeof window !== "undefined" ? window : globalThis);
