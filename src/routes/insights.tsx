import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { zar } from "../lib/nextmove-schema";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "South African cost-of-living insights — My NextMove AI" },
      {
        name: "description",
        content:
          "Typical rent, transport, food and starting salaries across Johannesburg, Cape Town, Durban and Pretoria — the local reality behind every simulation.",
      },
      { property: "og:title", content: "South African cost-of-living insights" },
      {
        property: "og:description",
        content:
          "Rent, transport, food and salary ranges across SA cities, used to ground your NextMove simulations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InsightsPage,
});

const cities = [
  { city: "Cape Town", rent: 9500, transport: 1600, food: 3500, salary: "R18k – R32k" },
  { city: "Johannesburg", rent: 8000, transport: 2000, food: 3300, salary: "R20k – R38k" },
  { city: "Pretoria", rent: 7000, transport: 1700, food: 3100, salary: "R18k – R30k" },
  { city: "Durban", rent: 6500, transport: 1500, food: 3000, salary: "R16k – R27k" },
  { city: "Bloemfontein", rent: 5500, transport: 1300, food: 2800, salary: "R14k – R24k" },
];

const notes = [
  {
    title: "Studying",
    body: "University fees commonly run R45 000 – R80 000 a year, plus R30 000 – R60 000 for res and food. NSFAS and bursaries change the maths completely.",
  },
  {
    title: "Starting a business",
    body: "Most small SA businesses need 6 – 9 months of personal runway before drawing a salary. Registration is cheap; customers take time.",
  },
  {
    title: "Transport",
    body: "Taxi and bus commuting is often R1 200 – R2 000 a month. Owning a car adds instalments, insurance, fuel and parking — usually R5 000+.",
  },
  {
    title: "The uncomfortable part",
    body: "Load-shedding, medical cover, black tax and family support are real line items. We include them rather than pretend they don't exist.",
  },
];

function InsightsPage() {
  return (
    <div className="font-body min-h-screen">
      <SiteHeader />

      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-10">
          <span className="wedge bg-volt text-ink inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            SA Insights
          </span>
          <h1 className="font-display mt-5 max-w-[20ch] text-4xl leading-[0.95] tracking-tight uppercase sm:text-6xl">
            The local <span className="text-flame">reality</span> behind every simulation
          </h1>
          <p className="text-muted-foreground mt-5 max-w-[60ch]">
            Typical monthly figures for a young person living alone in a modest one-bedroom or
            shared place. Ranges, not promises — your simulation adjusts these to your situation.
          </p>

          <div className="border-ink/10 bg-surface mt-10 overflow-x-auto border">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-ink text-inverse-foreground font-display text-xs tracking-[0.15em] uppercase">
                <tr>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Rent</th>
                  <th className="px-5 py-3">Transport</th>
                  <th className="px-5 py-3">Food</th>
                  <th className="px-5 py-3">Entry salary</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((c) => (
                  <tr key={c.city} className="border-ink/10 border-t">
                    <td className="font-display px-5 py-4 text-base tracking-tight">{c.city}</td>
                    <td className="px-5 py-4">{zar(c.rent)}</td>
                    <td className="px-5 py-4">{zar(c.transport)}</td>
                    <td className="px-5 py-4">{zar(c.food)}</td>
                    <td className="text-flame px-5 py-4 font-semibold">{c.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {notes.map((n) => (
              <div key={n.title} className="border-ink/10 bg-surface border p-6">
                <h2 className="font-display text-xl tracking-tight uppercase">{n.title}</h2>
                <p className="text-muted-foreground mt-2 text-sm">{n.body}</p>
              </div>
            ))}
          </div>

          <div className="border-ink/10 mt-12 border-t pt-8">
            <Link
              to="/simulate"
              className="wedge bg-volt text-ink inline-block px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              Simulate my own numbers →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
