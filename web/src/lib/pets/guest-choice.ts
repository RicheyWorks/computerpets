/** A tap on the guest is a choice, not a sit. They pick. Then they do that sit. */

export type GuestChoiceId =
  | "rest"
  | "walk"
  | "sit"
  | "talk"
  | "treat"
  | "play"
  | "special"
  | "hide"
  | "call"
  | "pick";

export type GuestChoiceMark = {
  id: GuestChoiceId;
  label: string;
};

export type GuestChoiceSit = {
  hidden?: boolean;
  leaving?: boolean;
  walking?: boolean;
  gifts?: number;
  treatVerb?: string;
  specialVerb?: string;
};

/** The sits a tap may offer. Rest is sleep. Walk and Sit change the pose. The rest are house verbs. */
export const GUEST_CHOICE = [
  "rest",
  "walk",
  "sit",
  "talk",
  "treat",
  "play",
  "special",
  "hide",
  "call",
  "pick",
] as const;

/** A tap opens the choice. It does not talk, sleep, or walk them. */
export function guestTap(): "choice" {
  return "choice";
}

/** Walk if they are still. Sit if they are walking. One mark. They pick the other sit. */
export function poseFlip(walking: boolean): GuestChoiceMark {
  return walking ? { id: "sit", label: "Sit" } : { id: "walk", label: "Walk" };
}

/** The marks they may pick. Hidden keeps Call back. A gift on the wood keeps Pick. */
export function guestMarks(sit: GuestChoiceSit = {}): GuestChoiceMark[] {
  const hidden = !!sit.hidden;
  const leaving = !!sit.leaving;
  const busy = hidden || leaving;
  const marks: GuestChoiceMark[] = [];
  if (!busy) {
    marks.push({ id: "rest", label: "Rest" });
    marks.push(poseFlip(!!sit.walking));
  }
  marks.push({ id: "talk", label: "Talk" });
  if (!busy) {
    marks.push({ id: "treat", label: sit.treatVerb || "Treat" });
    marks.push({ id: "play", label: "Play" });
  }
  marks.push({ id: "special", label: sit.specialVerb || "Special" });
  if (hidden) marks.push({ id: "call", label: "Call back" });
  else if (!leaving) marks.push({ id: "hide", label: "Hide" });
  if (!hidden && (sit.gifts ?? 0) > 0) marks.push({ id: "pick", label: "Pick" });
  return marks;
}

/** The sit they already know. A pick is not a new verb. */
export function guestPick(id: string): GuestChoiceId | null {
  return (GUEST_CHOICE as readonly string[]).includes(id) ? (id as GuestChoiceId) : null;
}

/** Extra wood around the guest on a finger sit. The pad is empty wood. It does not paint a plate. The room around them may still pan. */
export function guestHitPad(sit?: { phone?: boolean; tablet?: boolean } | null): number {
  if (sit?.phone) return 12;
  if (sit?.tablet) return 16;
  return 0;
}
