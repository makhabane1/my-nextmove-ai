import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import {
  interviewStepSchema,
  simulationSchema,
  type InterviewStep,
  type Simulation,
} from "./nextmove-schema";

const qaSchema = z.object({ question: z.string(), answer: z.string() });

const interviewInput = z.object({
  problem: z.string().min(3).max(2000),
  answers: z.array(qaSchema).max(12),
});

const transcript = (problem: string, answers: { question: string; answer: string }[]) =>
  [
    `The person's situation, in their own words: "${problem}"`,
    ...answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`),
  ].join("\n\n");

async function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this project.");
  const { createLovableAiGatewayProvider, NEXTMOVE_MODEL, SA_CONTEXT } = await import(
    "./ai-gateway.server"
  );
  return { provider: createLovableAiGatewayProvider(key), model: NEXTMOVE_MODEL, SA_CONTEXT };
}

/** Ask the single most useful next question, or declare we know enough. */
export const nextInterviewStep = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => interviewInput.parse(input))
  .handler(async ({ data }): Promise<InterviewStep> => {
    const { provider, model, SA_CONTEXT } = await gateway();

    const run = () =>
      generateText({
        model: provider(model),
        temperature: 0.4,
        output: Output.object({ schema: interviewStepSchema }),
        system: `${SA_CONTEXT}

You are in the "Understand my situation" stage. Ask ONE short question at a time — never a form.
Only ask what you genuinely need to simulate this specific decision: income, savings, monthly expenses,
current city and target city, career/education stage, dependants or family support, debt, timeline, goals, lifestyle.
Never ask something already answered or clearly implied.
You MUST ask at least 3 questions before simulating, and at most 6; after 6 answers set readyToSimulate true.
"understanding" is ONE warm sentence of at most 25 words, no questions in it. Never repeat instructions back.
"question" is at most 20 words. "helper" is at most 15 words.
Give 2-4 short realistic South African example answers in "suggestions" (e.g. "R12 000", "About R25 000 saved", "Cape Town").
Only when you have enough to simulate: readyToSimulate true and question null.`,
        prompt: `${transcript(data.problem, data.answers)}

Answers collected so far: ${data.answers.length}. Decide the next single question, or that you are ready to simulate.`,
      });

    try {
      const { output } = await run();
      return output;
    } catch {
      try {
        const { output } = await run();
        return output;
      } catch {
        // Never blank the screen: fall back to a sensible next question.
        const asked = data.answers.length;
        return {
          understanding: "Thanks — a few basics will help us simulate this properly.",
          readyToSimulate: asked >= 4,
          question:
            asked >= 4
              ? null
              : {
                  id: `fallback-${asked}`,
                  question: [
                    "Which city are you in, and where are you thinking of going?",
                    "What money comes in each month right now?",
                    "How much do you have saved up?",
                    "Who depends on you financially, and do you have any debt?",
                  ][asked]!,
                  helper: "A rough figure or answer is fine.",
                  kind: "text" as const,
                  suggestions: [],
                },
        };
      }
    }
  });


/** Build the personalised simulation, comparison numbers and NextMove plan. */
export const runSimulation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => interviewInput.parse(input))
  .handler(async ({ data }): Promise<Simulation> => {
    const { provider, model, SA_CONTEXT } = await gateway();

    const { output } = await generateText({
      model: provider(model),
      output: Output.object({ schema: simulationSchema }),
      system: `${SA_CONTEXT}

Produce exactly 3 realistic scenarios for this person's decision: one cautious/prepare-first path,
one balanced path, and one bolder/higher-variance path. Letters must be "A", "B", "C".
All money fields are monthly ZAR amounts except upfrontCost and savingsRequired (once-off ZAR totals).
- estimatedIncome: realistic take-home for the SA market, role and city.
- monthlyExpenses: full realistic total INCLUDING rent, transport, food, data, utilities, medical, debt.
- rent: the accommodation portion of monthlyExpenses (0 if living at home).
- runwayMonths: how many months they could survive if income stopped, given their savings.
- survivalScore (0-100): can they physically afford it month to month.
- lifeDecisionScore (0-100): how much this path moves their life forward, net of risk.
- confidence: how sure you are given how little you know.
"hardTruths" must honestly challenge unrealistic assumptions in their plan.
"uncertaintyNote" must say plainly that these are estimates, not guarantees.
"plan" is 4-6 concrete, sequenced, affordable preparation steps with real ZAR targets and SA-specific actions.
Never tell them which path to take.`,
      prompt: transcript(data.problem, data.answers),
    });

    const letters = ["A", "B", "C"];
    return {
      ...output,
      scenarios: output.scenarios.slice(0, 3).map((s, i) => ({
        ...s,
        id: `scenario-${i + 1}`,
        letter: letters[i] ?? String(i + 1),
      })),
    };
  });
