import { Link } from "@tanstack/react-router";

import { DATA_LAST_UPDATED } from "../../lib/methodology";

/** Always-visible honesty banner on every result screen. */
export function ResultsDisclaimer({ sticky = false }: { sticky?: boolean }) {
  return (
    <div
      className={`border-volt bg-surface text-foreground flex flex-wrap items-center gap-x-3 gap-y-1 border-l-4 px-4 py-3 text-xs ${
        sticky ? "sticky top-0 z-10 shadow-sm" : ""
      }`}
    >
      <span className="font-semibold tracking-wide uppercase">
        Simulated insights only — not financial advice
      </span>
      <span className="text-muted-foreground">Data last updated: {DATA_LAST_UPDATED}</span>
      <Link to="/methodology" className="hover:text-flame ml-auto underline">
        How we calculate this
      </Link>
    </div>
  );
}
