import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

import { mentorDirectoryForAi } from "./mentors";
import {
  mentorMatchSchema,
  opportunityScanSchema,
  type MentorMatchResult,
  type OpportunityScan,
} from "./marketplace-schema";

async function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this project.");
  const { createLovableAiGatewayProvider, NEXTMOVE_MODEL, SA_CONTEXT } = await import(
    "./ai-gateway.server"
  );
  return { provider: createLovableAiGatewayProvider(key), model: NEXTMOVE_MODEL, SA_CONTEXT };
}

const matchInput = z.object({
  goal: z.string().min(3).max(1000),
  city: z.string().max(120).optional().default(""),
  budget: z.string().max(120).optional().default(""),
  challenge: z.string().max(1000).optional().default(""),
  level: z.string().max(120).optional().default(""),
});

/** Recommend 3 mentors from the directory for this person's goal. */
export const matchMentors = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => matchInput.parse(input))
  .handler(async ({ data }): Promise<MentorMatchResult> => {
    const { provider, model, SA_CONTEXT } = await gateway();

    const { output } = await generateText({
      model: provider(model),
      temperature: 0.3,
      output: Output.object({ schema: mentorMatchSchema }),
      system: `${SA_CONTEXT}

You are matching a young South African to mentors from a FIXED directory.
Only ever return mentorId values copied exactly from the directory. Never invent a mentor.
Return exactly 3 matches, best first. matchScore is 0-100 and must reflect real fit: expertise,
city or relocation target, price against their stated budget, and their current level.
"why" is 2-3 very short reasons (max 12 words each). "watchOut" is one honest caveat, max 20 words.
"summary" is one warm sentence, max 25 words.`,
      prompt: `Directory:
${mentorDirectoryForAi()}

Goal: ${data.goal}
City / target city: ${data.city || "not given"}
Budget per session: ${data.budget || "not given"}
Biggest challenge: ${data.challenge || "not given"}
Experience level: ${data.level || "not given"}`,
    });

    return output;
  });

const scanInput = z.object({
  goal: z.string().min(3).max(1000),
  skills: z.string().max(1000).optional().default(""),
  education: z.string().max(200).optional().default(""),
  city: z.string().max(120).optional().default(""),
  desiredIncome: z.string().max(120).optional().default(""),
  interests: z.string().max(1000).optional().default(""),
  timeAvailable: z.string().max(200).optional().default(""),
  budget: z.string().max(200).optional().default(""),
});

/** Scan careers, education, business and job opportunities plus a 90-day plan. */
export const scanOpportunities = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => scanInput.parse(input))
  .handler(async ({ data }): Promise<OpportunityScan> => {
    const { provider, model, SA_CONTEXT } = await gateway();

    const { output } = await generateText({
      model: provider(model),
      output: Output.object({ schema: opportunityScanSchema }),
      system: `${SA_CONTEXT}

You are the Opportunity Scanner. From this person's profile, surface realistic South African opportunities.
Return 3 careers, 3 education options, 3 business or side-hustle ideas and 3 job matches.
Every item needs a matchScore (0-100), 2-3 short "why" reasons and 1-2 honest "challenges".
All money in ZAR, written plainly (e.g. "R18 000 - R28 000 a month", "About R4 500 once-off").
Education options must be real SA-style routes: universities, TVET colleges, SETA learnerships,
online certificates, bootcamps, bursaries and NSFAS where relevant, with cost and duration.
Businesses must fit their stated capital and time. Jobs must name plausible SA employer types.
"plan90" is exactly 3 months, each with a focus line and 2-3 concrete affordable actions.
Never promise a job or an income. Never tell them what to choose.`,
      prompt: `Career goal: ${data.goal}
Skills: ${data.skills || "not given"}
Education level: ${data.education || "not given"}
Location: ${data.city || "not given"}
Desired income: ${data.desiredIncome || "not given"}
Interests: ${data.interests || "not given"}
Time available each week: ${data.timeAvailable || "not given"}
Budget to invest: ${data.budget || "not given"}`,
    });

    return output;
  });
