import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export type CareMark = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function BlotterCare({
  marks,
  className,
}: {
  marks: CareMark[];
  className?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  /* The care word a keyboard (or a focused tap) pressed last. A care that makes the pet busy greys every word out,
     and a disabled button drops its focus to the page: Tab then started again at the top of the page. The row holds
     the focus meanwhile (tabIndex -1, not a Tab stop) and gives it back to that word once it can be pressed again. */
  const pressedRef = useRef<string | null>(null);
  const shut = marks.map((m) => (m.disabled ? "1" : "0")).join("");
  useEffect(() => {
    const row = rowRef.current;
    const label = pressedRef.current;
    if (!row || !label) return;
    const at = document.activeElement;
    // A focused button that was just disabled still reads as focused for a moment before the page takes it back.
    const lost = !at || at === document.body || at === row || (row.contains(at) && (at as HTMLButtonElement).disabled);
    if (!lost) {
      pressedRef.current = null;
      return;
    }
    const button = Array.from(row.querySelectorAll<HTMLButtonElement>("button")).find((b) => b.textContent === label);
    if (button && !button.disabled) {
      button.focus();
      pressedRef.current = null;
    } else if (document.activeElement !== row) {
      row.focus({ preventScroll: true });
    }
  }, [shut]);
  return (
    <div ref={rowRef} tabIndex={-1} className={cn("blotter-care outline-none", className)} role="toolbar" aria-label="Care">
      {marks.map((mark, i) => (
        <span key={mark.label} className="contents">
          {i > 0 ? <span className="blotter-care-dot" aria-hidden /> : null}
          <button
            type="button"
            className="blotter-ink"
            disabled={mark.disabled}
            onClick={(e) => {
              if (document.activeElement === e.currentTarget) pressedRef.current = mark.label;
              mark.onClick();
            }}
          >
            {mark.label}
          </button>
        </span>
      ))}
    </div>
  );
}
