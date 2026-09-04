import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { DATA_LAST_UPDATED } from "../lib/methodology";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "How we calculate this — My NextMove AI" },
      {
        name: "description",
        content:
          "Plain-language methodology: which South African cost and salary data grounds each simulation, what the AI estimates, how uncertainty is shown, and why this is decision support and not financial advice.",
      },
      { property: "og:title", content: "How we calculate this — My NextMove AI" },
      {
        property: "og:description",
        content:
          "What our simulations are grounded in, what is AI-estimated, and how we show uncertainty honestly.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MethodologyPage,
});

const SECTIONS = [
  {
    n: "01",
    title: "What the simulation is grounded in",
    body: [
      "Cost of living per South African city — rent for a room, bachelor flat or one-bedroom, transport (taxi, Gautrain, petrol), groceries, prepaid electricity, water, mobile data and medical cover.",
      "Entry-level and mid-level salary ranges by sector, for cities like Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth and Bloemfontein.",
      "University and TVET fee ranges, registration deposits, res versus private student accommodation, textbook and device costs, and NSFAS realities.",
      "Small-business startup costs: registration, stock, equipment, and how long local businesses typically take to reach break-even.",
      "Typical South African timelines — how long a graduate job hunt, a career switch, or a study application usually takes.",
    ],
  },
  {
    n: "02",
    title: "Real data versus AI estimate",
    body: [
      "Hard data point: costs and salary ranges pulled from South African market figures. These carry a green tag in the tooltip.",
      "AI-generated estimate: anything the model infers about your specific situation — your likely income in a new role, your once-off costs, your long-term upside, and your Life Decision Score. These carry an orange tag.",
      "Calculated: runway, surplus and the Survival Score are arithmetic on the numbers above. They are only as good as their inputs, which is why every input is labelled.",
      "Anything you tell us is used as given. We do not verify your income, savings or debt — if those are wrong, the whole result shifts.",
    ],
  },
  {
    n: "03",
    title: "How we handle uncertainty",
    body: [
      "Every path shows a confidence badge. High confidence means most of the calculation rests on real cost and salary data. Estimated means a mix. Rough estimate means the AI had to infer too much for the numbers to be precise.",
      "You get three deliberately different paths — a cautious one, a balanced one and a higher-risk one — instead of a single false answer.",
      "The What if? sliders exist so you can test the worst case yourself: drop your income, push up rent, cut your buffer, and watch the runway and scores react.",
      "We show the assumptions and the hard truths rather than hiding them behind a score. If a path only works because one thing goes right, we say so.",
    ],
  },
];

function MethodologyPage() {
  return (
    <div className="font-body min-h-screen">
      <SiteHeader />

      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[900px] px-5 py-12 sm:px-10">
          <span className="wedge bg-ink text-inverse-foreground inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            Transparency
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight uppercase sm:text-6xl">
            How we <span className="text-flame">calculate</span> this
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed">
            No black box. Here is exactly what every number in your simulation is built on, what is
            real data, what the AI worked out, and where we could be wrong.
          </p>
          <p className="text-muted-foreground border-line mt-6 inline-block border px-3 py-1.5 text-xs">
            Cost-of-living data last updated: <span className="font-semibold">{DATA_LAST_UPDATED}</span>
          </p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.n} className="border-ink/10 bg-surface border p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="font-display text-volt text-3xl">{s.n}</span>
                  <h2 className="font-display text-2xl tracking-tight uppercase">{s.title}</h2>
                </div>
                <ul className="mt-5 space-y-3">
                  {s.body.map((b) => (
                    <li key={b} className="text-muted-foreground flex gap-3 text-sm leading-relaxed">
                      <span className="bg-volt mt-2 size-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="border-flame bg-surface border-l-4 p-6 sm:p-8">
              <h2 className="font-display text-2xl tracking-tight uppercase">
                This is not financial advice
              </h2>
              <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                My NextMove AI is a decision-support tool. Every figure it shows is a simulated
                estimate, not a prediction, a promise or a quote. We are not financial advisers, and
                nothing here accounts for your full legal, tax or credit position. Use it to see the
                shape of your options, stress-test them, and prepare — then make the call yourself,
                and speak to a registered adviser before signing anything big.
              </p>
            </section>
          </div>

          <Link
            to="/simulate"
            className="wedge bg-volt text-ink mt-10 inline-block px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Simulate your next move →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
