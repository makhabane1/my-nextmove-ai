import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { CitySelect } from "../components/city-select";
import { MentorCard } from "../components/mentors/mentor-card";
import { MENTORS, MENTOR_CATEGORIES, findMentor } from "../lib/mentors";
import { matchMentors } from "../lib/marketplace.functions";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Find Your NextMove Mentor — My NextMove AI" },
      {
        name: "description",
        content:
          "Get advice from South Africans who have already done what you are trying to do: career coaches, entrepreneurs, financial advisors, students and tech professionals.",
      },
      { property: "og:title", content: "Find Your NextMove Mentor — My NextMove AI" },
      {
        property: "og:description",
        content:
          "Browse verified South African mentors, let AI match you to the right three, and book a session.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [goal, setGoal] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [challenge, setChallenge] = useState("");
  const [level, setLevel] = useState("");

  const matchFn = useServerFn(matchMentors);
  const match = useMutation({
    mutationFn: (vars: {
      goal: string;
      city: string;
      budget: string;
      challenge: string;
      level: string;
    }) => matchFn({ data: vars }),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MENTORS.filter(
      (m) =>
        (category === "All" || m.category === category) &&
        (!q ||
          `${m.name} ${m.expertise} ${m.city} ${m.bio}`.toLowerCase().includes(q)),
    );
  }, [category, search]);

  const matches = (match.data?.matches ?? [])
    .map((m) => ({ ...m, mentor: findMentor(m.mentorId) }))
    .filter((m) => m.mentor);

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />

      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-10">
          <span className="wedge bg-ink text-inverse-foreground inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            Mentor marketplace
          </span>
          <h1 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight uppercase sm:text-6xl">
            Find your NextMove <span className="text-flame">mentor</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
            Get advice from people who have already achieved what you are trying to do.
          </p>

          {/* AI matching */}
          <section className="border-ink/10 bg-surface mt-10 border p-6 sm:p-8">
            <h2 className="font-display text-2xl tracking-tight uppercase">Let AI match you</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Tell us what you are trying to do and we will suggest three mentors from this
              directory.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 block">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                  Your goal
                </span>
                <input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="I want to move to Cape Town and start a tech career"
                  className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
                />
              </label>
              <CitySelect value={city} onChange={setCity} label="City (or where you're headed)" />
              <label className="block">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                  Budget per session
                </span>
                <input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Up to R400"
                  className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                  Biggest challenge
                </span>
                <input
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="No experience and no savings"
                  className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                  Experience level
                </span>
                <input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="Matric, no work experience"
                  className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
                />
              </label>
            </div>
            <button
              onClick={() => goal.trim() && match.mutate({ goal, city, budget, challenge, level })}
              disabled={match.isPending || !goal.trim()}
              className="wedge bg-volt text-ink mt-5 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {match.isPending ? "Matching…" : "Match me with mentors →"}
            </button>

            {match.error && (
              <p className="border-flame text-flame mt-5 border-l-4 p-4 text-sm">
                Something went wrong: {match.error.message}
              </p>
            )}

            {matches.length > 0 && (
              <div className="mt-8">
                <p className="text-sm">{match.data?.summary}</p>
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                  {matches.map((m) => (
                    <MentorCard
                      key={m.mentorId}
                      mentor={m.mentor!}
                      matchScore={m.matchScore}
                      why={m.why}
                      watchOut={m.watchOut}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 text-xs">
                  Matching is an AI suggestion, not a recommendation or a guarantee of results.
                </p>
              </div>
            )}
          </section>

          {/* Directory */}
          <section className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl tracking-tight uppercase">All mentors</h2>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, skill or city"
                className="border-ink/15 focus:border-volt w-full max-w-xs border bg-transparent p-3 text-sm outline-none"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["All", ...MENTOR_CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`wedge px-4 py-2 text-sm font-semibold transition-colors ${
                    c === category ? "bg-ink text-inverse-foreground" : "border-ink/15 border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <MentorCard key={m.id} mentor={m} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-muted-foreground mt-8 text-sm">
                No mentors match that yet. Try another category or search.
              </p>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
