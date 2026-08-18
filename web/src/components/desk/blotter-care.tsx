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
  return (
    <div className={cn("blotter-care", className)} role="toolbar" aria-label="Care">
      {marks.map((mark, i) => (
        <span key={mark.label} className="contents">
          {i > 0 ? <span className="blotter-care-dot" aria-hidden /> : null}
          <button type="button" className="blotter-ink" disabled={mark.disabled} onClick={mark.onClick}>
            {mark.label}
          </button>
        </span>
      ))}
    </div>
  );
}
