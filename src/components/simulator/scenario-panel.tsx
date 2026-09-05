import { Link } from "@tanstack/react-router";

import { applyLevers, zar, type Levers, type Scenario } from "../../lib/nextmove-schema";
import {
  DATA_LAST_UPDATED,
  confidenceBadge,
  metricNotes,
  type AssumptionNote,
} from "../../lib/methodology";
import { AssumptionTag } from "./assumption-tag";

function Bar({
  label,
  value,
  pct,
  tone,
  note,
}: {
  label: string;
  value: string;
  pct: number;
  tone: "volt" | "flame";
  note?: AssumptionNote;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-2 text-sm">
        <span className="text-muted-foreground inline-flex items-center gap-1.5">
          {label}
          {note && <AssumptionTag note={note} label={label} />}
        </span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="bg-line h-2">
        <div
          className={`bar-fill h-full ${tone === "volt" ? "bg-volt" : "bg-flame"}`}
          style={{ width: `${Math.max(3, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}

export function ScenarioPanel({
  scenario,
  levers,
  onLevers,
}: {
  scenario: Scenario;
  levers: Levers;
  onLevers: (l: Levers) => void;
}) {
  const m = applyLevers(scenario, levers);
  const riskIndex = Math.max(1, Math.round((100 - m.survivalScore) / 10) + 1) / 1;
  const notes = metricNotes(scenario);
  const badge = confidenceBadge(scenario);

  const sliders: { key: keyof Levers; label: string; min: number; max: number; step: number }[] = [
    { key: "incomePct", label: "Income", min: 50, max: 180, step: 5 },
    { key: "rentPct", label: "Rent", min: 40, max: 200, step: 5 },
    { key: "lifestylePct", label: "Lifestyle spend", min: 50, max: 160, step: 5 },
    { key: "savingsBuffer", label: "Extra savings", min: 0, max: 150000, step: 5000 },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span className="font-display text-volt text-3xl">03</span>
        <h2 className="font-display text-3xl tracking-tight uppercase">Simulate your options</h2>
      </div>

      <div className="wedge bg-surface border-line border p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Path {scenario.letter} · {scenario.subtitle}
            </p>
            <p className="font-display mt-1 text-2xl">
              {scenario.title} · {scenario.city}
            </p>
          </div>
          <span
            className={`wedge shrink-0 px-3 py-1 text-xs font-bold tracking-wide uppercase ${
              scenario.stance === "High risk"
                ? "bg-flame text-paper"
                : scenario.stance === "Safe"
                  ? "bg-volt text-ink"
                  : "border-line text-foreground border"
            }`}
          >
            {scenario.stance}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] tracking-widest uppercase">
          <span
            className={`px-2 py-1 font-bold ${
              badge.tone === "volt"
                ? "bg-volt text-ink"
                : badge.tone === "flame"
                  ? "bg-flame text-paper"
                  : "border-line text-foreground border"
            }`}
          >
            {badge.label}
          </span>
          <span className="text-muted-foreground normal-case tracking-normal">{badge.blurb}</span>
        </div>


        <div className="mt-6 space-y-5">
          <Bar
            label="Estimated income"
            value={`${zar(m.income)}/mo`}
            pct={(m.income / Math.max(m.income, m.expenses)) * 100}
            tone="volt"
            note={notes["income"]}
          />
          <Bar
            label="Monthly expenses"
            value={`${zar(m.expenses)}/mo`}
            pct={(m.expenses / Math.max(m.income, m.expenses)) * 100}
            tone="flame"
            note={notes["expenses"]}
          />
          <Bar
            label="Rent"
            value={`${zar(m.rent)}/mo`}
            pct={(m.rent / m.expenses) * 100}
            tone="volt"
            note={notes["rent"]}
          />
          <Bar
            label="Upfront costs"
            value={zar(m.upfrontCost)}
            pct={(m.upfrontCost / Math.max(1, m.savingsRequired || m.upfrontCost)) * 100}
            tone="flame"
            note={notes["upfrontCost"]}
          />
          <Bar
            label="Savings required"
            value={zar(m.savingsRequired)}
            pct={100}
            tone="volt"
            note={notes["savingsRequired"]}
          />
          <Bar
            label="Financial runway"
            value={`${m.runwayMonths.toFixed(1)} months`}
            pct={(m.runwayMonths / 18) * 100}
            tone={m.runwayMonths < 3 ? "flame" : "volt"}
            note={notes["runwayMonths"]}
          />
        </div>

        <div className="border-line mt-6 grid grid-cols-3 gap-3 border-t pt-4 text-center">
          <div>
            <p className="font-display text-volt text-2xl">{m.survivalScore}</p>
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[10px] tracking-widest uppercase">
              Survival {notes["survivalScore"] && <AssumptionTag note={notes["survivalScore"]} label="Survival Score" />}
            </p>
          </div>
          <div>
            <p className="font-display text-2xl">{m.lifeDecisionScore}</p>
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[10px] tracking-widest uppercase">
              Life decision{" "}
              {notes["lifeDecisionScore"] && (
                <AssumptionTag note={notes["lifeDecisionScore"]} label="Life Decision Score" />
              )}
            </p>
          </div>
          <div>
            <p className="font-display text-flame text-2xl">{riskIndex.toFixed(1)}</p>
            <p className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-[10px] tracking-widest uppercase">
              Risk idx {notes["riskIndex"] && <AssumptionTag note={notes["riskIndex"]} label="Risk index" />}
            </p>
          </div>
        </div>


        <div className="border-line mt-6 border-t pt-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
            What if? · move the variables
          </p>
          <div className="mt-4 space-y-4">
            {sliders.map((s) => (
              <label key={s.key} className="block">
                <span className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold">
                    {s.key === "savingsBuffer"
                      ? `+${zar(levers[s.key])}`
                      : `${levers[s.key]}%`}
                  </span>
                </span>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={levers[s.key]}
                  onChange={(e) => onLevers({ ...levers, [s.key]: Number(e.target.value) })}
                  className="accent-volt bg-line h-1.5 w-full appearance-none"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Risks", items: scenario.risks, tone: "text-flame" },
          { t: "Challenges", items: scenario.challenges, tone: "text-muted-foreground" },
          { t: "Opportunities", items: scenario.opportunities, tone: "text-volt" },
        ].map((g) => (
          <div key={g.t} className="border-line bg-surface border p-4">
            <p className={`text-[10px] font-bold tracking-widest uppercase ${g.tone}`}>{g.t}</p>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
              {g.items.map((i) => (
                <li key={i} className="text-muted-foreground">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-line bg-surface mt-4 grid gap-4 border p-4 sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Short-term impact
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{scenario.shortTermImpact}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
            Long-term potential
          </p>
          <p className="mt-1.5 text-sm leading-relaxed">{scenario.longTermPotential}</p>
        </div>
      </div>

      <p className="text-muted-foreground mt-4 max-w-md text-xs leading-relaxed">
        Estimated figures based on your inputs and South African cost data. Confidence:{" "}
        {scenario.confidence}. Not a guarantee — uncertainty is shown, never hidden.
      </p>
    </div>
  );
}
