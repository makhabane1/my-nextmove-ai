import { Link } from "@tanstack/react-router";

import { SAMPLE_SIMULATIONS, type SampleSimulation } from "../lib/sample-simulations";

const riskStyle = (risk: string) =>
  risk === "Low"
    ? "bg-volt text-ink"
    : risk === "Medium"
      ? "bg-ink text-inverse-foreground"
      : "bg-flame text-inverse-foreground";

/** A real worked example, visible without signing up. */
export function SampleSimulation({
  sample,
  onPick,
}: {
  sample: SampleSimulation;
  onPick: (key: string) => void;
}) {
  return (
    <div className="border-ink/10 bg-surface border p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {SAMPLE_SIMULATIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onPick(s.key)}
            aria-pressed={s.key === sample.key}
            className={`wedge px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
              s.key === sample.key ? "bg-ink text-inverse-foreground" : "border-ink/20 border"
            }`}
          >
            {s.starter}
          </button>
        ))}
      </div>

      <p className="text-flame mt-6 text-xs font-semibold tracking-[0.2em] uppercase">
        Example · {sample.person}
      </p>
      <h3 className="font-display mt-2 text-2xl tracking-tight sm:text-3xl">{sample.question}</h3>
      <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
        {sample.summary}
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {sample.paths.map((p) => (
          <div key={p.letter} className="border-ink/10 bg-card text-card-foreground border p-5">
            <div className="flex items-center gap-3">
              <span className="wedge bg-volt text-ink font-display grid size-8 place-items-center">
                {p.letter}
              </span>
              <span className={`wedge ml-auto px-3 py-1 text-xs font-semibold uppercase ${riskStyle(p.risk)}`}>
                {p.risk} risk
              </span>
            </div>
            <p className="font-display mt-4 text-lg leading-tight tracking-tight">{p.title}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground text-xs uppercase">{p.costLabel}</dt>
                <dd className="font-display text-base">{p.cost}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <dt className="text-muted-foreground text-xs uppercase">Runway</dt>
                <dd className="font-display text-base">{p.runway}</dd>
              </div>
            </dl>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              {p.recommendation}
            </p>
          </div>
        ))}
      </div>

      <div className="border-ink/10 mt-6 flex flex-wrap items-center gap-4 border-t pt-5">
        <p className="text-muted-foreground text-xs">
          Simulated insights only — not financial advice. Your own numbers will differ.
        </p>
        <Link
          to="/simulate"
          className="wedge bg-volt text-ink ml-auto px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
        >
          Run mine →
        </Link>
      </div>
    </div>
  );
}
