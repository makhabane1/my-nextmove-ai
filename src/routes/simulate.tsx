import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { CitySelect } from "../components/city-select";
import { CompareFutures } from "../components/simulator/compare-futures";
import { ScenarioPanel } from "../components/simulator/scenario-panel";
import { ResultsDisclaimer } from "../components/simulator/results-disclaimer";
import { StepTracker } from "../components/simulator/step-tracker";
import { nextInterviewStep, runSimulation } from "../lib/nextmove.functions";
import { cityContextLine } from "../lib/sa-cities";
import {
  defaultLevers,
  type FollowUp,
  type Levers,
  type QA,
  type Simulation,
} from "../lib/nextmove-schema";

export const Route = createFileRoute("/simulate")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined; city?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    city: typeof search["city"] === "string" ? search["city"] : undefined,
  }),

  head: () => ({
    meta: [
      { title: "Simulate your next move — My NextMove AI" },
      {
        name: "description",
        content:
          "Describe your decision, answer a few smart questions, and see realistic South African scenarios with costs, risks, runway and a step-by-step plan.",
      },
      { property: "og:title", content: "Simulate your next move — My NextMove AI" },
      {
        property: "og:description",
        content:
          "Realistic ZAR scenarios, survival scores and a practical plan for your next big life decision.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SimulatePage,
});

function SimulatePage() {
  const { q = "" } = Route.useSearch();

  const [problem, setProblem] = useState(q);
  const [started, setStarted] = useState(Boolean(q));
  const [answers, setAnswers] = useState<QA[]>([]);
  const [question, setQuestion] = useState<FollowUp | null>(null);
  const [understanding, setUnderstanding] = useState("");
  const [draft, setDraft] = useState("");
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [activeId, setActiveId] = useState("");
  const [levers, setLevers] = useState<Levers>(defaultLevers);

  const askFn = useServerFn(nextInterviewStep);
  const simFn = useServerFn(runSimulation);

  const ask = useMutation({
    mutationFn: (vars: { problem: string; answers: QA[] }) => askFn({ data: vars }),
    onSuccess: (step, vars) => {
      setUnderstanding(step.understanding);
      if (step.readyToSimulate || !step.question) {
        setQuestion(null);
        sim.mutate(vars);
      } else {
        setQuestion(step.question);
      }
    },
  });

  const sim = useMutation({
    mutationFn: (vars: { problem: string; answers: QA[] }) => simFn({ data: vars }),
    onSuccess: (result) => {
      setSimulation(result);
      setActiveId(result.scenarios[0]?.id ?? "");
      setLevers(defaultLevers);
    },
  });

  useEffect(() => {
    if (q && !ask.isPending && !question && answers.length === 0 && !simulation && !sim.isPending) {
      ask.mutate({ problem: q, answers: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const begin = () => {
    const value = problem.trim();
    if (!value) return;
    setStarted(true);
    setAnswers([]);
    setSimulation(null);
    ask.mutate({ problem: value, answers: [] });
  };

  const submitAnswer = (value: string) => {
    if (!question || !value.trim()) return;
    const next = [...answers, { question: question.question, answer: value.trim() }];
    setAnswers(next);
    setQuestion(null);
    setDraft("");
    ask.mutate({ problem: problem.trim(), answers: next });
  };

  const busy = ask.isPending || sim.isPending;
  const error = ask.error ?? sim.error;
  const active = simulation?.scenarios.find((s) => s.id === activeId) ?? simulation?.scenarios[0];

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />

      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-10">
          <span className="wedge bg-ink text-inverse-foreground inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            Step {simulation ? "04" : question ? "02" : "01"}
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight uppercase sm:text-6xl">
            {simulation ? (
              <>
                Your possible <span className="text-flame">futures</span>
              </>
            ) : (
              <>
                Tell us what you&apos;re <span className="text-flame">facing</span>
              </>
            )}
          </h1>

          {/* 1 — the story */}
          {!simulation && (
            <div className="border-ink/10 bg-surface mt-8 border p-6 sm:p-8">
              <label className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                Your situation, in your own words
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={4}
                placeholder="I want to move to Cape Town but I'm not sure I can afford it…"
                className="border-ink/15 focus:border-volt mt-3 w-full resize-none border bg-transparent p-4 text-lg outline-none"
              />
              <button
                onClick={begin}
                disabled={busy || !problem.trim()}
                className="wedge bg-volt text-ink mt-4 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {started ? "Restart with this" : "Start my simulation →"}
              </button>
            </div>
          )}

          {understanding && (
            <p className="border-volt bg-surface text-muted-foreground mt-6 border-l-4 p-4 text-sm">
              {understanding}
            </p>
          )}

          {/* 2 — the interview */}
          {question && (
            <div className="border-ink/10 bg-surface mt-6 border p-6 sm:p-8">
              <p className="font-display text-2xl tracking-tight">{question.question}</p>
              <p className="text-muted-foreground mt-2 text-sm">{question.helper}</p>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer(draft)}
                inputMode={question.kind === "number" ? "numeric" : "text"}
                placeholder="Type your answer"
                className="border-ink/15 focus:border-volt mt-5 w-full border bg-transparent p-4 text-lg outline-none"
              />
              {question.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {question.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => submitAnswer(s)}
                      className="border-ink/15 hover:border-volt border px-3 py-1.5 text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={() => submitAnswer(draft)}
                disabled={!draft.trim()}
                className="wedge bg-ink text-inverse-foreground mt-4 px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                Next →
              </button>
              <p className="text-muted-foreground mt-4 text-xs">
                {answers.length} of about 6 questions answered
              </p>
            </div>
          )}

          {busy && (
            <p className="text-muted-foreground animate-pulse mt-6 text-sm">
              {sim.isPending ? "Simulating your paths in ZAR…" : "Thinking about your situation…"}
            </p>
          )}

          {error && (
            <p className="border-flame text-flame mt-6 border-l-4 p-4 text-sm">
              Something went wrong: {error.message}
            </p>
          )}

          {/* 3/4 — results */}
          {simulation && active && (
            <div className="mt-10 space-y-12">
              <section className="border-ink/10 bg-surface border p-6 sm:p-8">
                <p className="text-lg">{simulation.situationSummary}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="font-display text-sm tracking-[0.15em] uppercase">
                      What we assumed
                    </h3>
                    <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                      {simulation.assumptions.map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-display text-flame text-sm tracking-[0.15em] uppercase">
                      Hard truths
                    </h3>
                    <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                      {simulation.hardTruths.map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-muted-foreground border-ink/10 mt-6 border-t pt-4 text-xs">
                  {simulation.uncertaintyNote}
                </p>
              </section>

              <div className="flex flex-wrap gap-2">
                {simulation.scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    className={`wedge px-5 py-2.5 text-sm font-semibold transition-colors ${
                      s.id === active.id
                        ? "bg-ink text-inverse-foreground"
                        : "border-ink/15 border"
                    }`}
                  >
                    {s.letter} · {s.title}
                  </button>
                ))}
              </div>

              <ScenarioPanel scenario={active} levers={levers} onLevers={setLevers} />

              <CompareFutures
                scenarios={simulation.scenarios}
                levers={levers}
                activeId={active.id}
                onSelect={setActiveId}
              />

              <section id="plan">
                <div className="mb-6 flex items-center gap-3">
                  <span className="font-display text-volt text-3xl">06</span>
                  <h2 className="font-display text-3xl tracking-tight uppercase">
                    Your NextMove plan
                  </h2>
                </div>
                <ol className="space-y-4">
                  {simulation.plan.map((step, i) => (
                    <li key={step.title} className="border-ink/10 bg-surface flex gap-4 border p-5">
                      <span className="wedge bg-volt text-ink font-display grid size-9 shrink-0 place-items-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display text-lg tracking-tight">{step.title}</p>
                        <p className="text-muted-foreground mt-1 text-sm">{step.detail}</p>
                        <p className="text-flame mt-2 text-xs font-semibold tracking-[0.15em] uppercase">
                          {step.timeframe}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="text-muted-foreground mt-6 text-sm">
                  These are simulated estimates, not guarantees. The decision is yours.
                </p>
              </section>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
