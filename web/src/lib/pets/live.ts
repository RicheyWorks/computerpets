import { LIVING_KINDS, livingBySlug, type LivingKind } from "./living";

export type LivePetName = string | readonly string[] | undefined | null;

/**
 * The phone sits the first named kind. A key or a slug is enough.
 * Two names: the first real guest. An unknown name is not Rui.
 */
export function sitLiveKind(pet: LivePetName): LivingKind | undefined {
  const names = Array.isArray(pet) ? pet : pet == null ? [] : [pet];
  for (const raw of names) {
    if (typeof raw !== "string") continue;
    const name = raw.trim();
    if (!name) continue;
    const bySlug = livingBySlug(name);
    if (bySlug) return bySlug;
    const byKey = LIVING_KINDS.find((k) => k.key === name);
    if (byKey) return byKey;
  }
  return undefined;
}
