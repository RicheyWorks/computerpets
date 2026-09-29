import { useEffect, useId, useState } from "react";
import { firstHintSeen, firstHintWeb, markFirstHintSeen } from "@/lib/pets/first-run";

/**
 * The one-time hello for a brand-new keeper (lib/pets/first-run.ts). A labelled region with plain words
 * and one Got it button in page order, so Tab reaches it and a screen reader reads it as a named section.
 * It shows after the first render (never during a server render) and never again once Got it is pressed.
 */
export function FirstHint({ name, onDone, wait = false }: { name: string; onDone?: () => void; wait?: boolean }) {
  const [show, setShow] = useState(false);
  const id = useId();
  useEffect(() => setShow(!firstHintSeen()), []);
  // wait: the pet is hidden. The hello said "Tap Rui" while only a faded tail showed at the panel's edge; it
  // waits for Call back now (the hidden note says so) and shows, still unseen, once the pet is back.
  if (!show || wait) return null;
  const hint = firstHintWeb(name);
  return (
    <section
      aria-labelledby={`${id}-title`}
      data-first-hint
      className="mt-4 max-w-sm rounded-[var(--radius-md)] border border-border bg-surface/95 px-4 py-3 shadow-sm"
    >
      <h2 id={`${id}-title`} className="text-sm font-semibold text-fg">
        {hint.title}
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
        {hint.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {/* The pet's speech bubble steps around Got it (living-pet.tsx reads [data-bubble-avoid]). On a tall phone
          the hello line sat over the button and took the tap (414×896, the phone-desk-layout "Got it is covered"). */}
      <button
        type="button"
        data-first-hint-ok
        data-bubble-avoid=""
        className="mt-3 rounded-full border border-border px-3 py-1 text-sm text-fg hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        onClick={() => {
          markFirstHintSeen();
          setShow(false);
          onDone?.();
        }}
      >
        {hint.ok}
      </button>
    </section>
  );
}
