/** A house guest the phone can sit by key or slug. */
export type LiveKindName = {
  key: string;
  slug: string;
};

export type LivePetName = string | readonly string[] | undefined | null;

/**
 * The phone sits the first named kind. A key or a slug is enough.
 * Two names: the first real guest. An unknown name is not Rui.
 */
export function sitLiveKind<T extends LiveKindName>(
  pet: LivePetName,
  kinds: readonly T[],
): T | undefined {
  const names = Array.isArray(pet) ? pet : pet == null ? [] : [pet];
  for (const raw of names) {
    if (typeof raw !== "string") continue;
    const name = raw.trim();
    if (!name) continue;
    const bySlug = kinds.find((k) => k.slug === name);
    if (bySlug) return bySlug;
    const byKey = kinds.find((k) => k.key === name);
    if (byKey) return byKey;
  }
  return undefined;
}
