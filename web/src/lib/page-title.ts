import { useEffect } from "react";

/** The name every tab title ends with (the root route's own title). */
export const APP_TITLE = "ComputerPets";

/** "The desk" -> "The desk — ComputerPets"; nothing -> "ComputerPets". */
export function pageTitle(what?: string | null): string {
  const w = (what ?? "").replace(/\s+/g, " ").trim();
  return w ? `${w} — ${APP_TITLE}` : APP_TITLE;
}

/**
 * A pet's tab title: "Rui the Red Panda — ComputerPets". A pet whose name is its species (or no name) reads
 * "Red Panda — ComputerPets"; no species reads just the name.
 */
export function petTitle(name?: string | null, species?: string | null): string {
  const n = (name ?? "").replace(/\s+/g, " ").trim();
  const s = (species ?? "").replace(/\s+/g, " ").trim();
  if (!n) return pageTitle(s);
  if (!s || n.toLowerCase() === s.toLowerCase()) return pageTitle(n);
  return pageTitle(`${n} the ${s}`);
}

/** The route's head() title when the page opens; this one once the page knows who is here (the pet on the desk,
 * the pet on /pets/<key>). The route's title comes back when the page goes. */
export function useDocumentTitle(title: string | null | undefined) {
  useEffect(() => {
    if (!title || typeof document === "undefined") return;
    const before = document.title;
    document.title = title;
    // The router writes the route's head() <title> again when it finishes hydrating or re-renders the head. When that
    // landed after this effect, the tab said "The desk" instead of "Rui the Red Panda", depending on load timing (it
    // looked like a phone-versus-laptop difference). Only that same route title is put back; any other title is the
    // next page's (a navigation), and this one steps aside.
    const keep: MutationObserver | null =
      typeof MutationObserver === "function"
        ? new MutationObserver(() => {
            if (document.title === title) return;
            if (document.title !== before) {
              keep?.disconnect();
              return;
            }
            document.title = title;
          })
        : null;
    keep?.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      keep?.disconnect();
      // Only if nothing else set a title since (the next route's head() title wins on navigation).
      if (document.title === title) document.title = before;
    };
  }, [title]);
}
