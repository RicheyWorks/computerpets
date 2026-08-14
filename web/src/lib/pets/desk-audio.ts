type Kind = "step" | "hop" | "munch" | "chirp";

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

export function playDeskSound(kind: Kind) {
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

    const jitter = 0.92 + Math.random() * 0.16;
    let end = now + 0.1;
    if (kind === "step") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140 * jitter, now);
      filter.frequency.setValueAtTime(420, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      end = now + 0.08;
    } else if (kind === "hop") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(320 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);
      filter.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      end = now + 0.2;
    } else if (kind === "munch") {
      osc.type = "square";
      osc.frequency.setValueAtTime(90 * jitter, now);
      filter.frequency.setValueAtTime(280, now);
      gain.gain.setValueAtTime(0.028, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      end = now + 0.1;
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520 * jitter, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.12);
      filter.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      end = now + 0.15;
    }
    osc.start(now);
    osc.stop(end);
  } catch {
    /* never break the pet loop */
  }
}
