/** The desk sits the guest you kept of that kind. */

export type DeskSitGuest = {
  id: string;
  name: string;
  species_key: string;
  is_active?: boolean;
  departed?: boolean;
};

/**
 * Prefer the kept-active guest of this kind. If none of that kind is active,
 * sit a living one of that kind. Newest-only find is not the sit.
 */
export function sitDeskGuest<T extends DeskSitGuest>(
  pets: readonly T[] | null | undefined,
  kindKey: string,
): T | null {
  const ofKind = (pets ?? []).filter((p) => p.species_key === kindKey && !p.departed);
  return ofKind.find((p) => p.is_active) ?? ofKind[0] ?? null;
}
