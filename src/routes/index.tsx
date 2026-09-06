import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { CitySelect } from "../components/city-select";
import { SampleSimulation } from "../components/sample-simulation";
import { sampleFor } from "../lib/sample-simulations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My NextMove AI — Simulate your next life decision" },
      {
        name: "description",
        content:
          "Bring us your problem. Simulate your future. Make your next move. Honest, Rand-based life-decision simulations for young South Africans.",
      },
      { property: "og:title", content: "My NextMove AI — Simulate your next life decision" },
      {
        property: "og:description",
        content:
          "Describe your situation in your own words. See the costs, risks and runway of every path — the decision stays yours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STARTERS = [
  { key: "quit", label: "Quit my job" },
  { key: "career", label: "Change careers" },
  { key: "study", label: "Go study" },
];

function Home() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState("");
  const [city, setCity] = useState("");
  const [sampleKey, setSampleKey] = useState("quit");

  const showSample = (key: string) => {
    setSampleKey(key);
    document.getElementById("example")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const start = (text: string) => {
    const value = text.trim();
    if (!value) return;
    navigate({ to: "/simulate", search: { q: value, city: city || undefined } });
  };


  return (
    <div className="font-body min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="bg-canvas text-canvas-foreground relative overflow-hidden">
        <div className="animate-rise mx-auto max-w-[1440px] px-5 pt-14 pb-10 sm:px-10">
          <div className="wedge bg-volt text-ink inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            <span className="bg-ink size-2 rounded-full" /> South Africa · first
          </div>
          <h1 className="font-display mt-6 max-w-[16ch] text-[15vw] leading-[0.86] tracking-tight uppercase sm:text-[11vw] lg:text-[9.5vw]">
            Bring us your <span className="text-flame">problem.</span> Simulate your{" "}
            <span className="decoration-volt underline decoration-[10px] underline-offset-[6px]">
              future.
            </span>
          </h1>
          <p className="text-mist mt-7 max-w-xl text-lg font-medium">
            My NextMove turns real life decisions into honest simulations. Describe your situation,
            move the variables, and see the trade-offs before you commit. The decision stays yours.
          </p>

          {/* CONVERSATION INPUT */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              start(problem);
            }}
            className="wedge border-canvas-foreground bg-card text-card-foreground mt-9 max-w-2xl border-2"
          >
            <div className="flex items-center gap-3 px-5 py-4">
              <span className="bg-inverse text-volt font-display grid size-9 shrink-0 place-items-center text-sm">
                AI
              </span>
              <input
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                aria-label="Describe your situation"
                placeholder="I want to move to Cape Town but I'm not sure I can afford it…"
                className="placeholder:text-mist flex-1 bg-transparent text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Start simulation"
                className="hover:text-flame ml-auto shrink-0 transition-colors"
              >
                ↵
              </button>
            </div>
            <div className="border-canvas-foreground flex flex-wrap items-center gap-3 border-t-2 px-5 py-3">
              <span className="text-mist text-xs font-semibold tracking-widest uppercase">
                Try a real one
              </span>
              <span className="ml-auto flex flex-wrap gap-2">
                {STARTERS.slice(0, 3).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setProblem(`I want to ${s.toLowerCase()}`)}
                    className="border-canvas-foreground hover:bg-inverse hover:text-inverse-foreground border px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </span>
            </div>
          </form>

          <button
            type="button"
            onClick={() => start(problem || "I need help deciding on my next move")}
            className="font-display group mt-7 inline-flex items-center gap-3 text-xl tracking-tight uppercase"
          >
            <span className="wedge bg-inverse text-inverse-foreground group-hover:bg-volt group-hover:text-ink px-7 py-4 transition-colors">
              Tell us what you're facing
            </span>
            <span className="text-flame text-2xl">→</span>
          </button>
        </div>

        {/* MARQUEE */}
        <div className="wedge bg-inverse overflow-hidden py-4">
          <div className="animate-marquee text-volt font-display flex text-2xl whitespace-nowrap uppercase">
            {[0, 1].map((pass) => (
              <span key={pass} className="flex">
                {CITIES.map((c, i) => (
                  <span key={c} className={`px-6 ${i % 2 ? "text-mist" : ""}`}>
                    {c}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-inverse text-inverse-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-16 sm:px-10 lg:grid-cols-3">
          {[
            {
              n: "01",
              t: "Tell us your problem",
              d: "No dropdowns, no long forms. Type it like you'd tell a friend — in your own words.",
            },
            {
              n: "02",
              t: "Understand my situation",
              d: "The AI asks only what it needs: income, savings, city, dependants, debt, timeline.",
            },
            {
              n: "03",
              t: "Simulate & compare",
              d: "Three realistic paths with Rand costs, runway, risks and scores you can pull apart.",
            },
          ].map((s) => (
            <div key={s.n} className="border-line bg-inverse-foreground/5 text-inverse-foreground border p-6">
              <span className="font-display text-volt text-3xl">{s.n}</span>
              <h2 className="mt-3 text-xl tracking-tight uppercase">{s.t}</h2>
              <p className="text-mist mt-2 text-sm leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-10">
          <div className="wedge bg-inverse text-inverse-foreground flex flex-col justify-center p-9">
            <span className="font-display text-volt text-sm tracking-[0.2em] uppercase">
              Our philosophy
            </span>
            <p className="font-display mt-4 max-w-3xl text-3xl leading-[1.05] tracking-tight">
              Here are your possible paths, what they could cost, the risks involved — and what you
              can do to prepare.
            </p>
            <p className="text-volt font-display mt-3 text-3xl tracking-tight">
              The decision is yours.
            </p>
            <p className="text-mist mt-5 max-w-xl text-sm leading-relaxed">
              We're honest, we challenge assumptions, and we show uncertainty clearly. We never make
              life decisions for you, and we never present a prediction as a guarantee.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
