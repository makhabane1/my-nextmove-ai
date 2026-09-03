import { applyLevers, zar, type Levers, type Scenario } from "../../lib/nextmove-schema";

export function CompareFutures({
  scenarios,
  levers,
  activeId,
  onSelect,
}: {
  scenarios: Scenario[];
  levers: Levers;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div id="compare">
      <div className="mb-6 flex items-center gap-3">
        <span className="font-display text-volt text-3xl">05</span>
        <h2 className="font-display text-3xl tracking-tight uppercase">Compare your futures</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {scenarios.map((s) => {
          const m = applyLevers(s, levers);
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`bg-surface relative flex flex-col p-5 text-left transition-transform hover:-translate-y-0.5 ${
                active ? "border-volt border-2" : "border-line border"
              }`}
            >
              {active && (
                <span className="wedge bg-volt text-ink absolute -top-3 right-4 px-3 py-1 text-[10px] font-bold tracking-wide uppercase">
                  Your focus
                </span>
              )}
              <span
                className={`font-display text-sm ${s.stance === "High risk" ? "text-flame" : "text-volt"}`}
              >
                {s.letter}
              </span>
              <p className="mt-2 leading-tight font-semibold">{s.title}</p>
              <p className="text-mist mt-1 text-xs">{s.subtitle}</p>
              <div className="my-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-mist">Monthly net</span>
                  <span className="font-semibold">{zar(m.surplus)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Income</span>
                  <span className="font-semibold">{zar(m.income)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Expenses</span>
                  <span className="font-semibold">{zar(m.expenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Upfront</span>
                  <span className="font-semibold">{zar(m.upfrontCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Runway</span>
                  <span className="font-semibold">{m.runwayMonths.toFixed(1)} mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Survival</span>
                  <span className="font-semibold">{m.survivalScore}</span>
                </div>
              </div>
              <div className="border-line mt-auto flex items-center justify-between border-t pt-3">
                <span className="font-display text-2xl">{m.lifeDecisionScore}</span>
                <span className="text-mist text-[10px] tracking-widest uppercase">Life score</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-line bg-surface mt-4 overflow-x-auto border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-line text-mist border-b text-left text-[10px] tracking-widest uppercase">
              <th className="px-4 py-3 font-semibold">Trade-off</th>
              {scenarios.map((s) => (
                <th key={s.id} className="px-4 py-3 text-right font-semibold">
                  {s.letter} · {s.city}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                label: "Monthly surplus",
                get: (s: Scenario) => zar(applyLevers(s, levers).surplus),
              },
              {
                label: "Financial runway",
                get: (s: Scenario) => `${applyLevers(s, levers).runwayMonths.toFixed(1)} mo`,
              },
              { label: "Savings required", get: (s: Scenario) => zar(s.savingsRequired) },
              { label: "Top risk", get: (s: Scenario) => s.risks[0] ?? "—" },
              { label: "Long-term", get: (s: Scenario) => s.longTermPotential },
              { label: "Confidence", get: (s: Scenario) => s.confidence },
            ].map((row) => (
              <tr key={row.label} className="border-line border-t">
                <td className="text-mist px-4 py-3">{row.label}</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="max-w-[16rem] px-4 py-3 text-right font-medium">
                    {row.get(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
