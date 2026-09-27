import { useId } from "react";
import { Button } from "@/components/ui/button";
import { RETRY_LABEL } from "@/lib/plain-error";

/**
 * A failed first load, said plainly with a retry. `line` comes from `loadProblem`
 * (web/src/lib/plain-error.ts), so it is never raw error text.
 */
export function LoadProblem({
  line,
  onRetry,
  busy = false,
  className = "",
}: {
  line: string;
  onRetry: () => void;
  busy?: boolean;
  className?: string;
}) {
  const lineId = useId();
  return (
    <div role="alert" className={`space-y-3 ${className}`.trim()}>
      <p id={lineId} className="text-sm text-muted">{line}</p>
      <Button type="button" variant="secondary" size="sm" disabled={busy} aria-describedby={lineId} onClick={onRetry}>
        {RETRY_LABEL}
      </Button>
    </div>
  );
}
