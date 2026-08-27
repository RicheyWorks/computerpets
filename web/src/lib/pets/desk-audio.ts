import { isMuted, loadCard, guestOf, type SoundKind } from "./card.ts";

type Kind = SoundKind | "step";

let ctx: AudioContext | null = null;

function context() {
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  void ctx.resume();
  return ctx;
}

export function unlockDeskAudio() {
  context();
}

export function playDeskSound(kind: Kind, guestKey = "red_panda") {
  const card = loadCard();
  if (isMuted(card.mutes, kind)) return;
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
    if (kind === "step") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * jitter, now);
      filter.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.03 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      end = now + 0.08;
    } else if (kind === "hop") {
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
