import { zar, type Scenario } from "./nextmove-schema";

/** Client-safe transparency metadata: what we assume, where it comes from, how sure we are. */

export const DATA_LAST_UPDATED = "March 2026";

export type Basis = "data" | "estimate";

export type AssumptionNote = {
  assumption: string;
  basis: string;
  kind: Basis;
};

const cityOf = (s: Scenario) => s.city || "your chosen city";

const SA_DATA = "Based on 2025/2026 South African cost-of-living and rental market data.";
const SA_SALARY = "Based on 2025/2026 South African salary benchmarks by sector and experience level.";
const AI_FROM_YOU = "AI estimate built from what you told us plus standard South African cost ratios.";
const AI_MODEL = "AI-generated estimate — a judgement call, not a measured figure.";

export function metricNotes(s: Scenario): Record<string, AssumptionNote> {
  return {
    income: {
      assumption: `Estimated take-home income in ${cityOf(s)}: ${zar(s.estimatedIncome)}/month.`,
      basis: SA_SALARY,
      kind: "estimate",
    },
    expenses: {
      assumption: `Total monthly living costs in ${cityOf(s)}: ${zar(s.monthlyExpenses)} (rent, transport, food, data, utilities).`,
      basis: SA_DATA,
      kind: "data",
    },
    rent: {
      assumption: `Typical rent for your setup in ${cityOf(s)}: ${zar(s.rent)}/month.`,
      basis: SA_DATA,
      kind: "data",
    },
    upfrontCost: {
      assumption: `Once-off costs to start: ${zar(s.upfrontCost)} — deposit, moving, registration or setup.`,
      basis: AI_FROM_YOU,
      kind: "estimate",
    },
    savingsRequired: {
      assumption: `Savings buffer we'd want you to have first: ${zar(s.savingsRequired)}.`,
      basis: AI_FROM_YOU,
      kind: "estimate",
    },
    runwayMonths: {
      assumption: `Runway: ${s.runwayMonths.toFixed(1)} months — how long your savings cover the gap if income stops.`,
      basis: "Calculated: savings buffer divided by your monthly shortfall.",
      kind: "data",
    },
    survivalScore: {
      assumption: `Survival Score ${s.survivalScore}/99 — can you keep the lights on month to month?`,
      basis: "Calculated from surplus, runway and buffer, then adjusted live by your sliders.",
      kind: "data",
    },
    lifeDecisionScore: {
      assumption: `Life Decision Score ${s.lifeDecisionScore}/99 — money plus long-term upside, risk and timing.`,
      basis: AI_MODEL,
      kind: "estimate",
    },
    riskIndex: {
      assumption: "Risk index is the inverse of your Survival Score on a 1–10 scale.",
      basis: "Calculated from the Survival Score — no separate data source.",
      kind: "data",
    },
    risks: {
      assumption: "Risks are the things most likely to break this path for someone in your position.",
      basis: AI_MODEL,
      kind: "estimate",
    },
    timeframe: {
      assumption: "Timeframes use typical South African timelines for job hunts, study intakes and business break-even.",
      basis: "AI estimate anchored on common local timelines — yours can run faster or slower.",
      kind: "estimate",
    },
  };
}

export type ConfidenceBadge = {
  label: string;
  blurb: string;
  tone: "volt" | "neutral" | "flame";
};

export function confidenceBadge(s: Scenario): ConfidenceBadge {
  if (s.confidence === "high")
    return {
      label: "High confidence",
      blurb: "Mostly grounded in real South African cost and salary data.",
      tone: "volt",
    };
  if (s.confidence === "low")
    return {
      label: "Rough estimate",
      blurb: "Heavily AI-inferred — too many unknowns to be precise. Treat as a direction, not a number.",
      tone: "flame",
    };
  return {
    label: "Estimated",
    blurb: "A mix of real cost data and AI inference from what you told us.",
    tone: "neutral",
  };
}
