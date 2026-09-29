/**
 * The pet pictures come through Git LFS. A Git without LFS (common on Mac and Linux: Xcode's git,
 * apt's git) copies small text pointers instead of PNGs, and every pet on the glass would be
 * invisible with no word said. A `git lfs pull` that stopped partway (a lost connection, a full disk)
 * leaves some pets as pointers too, and those pets would be invisible. desktop.sh / desktop.ps1 check
 * this before npm install; this is the same check for a keeper who starts the overlay straight from
 * `npm start`.
 *
 * Cheap enough for every start: a pointer is a small text file (about 130 bytes) and every real picture
 * here is over 10 KB, so only files under 1 KB are opened. The rest is one directory walk and a size each.
 */
(function (root) {
  const PICTURE = ["sprites", "crow", "idle", "1.png"];
  const POINTER = "version https://git-lfs";
  /** Files at least this big are pictures; only smaller ones are opened to see if they are pointers. */
  const SMALL = 1024;
  const LINK = "https://git-lfs.com";
  const STEPS =
    "Install Git LFS from https://git-lfs.com, then in the computerpets folder run git lfs install and then git lfs pull";
  /** A pull that stopped: Git LFS is here, it only has to fetch the rest. */
  const PULL = "In the computerpets folder run git lfs pull";
  const TITLE = "The pet pictures did not download";
  const TRAY = "Pet pictures did not download";
  const PARTIAL_TITLE = "Some pet pictures did not download";
  const PARTIAL_TRAY = "Some pet pictures did not download";

  function isPointer(bytes) {
    return Buffer.from(bytes).subarray(0, POINTER.length).toString("latin1") === POINTER;
  }

  /** Whether any picture under dir (a pet's folder) is still a Git LFS pointer. Stops at the first one. */
  function holdsPointer(dir, io, join) {
    let items;
    try {
      items = io.readdirSync(dir, { withFileTypes: true });
    } catch {
      return false;
    }
    for (const it of items) {
      const at = join(dir, it.name);
      if (it.isDirectory()) {
        if (holdsPointer(at, io, join)) return true;
        continue;
      }
      if (!it.name.endsWith(".png")) continue;
      try {
        if (io.statSync(at).size >= SMALL) continue;
        if (isPointer(io.readFileSync(at))) return true;
      } catch {
        /* a file that went away is not a pointer */
      }
    }
    return false;
  }

  /**
   * { state, missing, total }: state is "ready" | "partial" | "lfs-pointers" | "missing"; missing is how many pets
   * still have a Git LFS pointer instead of a picture, out of total pet folders under renderer/sprites.
   */
  function picturesSurvey(rendererDir, io, join) {
    const j = join || ((...p) => p.join("/"));
    let crow;
    try {
      crow = io.readFileSync(j(rendererDir, ...PICTURE));
    } catch {
      return { state: "missing", missing: 0, total: 0 };
    }
    const sprites = j(rendererDir, "sprites");
    let pets = [];
    try {
      pets = io
        .readdirSync(sprites, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {
      pets = [];
    }
    // The folder could not be listed: the crow's picture alone decides, as before.
    if (!pets.length) return isPointer(crow) ? { state: "lfs-pointers", missing: 1, total: 1 } : { state: "ready", missing: 0, total: 1 };
    let missing = 0;
    for (const pet of pets) if (holdsPointer(j(sprites, pet), io, j)) missing += 1;
    const total = pets.length;
    const state = missing === 0 ? "ready" : missing >= total ? "lfs-pointers" : "partial";
    return { state, missing, total };
  }

  /** "ready" | "partial" | "lfs-pointers" | "missing" (picturesSurvey without the counts). */
  function picturesState(rendererDir, io, join) {
    return picturesSurvey(rendererDir, io, join).state;
  }

  /** "12 of 221 pets are still missing their pictures" (one pet: "is ... its"). */
  function petsLine(missing, total) {
    return missing === 1
      ? `1 of ${total} pets is still missing its pictures`
      : `${missing} of ${total} pets are still missing their pictures`;
  }

  /** The plain words the overlay shows instead of invisible pets. counts is picturesSurvey's answer (for partial). */
  function words(state, counts) {
    if (state === "partial") {
      const c = counts || { missing: 0, total: 0 };
      return {
        state,
        title: PARTIAL_TITLE,
        message: PARTIAL_TITLE + ".",
        detail: `${petsLine(c.missing, c.total)}: Git LFS stopped before it fetched them all. ${PULL}, and start ComputerPets again.`,
        tray: PARTIAL_TRAY,
        link: LINK,
      };
    }
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

  const api = {
    PICTURE,
    POINTER,
    SMALL,
    LINK,
    STEPS,
    PULL,
    TITLE,
    TRAY,
    PARTIAL_TITLE,
    isPointer,
    picturesSurvey,
    picturesState,
    petsLine,
    words,
    trayRows,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.PetPictures = api;
})(typeof window !== "undefined" ? window : globalThis);
