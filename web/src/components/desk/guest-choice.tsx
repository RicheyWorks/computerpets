import { BlotterCare, type CareMark } from "@/components/desk/blotter-care";
import type { GuestChoiceMark } from "@/lib/pets/guest-choice";
import { cn } from "@/lib/utils";

/** A small paper of sits. They pick. Then the guest does that sit. */
export function GuestChoice({
  marks,
  onPick,
  phone,
  tablet,
}: {
  marks: GuestChoiceMark[];
  onPick: (id: GuestChoiceMark["id"]) => void;
  phone?: boolean;
  tablet?: boolean;
}) {
  const care: CareMark[] = marks.map((mark) => ({
    label: mark.label,
    onClick: () => onPick(mark.id),
  }));
  return (
    <div
      className="guest-choice pointer-events-auto absolute inset-x-0 z-30 flex justify-center px-3"
      data-guest-choice
      role="menu"
      aria-label="A sit"
    >
      <div
        className={cn(
          "rounded-[var(--radius-md)] border border-border bg-surface/95 px-3 py-2 shadow-lg",
          phone ? "max-w-[min(100%,18rem)]" : tablet ? "max-w-[min(100%,22rem)]" : "max-w-[min(100%,20rem)]",
        )}
      >
        <BlotterCare
          className={phone ? "blotter-care-phone" : tablet ? "blotter-care-tablet" : undefined}
          marks={care}
        />
      </div>
    </div>
  );
}
