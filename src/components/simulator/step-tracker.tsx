const STEPS = ["Tell us", "Understand", "Simulate"] as const;

/** Visible progress through the simulation flow. current is 1, 2 or 3. */
export function StepTracker({ current, answered }: { current: 1 | 2 | 3; answered?: number }) {
  return (
    <div className="border-ink/10 bg-surface mt-6 border p-4 sm:p-5">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < current;
          const active = n === current;
          return (
            <li key={label} className="flex flex-1 items-center gap-3">
              <span
                className={`wedge font-display grid size-8 shrink-0 place-items-center text-sm ${
                  active
                    ? "bg-volt text-ink"
                    : done
                      ? "bg-ink text-inverse-foreground"
                      : "border-ink/20 text-muted-foreground border"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`text-sm font-semibold tracking-wide uppercase ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {n}. {label}
                {active && n === 2 && typeof answered === "number" ? (
                  <span className="text-muted-foreground ml-2 text-xs normal-case">
                    {answered} of about 6 answered
                  </span>
                ) : null}
              </span>
              {n < STEPS.length && (
                <span
                  aria-hidden
                  className={`hidden h-0.5 flex-1 sm:block ${done ? "bg-ink" : "bg-ink/15"}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
