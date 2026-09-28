/**
 * The /meet catalog, made walkable on a phone. It listed all two hundred twenty-one guests as tall cards, one after
 * another (about 135,000 px on a 375 px phone). Now each room is a drawer that opens (closed at first), a row of
 * room links jumps to a drawer and opens it, and "Find a guest" filters every guest by name or kind. Every guest
 * stays in the page (a closed drawer still holds its cards), so nothing is out of reach.
 */

/** The anchor of a room's drawer on /meet: /meet#room-snakes opens the snakes. */
export function meetRoomAnchor(id: string): string {
  return `room-${id}`;
}

/** The room id in a /meet hash ("#room-snakes" -> "snakes"), or null. */
export function roomFromHash(hash: string | null | undefined, ids: readonly string[]): string | null {
  const m = /^#?room-([a-z0-9_-]+)$/i.exec((hash ?? "").trim());
  if (!m) return null;
  const id = m[1]!.toLowerCase();
  return ids.includes(id) ? id : null;
}

/** Lower case, no accents, single spaces: "Émile  the Gecko" -> "emile the gecko". */
export function foldQuery(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export type MeetGuest = { key: string; slug: string; name: string; speciesLabel: string };

/** A guest matches when every word of the query is in its name, its kind, or its slug. An empty query matches all. */
export function guestMatches(guest: MeetGuest, query: string): boolean {
  const words = foldQuery(query).split(" ").filter(Boolean);
  if (!words.length) return true;
  const hay = foldQuery(`${guest.name} ${guest.speciesLabel} ${guest.slug.replace(/[-_]/g, " ")} ${guest.key.replace(/_/g, " ")}`);
  return words.every((w) => hay.includes(w));
}

/** The words under the search box: how many match, in plain words. */
export function matchLine(count: number, total: number, query: string, rooms: number): string {
  if (!foldQuery(query)) return `${total} guests in ${rooms} rooms. Open a room, or type a name.`;
  if (count === 0) return "No guest by that name. Try a kind, like fox or owl.";
  return count === 1 ? "1 guest matches." : `${count} guests match.`;
}

/**
 * The same way through a room's field notes (/study, /log): each guest's note is a drawer, closed at first, with a
 * search over them and a link that opens one (/study#note-rui). Every note stays in the page.
 */
export function noteAnchor(slug: string): string {
  return `note-${slug}`;
}

/** The guest slug in a field-notes hash ("#note-rui" -> "rui"), or null. */
export function noteFromHash(hash: string | null | undefined, slugs: readonly string[]): string | null {
  const m = /^#?note-([a-z0-9_-]+)$/i.exec((hash ?? "").trim());
  if (!m) return null;
  const slug = m[1]!.toLowerCase();
  return slugs.includes(slug) ? slug : null;
}

/** The words under a room's note search: how many match, in plain words. */
export function notesLine(count: number, total: number, query: string, example: string): string {
  if (!foldQuery(query)) return `${total} field notes. Open one, or type a name.`;
  if (count === 0) return `No guest by that name here. Try a kind, like ${example}.`;
  return count === 1 ? "1 note matches." : `${count} notes match.`;
}
