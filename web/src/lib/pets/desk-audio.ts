import { isMuted, loadCard, guestOf, type SoundKind } from "./card.ts";
import { stepOf, stepSrc, voiceSrc, type StepKind } from "./house-sounds.ts";

type Kind = SoundKind | "step" | "voice" | "call" | "music" | "radio";

let ctx: AudioContext | null = null;

/**
 * Sound waits for the visitor's first tap, click or key. /demo's pet walks and hops on its own, and each hop made
 * (or resumed) an AudioContext before any gesture: the browser refused it and logged an autoplay warning, four
 * before the first tap. The browser's own sticky activation answers where it has one; the capture listeners
 * below answer where it has not. Volumes are untouched.
 */
let gestured = false;

function heardGesture() {
  if (gestured) return true;
  const activation = (navigator as Navigator & { userActivation?: { hasBeenActive?: boolean } }).userActivation;
  if (activation?.hasBeenActive) gestured = true;
  return gestured;
}

if (typeof window !== "undefined") {
  const GESTURES = ["pointerdown", "keydown", "touchend", "click"] as const;
  // Only a real gesture: the room's own element.click() and dispatched keys are untrusted and do not count.
  const mark = (event: Event) => {
    if (!event.isTrusted) return;
    gestured = true;
    for (const type of GESTURES) window.removeEventListener(type, mark, true);
  };
  for (const type of GESTURES) window.addEventListener(type, mark, true);
}

function context() {
  if (typeof window === "undefined" || !heardGesture()) return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function unlockDeskAudio() {
  context();
}

export function playClip(src: string, guestKey = "red_panda", kind: Kind = "chirp"): Promise<boolean> {
  const card = loadCard();
  if (!src || isMuted(card.mutes, kind)) return Promise.resolve(false);
  // Before a gesture the browser refuses play() anyway (false, as before), and logs it; this skips the try.
  if (typeof window === "undefined" || !heardGesture()) return Promise.resolve(false);
  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, guestOf(card, guestKey).volume / 100));
    return audio.play().then(
      () => true,
      () => false,
    );
  } catch {
    /* never break the pet loop */
    return Promise.resolve(false);
  }
}

export function playVoice(key: string, guestKey = key): Promise<boolean> {
  return playClip(voiceSrc(key), guestKey, "voice");
}

export function playStep(guestKey = "red_panda") {
  const card = loadCard();
  const guest = guestOf(card, guestKey);
  const kind = stepOf(card.stepKind, guest.stepKind, guestKey) as StepKind;
  if (kind === "mute") return;
  playClip(stepSrc(kind, guestKey), guestKey, "step");
}

export function playDeskSound(kind: Kind, guestKey = "red_panda") {
  const card = loadCard();
  if (isMuted(card.mutes, kind)) return;
  if (kind === "step") {
    playStep(guestKey);
    return;
  }
  if (kind === "voice" || kind === "call") {
    playVoice(guestKey, guestKey);
    return;
  }
  const ac = context();
  if (!ac) return;
  try {
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    const volume = guestOf(card, guestKey).volume / 100;

    const jitter = 0.92 + Math.random() * 0.16;
    let end = now + 0.1;
    // A step never gets here: it returned above to play the house step clip (playStep).
    if (kind === "hop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
      filter.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.045 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      end = now + 0.2;
    } else if (kind === "munch") {
      osc.type = "square";
      osc.frequency.setValueAtTime(90 * jitter, now);
      filter.frequency.setValueAtTime(280, now);
      gain.gain.setValueAtTime(0.028 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      end = now + 0.1;
    } else if (kind === "rain") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(220 * jitter, now);
      filter.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.018 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      end = now + 0.09;
    } else if (kind === "wind") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(180 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);
      filter.frequency.setValueAtTime(500, now);
      gain.gain.setValueAtTime(0.018 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
      end = now + 0.26;
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.035 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      end = now + 0.15;
    }
    osc.start(now);
    osc.stop(end);
  } catch {
    /* never break the pet loop */
  }
}
