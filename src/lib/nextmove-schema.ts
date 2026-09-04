import { z } from "zod";

/** Client-safe schemas + types shared by the UI and the server functions. */

const str = (fallback = "") => z.string().nullish().transform((v) => v ?? fallback);
const num = (fallback = 0) =>
  z.coerce.number().nullish().transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : fallback));
const list = (max: number) =>
  z
    .array(z.string())
    .nullish()
    .transform((v) => (v ?? []).slice(0, max));

export const followUpSchema = z.object({
  id: str("q"),
  question: z.string().min(1),
  helper: str(),
  kind: z.enum(["number", "text", "choice"]).nullish().transform((v) => v ?? "text"),
  suggestions: list(6),
});

export const interviewStepSchema = z
  .object({
    readyToSimulate: z.boolean().nullish(),
    understanding: str(),
    question: followUpSchema.nullish(),
  })
  .transform((s) => ({
    understanding: s.understanding,
    question: s.question ?? null,
    readyToSimulate: s.readyToSimulate ?? !s.question,
  }));

export const scenarioSchema = z.object({
  id: str("s"),
  letter: str("A"),
  title: str("Option"),
  subtitle: str(),
  city: str(),
  stance: z.enum(["Safe", "Balanced", "High risk"]).nullish().transform((v) => v ?? "Balanced"),
  estimatedIncome: num(),
  monthlyExpenses: num(),
  rent: num(),
  upfrontCost: num(),
  savingsRequired: num(),
  runwayMonths: num(),
  survivalScore: num(50),
  lifeDecisionScore: num(50),
  confidence: z.enum(["low", "medium", "high"]).nullish().transform((v) => v ?? "medium"),
  risks: list(5),
  challenges: list(5),
  opportunities: list(5),
  shortTermImpact: str(),
  longTermPotential: str(),
});

export const simulationSchema = z.object({
  situationSummary: str(),
  assumptions: list(6),
  hardTruths: list(4),
  uncertaintyNote: str(
    "These are estimates based on what you told us, not guarantees. Real costs and income can differ.",
  ),
  scenarios: z.array(scenarioSchema).min(1),
  plan: z
    .array(
      z.object({
        title: str("Step"),
        detail: str(),
        timeframe: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 6)),
});


export type FollowUp = z.infer<typeof followUpSchema>;
export type InterviewStep = z.infer<typeof interviewStepSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Simulation = z.infer<typeof simulationSchema>;

export type QA = { question: string; answer: string };

/** Live "What if?" levers applied on top of the AI's baseline numbers. */
export type Levers = {
  incomePct: number;
  rentPct: number;
  lifestylePct: number;
  savingsBuffer: number;
};

export const defaultLevers: Levers = {
  incomePct: 100,
  rentPct: 100,
  lifestylePct: 100,
  savingsBuffer: 0,
};

export const zar = (n: number) =>
  "R" + Math.round(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 });

const clampScore = (n: number) => Math.max(1, Math.min(99, Math.round(n)));

/** Deterministic recompute so sliders feel instant and stay honest. */
export function applyLevers(s: Scenario, l: Levers) {
  const income = s.estimatedIncome * (l.incomePct / 100);
  const rent = s.rent * (l.rentPct / 100);
  const other = Math.max(0, s.monthlyExpenses - s.rent) * (l.lifestylePct / 100);
  const expenses = rent + other;
  const surplus = income - expenses;
  const reserve = Math.max(0, s.savingsRequired + l.savingsBuffer - s.upfrontCost);
  const burn = Math.max(1, expenses - Math.max(0, income));
  const runway =
    surplus >= 0
      ? s.runwayMonths * (1 + Math.min(1.5, surplus / Math.max(1, expenses)))
      : reserve / burn;

  const baseSurplus = s.estimatedIncome - s.monthlyExpenses;
  const delta = surplus - baseSurplus;
  const shift = (delta / Math.max(1, s.monthlyExpenses)) * 26;
  const bufferShift = (l.savingsBuffer / Math.max(1000, s.upfrontCost || 20000)) * 8;

  return {
    income,
    expenses,
    rent,
    surplus,
    runwayMonths: Math.max(0, Math.min(60, runway)),
    survivalScore: clampScore(s.survivalScore + shift + bufferShift),
    lifeDecisionScore: clampScore(s.lifeDecisionScore + shift * 0.6 + bufferShift * 0.5),
    upfrontCost: s.upfrontCost,
    savingsRequired: Math.max(0, s.savingsRequired + l.savingsBuffer),
  };
}
