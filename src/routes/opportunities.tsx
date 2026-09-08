import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { CitySelect } from "../components/city-select";
import { SiteFooter, SiteHeader } from "../components/site-header";
import { ResultsDisclaimer } from "../components/simulator/results-disclaimer";
import { scanOpportunities } from "../lib/marketplace.functions";
import { emptyScanInput, type ScanInput } from "../lib/marketplace-schema";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Scan Your Opportunities — My NextMove AI" },
      {
        name: "description",
        content:
          "Discover South African careers, jobs, courses, bursaries and business ideas that match your goals, skills, budget and city — plus a 90-day plan.",
      },
      { property: "og:title", content: "Scan Your Opportunities — My NextMove AI" },
      {
        property: "og:description",
        content:
          "AI-matched careers, education routes, side hustles and jobs for young South Africans, with honest challenges.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const [form, setForm] = useState<ScanInput>(emptyScanInput);
  const scanFn = useServerFn(scanOpportunities);
  const scan = useMutation({ mutationFn: (vars: ScanInput) => scanFn({ data: vars }) });
  const set = (k: keyof ScanInput) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const data = scan.data;

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />
      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-10">
          <span className="wedge bg-ink text-inverse-foreground inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            Opportunity scanner
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight uppercase sm:text-6xl">
            Scan your <span className="text-flame">opportunities</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Discover careers, jobs, courses, businesses and opportunities that match your future
            goals.
          </p>

          <section className="border-ink/10 bg-surface mt-10 border p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text
                className="sm:col-span-2"
                label="Career goal"
                value={form.goal}
                onChange={set("goal")}
                placeholder="I want a stable job in tech within a year"
              />
              <Text
                label="Your skills"
                value={form.skills}
                onChange={set("skills")}
                placeholder="Excel, customer service, basic coding"
              />
              <Text
                label="Education level"
                value={form.education}
                onChange={set("education")}
                placeholder="Matric / N4 / Diploma"
              />
              <CitySelect value={form.city} onChange={set("city")} label="Location" />
              <Text
                label="Desired income"
                value={form.desiredIncome}
                onChange={set("desiredIncome")}
                placeholder="R15 000 a month"
              />
              <Text
                label="Interests"
                value={form.interests}
                onChange={set("interests")}
                placeholder="Computers, teaching, cars"
              />
              <Text
                label="Time available each week"
                value={form.timeAvailable}
                onChange={set("timeAvailable")}
                placeholder="10 hours after work"
              />
              <Text
                label="Budget to invest"
                value={form.budget}
                onChange={set("budget")}
                placeholder="R2 000 once-off"
              />
            </div>
            <button
              onClick={() => form.goal.trim() && scan.mutate(form)}
              disabled={scan.isPending || !form.goal.trim()}
              className="wedge bg-volt text-ink mt-6 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {scan.isPending ? "Scanning…" : "Scan my opportunities →"}
            </button>
            {scan.error && (
              <p className="border-flame text-flame mt-5 border-l-4 p-4 text-sm">
                Something went wrong: {scan.error.message}
              </p>
            )}
          </section>

          {data && (
            <div className="mt-12 space-y-12">
              <ResultsDisclaimer />
              {data.summary && <p className="max-w-3xl text-lg">{data.summary}</p>}

              <Group title="Career opportunities">
                {data.careers.map((c) => (
                  <Card key={c.title} title={c.title} score={c.matchScore} why={c.why} challenges={c.challenges}>
                    <Row label="Average salary" value={c.averageSalary} />
                    <Row label="Difficulty" value={c.difficulty} />
                    <Row label="Growth" value={c.growth} />
                    <Row label="Learning path" value={c.learningPath} />
                    <Row label="Skills needed" value={c.requiredSkills.join(", ")} />
                  </Card>
                ))}
              </Group>

              <Group title="Education opportunities">
                {data.education.map((e) => (
                  <Card key={e.title} title={e.title} score={e.matchScore} why={e.why} challenges={e.challenges}>
                    <Row label="Type" value={e.kind} />
                    <Row label="Provider" value={e.provider} />
                    <Row label="Cost" value={e.cost} />
                    <Row label="Duration" value={e.duration} />
                    <Row label="Outcome" value={e.outcome} />
                    <Row label="Funding" value={e.funding} />
                  </Card>
                ))}
              </Group>

              <Group title="Business & side hustle ideas">
                {data.businesses.map((b) => (
                  <Card key={b.title} title={b.title} score={b.matchScore} why={b.why} challenges={b.challenges}>
                    <Row label="Startup cost" value={b.startupCost} />
                    <Row label="Monthly potential" value={b.monthlyPotential} />
                    <Row label="Demand" value={b.demand} />
                  </Card>
                ))}
              </Group>

              <Group title="Job matches">
                {data.jobs.map((j) => (
                  <Card key={j.title} title={j.title} score={j.matchScore} why={j.why} challenges={j.challenges}>
                    <Row label="Role" value={j.role} />
                    <Row label="Salary range" value={j.salaryRange} />
                    <Row label="Hiring" value={j.companies.join(", ")} />
                    <Row label="Skills needed" value={j.requiredSkills.join(", ")} />
                    <p className="text-muted-foreground mt-3 text-xs">
                      Application links arrive when job board partners are connected.
                    </p>
                  </Card>
                ))}
              </Group>

              {data.plan90.length > 0 && (
                <section>
                  <h2 className="font-display text-3xl tracking-tight uppercase">
                    Your next 90-day plan
                  </h2>
                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {data.plan90.map((m) => (
                      <div key={m.month} className="border-ink/10 bg-surface border p-5">
                        <p className="wedge bg-volt text-ink inline-block px-3 py-1 text-xs font-semibold uppercase">
                          {m.month}
                        </p>
                        <p className="font-display mt-3 text-lg leading-tight">{m.focus}</p>
                        <ul className="mt-3 space-y-1 text-sm">
                          {m.actions.map((a) => (
                            <li key={a} className="text-muted-foreground">
                              → {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-muted-foreground text-xs">{data.uncertaintyNote}</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
      />
    </label>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-3xl tracking-tight uppercase">{title}</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function Card({
  title,
  score,
  why,
  challenges,
  children,
}: {
  title: string;
  score: number;
  why: string[];
  challenges: string[];
  children: React.ReactNode;
}) {
  return (
    <article className="border-ink/10 bg-surface flex flex-col border p-5">
      <div className="flex items-start gap-3">
        <h3 className="font-display text-xl leading-tight tracking-tight">{title}</h3>
        <span className="wedge bg-volt text-ink font-display ml-auto shrink-0 px-3 py-1.5 text-sm">
          {Math.round(score)}%
        </span>
      </div>
      <dl className="mt-4 space-y-1.5 text-sm">{children}</dl>
      {why.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {why.map((w) => (
            <li key={w}>✓ {w}</li>
          ))}
        </ul>
      )}
      {challenges.length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {challenges.map((c) => (
            <li key={c} className="text-flame">
              ⚠ {c}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <dt className="text-muted-foreground shrink-0">{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
