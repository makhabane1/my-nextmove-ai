import { z } from "zod";

/** Client-safe schemas for mentor matching and the opportunity scanner. */

const str = (fallback = "") =>
  z
    .string()
    .nullish()
    .transform((v) => v ?? fallback);
const num = (fallback = 0) =>
  z.coerce
    .number()
    .nullish()
    .transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : fallback));
const list = (max: number) =>
  z
    .array(z.string())
    .nullish()
    .transform((v) => (v ?? []).slice(0, max));

/* ---------- Mentor matching ---------- */

export const mentorMatchSchema = z.object({
  summary: str("Here are the mentors closest to what you described."),
  matches: z
    .array(
      z.object({
        mentorId: str(),
        matchScore: num(70),
        why: list(4),
        watchOut: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 4)),
});

export type MentorMatchResult = z.infer<typeof mentorMatchSchema>;

/* ---------- Opportunity scanner ---------- */

const scoreBlock = {
  title: str("Opportunity"),
  matchScore: num(70),
  why: list(4),
  challenges: list(3),
};

export const opportunityScanSchema = z.object({
  summary: str(),
  careers: z
    .array(
      z.object({
        ...scoreBlock,
        averageSalary: str(),
        requiredSkills: list(6),
        learningPath: str(),
        difficulty: z
          .enum(["Entry", "Moderate", "Demanding"])
          .nullish()
          .transform((v) => v ?? "Moderate"),
        growth: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 4)),
  education: z
    .array(
      z.object({
        ...scoreBlock,
        kind: str("Course"),
        provider: str(),
        cost: str(),
        duration: str(),
        outcome: str(),
        funding: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 4)),
  businesses: z
    .array(
      z.object({
        ...scoreBlock,
        startupCost: str(),
        monthlyPotential: str(),
        demand: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 4)),
  jobs: z
    .array(
      z.object({
        ...scoreBlock,
        role: str(),
        companies: list(4),
        requiredSkills: list(6),
        salaryRange: str(),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 4)),
  plan90: z
    .array(
      z.object({
        month: str("Month 1"),
        focus: str(),
        actions: list(4),
      }),
    )
    .nullish()
    .transform((v) => (v ?? []).slice(0, 3)),
  uncertaintyNote: str(
    "These matches are simulated estimates based on what you told us, not job offers or guarantees.",
  ),
});

export type OpportunityScan = z.infer<typeof opportunityScanSchema>;

export type ScanInput = {
  goal: string;
  skills: string;
  education: string;
  city: string;
  desiredIncome: string;
  interests: string;
  timeAvailable: string;
  budget: string;
};

export const emptyScanInput: ScanInput = {
  goal: "",
  skills: "",
  education: "",
  city: "",
  desiredIncome: "",
  interests: "",
  timeAvailable: "",
  budget: "",
};
