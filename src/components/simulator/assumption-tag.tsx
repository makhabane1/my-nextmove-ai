import { useState } from "react";

import type { AssumptionNote } from "../../lib/methodology";

/** Small ⓘ that reveals the exact assumption, its source, and whether it's data or an AI estimate. */
export function AssumptionTag({ note, label }: { note: AssumptionNote; label?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`How we calculate ${label ?? "this figure"}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="text-muted-foreground hover:text-volt hover:border-volt border-line grid size-4 shrink-0 place-items-center border text-[9px] font-bold transition-colors"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="border-line bg-canvas text-canvas-foreground absolute bottom-full left-1/2 z-40 mb-2 w-60 -translate-x-1/2 border p-3 text-left text-xs leading-relaxed shadow-lg"
        >
          <span
            className={`mb-1.5 block text-[9px] font-bold tracking-widest uppercase ${
              note.kind === "data" ? "text-volt" : "text-flame"
            }`}
          >
            {note.kind === "data" ? "Hard data point" : "AI-generated estimate"}
          </span>
          <span className="block font-semibold">{note.assumption}</span>
          <span className="text-muted-foreground mt-1.5 block">{note.basis}</span>
        </span>
      )}
    </span>
  );
}
