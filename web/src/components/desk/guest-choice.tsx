import { useRef, useState, type KeyboardEvent } from "react";
import type { GuestChoiceMark } from "@/lib/pets/guest-choice";
import { menuKey } from "@/lib/pets/keeper";
import { cn } from "@/lib/utils";

/**
 * A small paper of sits. They pick. Then the guest does that sit.
 * It behaves as a menu (opened from the guest, one pick closes it), so it is one: role="menu" with
 * menuitem buttons and one tab stop. Arrow keys walk the sits (both ways, wrapping), Home and End jump,
 * Escape closes it and the room puts focus back on the guest. It is not a Care toolbar inside a menu.
 */
export function GuestChoice({
  marks,
  onPick,
  onClose,
  phone,
  tablet,
}: {
  marks: GuestChoiceMark[];
  /** `keys` is true when the pick came from the keyboard (Enter or Space), so focus goes back to the guest. */
  onPick: (id: GuestChoiceMark["id"], how?: { keys?: boolean }) => void;
  onClose?: () => void;
  phone?: boolean;
  tablet?: boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const stop = Math.min(active, Math.max(marks.length - 1, 0));

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
    const act = menuKey(e.key, items.indexOf(document.activeElement as HTMLButtonElement), items.length);
    if (act == null) return;
    e.preventDefault();
    if (act === "close") {
      // The room's own Escape listener would close it too; this one also brings focus home.
      e.stopPropagation();
      onClose?.();
      return;
    }
    setActive(act);
    items[act]?.focus();
  }

  return (
    <div
      className="guest-choice pointer-events-auto absolute inset-x-0 z-30 flex justify-center px-3"
      data-guest-choice
    >
      <div
        className={cn(
          "rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 shadow-lg",
          phone ? "max-w-[min(100%,18rem)]" : tablet ? "max-w-[min(100%,22rem)]" : "max-w-[min(100%,20rem)]",
        )}
      >
        <div
          ref={menuRef}
          role="menu"
          aria-label="A sit"
          aria-orientation="horizontal"
          className={cn("blotter-care", phone ? "blotter-care-phone" : tablet ? "blotter-care-tablet" : undefined)}
          onKeyDown={onKeyDown}
        >
          {marks.map((mark, i) => (
            <span key={mark.id} className="contents" role="none">
              {i > 0 ? <span className="blotter-care-dot" aria-hidden /> : null}
              <button
                type="button"
                role="menuitem"
                tabIndex={i === stop ? 0 : -1}
                className="blotter-ink"
                onFocus={() => setActive(i)}
                onClick={(e) => onPick(mark.id, { keys: e.detail === 0 })}
              >
                {mark.label}
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
