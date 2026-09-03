import { z } from "zod";

/** Client-safe schemas + types shared by the UI and the server functions. */

export const followUpSchema = z.object({
  id: z.string(),
  question: z.string(),
  helper: z.string(),
  kind: z.enum(["number", "text", "choice"]),
  suggestions: z.array(z.string()).max(6),
});

export const interviewStepSchema = z.object({
  readyToSimulate: z.boolean(),
  understanding: z.string(),
  question: followUpSchema.nullable(),
});

export const scenarioSchema = z.object({
  id: z.string(),
  letter: z.string(),
  title: z.string(),
  subtitle: z.string(),
  city: z.string(),
  stance: z.enum(["Safe", "Balanced", "High risk"]),
  estimatedIncome: z.number(),
  monthlyExpenses: z.number(),
  rent: z.number(),
  upfrontCost: z.number(),
  savingsRequired: z.number(),
  runwayMonths: z.number(),
  survivalScore: z.number(),
  lifeDecisionScore: z.number(),
  confidence: z.enum(["low", "medium", "high"]),
  risks: z.array(z.string()).max(5),
  challenges: z.array(z.string()).max(5),
  opportunities: z.array(z.string()).max(5),
  shortTermImpact: z.string(),
  longTermPotential: z.string(),
});

export const simulationSchema = z.object({
  situationSummary: z.string(),
  assumptions: z.array(z.string()).max(6),
  hardTruths: z.array(z.string()).max(4),
  uncertaintyNote: z.string(),
  scenarios: z.array(scenarioSchema).min(2).max(3),
  plan: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string(),
        timeframe: z.string(),
      }),
    )
    .max(6),
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
