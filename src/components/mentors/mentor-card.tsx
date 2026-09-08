import { Link } from "@tanstack/react-router";

import { initials, zarPrice, type Mentor } from "../../lib/mentors";

export function MentorCard({
  mentor,
  matchScore,
  why,
  watchOut,
}: {
  mentor: Mentor;
  matchScore?: number;
  why?: string[];
  watchOut?: string;
}) {
  return (
    <article className="border-ink/10 bg-surface flex flex-col border p-5">
      <div className="flex items-start gap-4">
        <span className="wedge bg-ink text-inverse-foreground font-display grid size-14 shrink-0 place-items-center text-xl">
          {initials(mentor.name)}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight tracking-tight">{mentor.name}</p>
          <p className="text-muted-foreground text-sm">{mentor.expertise}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            {mentor.city}, {mentor.province} · {mentor.years} yrs · ★ {mentor.rating.toFixed(1)} (
            {mentor.reviews}) · {mentor.helped} people helped
          </p>
        </div>
        {typeof matchScore === "number" && (
          <span className="wedge bg-volt text-ink font-display ml-auto shrink-0 px-3 py-1.5 text-sm">
            {Math.round(matchScore)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-sm">{mentor.bio}</p>

      {why && why.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {why.map((w) => (
            <li key={w} className="text-muted-foreground">
              ✓ {w}
            </li>
          ))}
        </ul>
      )}
      {watchOut && <p className="text-flame mt-2 text-xs">⚠ {watchOut}</p>}

      <div className="border-ink/10 mt-5 flex flex-wrap items-center gap-3 border-t pt-4">
        <span className="font-display text-lg">{zarPrice(mentor.pricePerSession)}</span>
        <span className="text-muted-foreground text-xs">per session</span>
        <span
          className={`ml-auto text-xs font-semibold tracking-[0.12em] uppercase ${
            mentor.availability === "Available this week" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {mentor.availability}
        </span>
      </div>
      <Link
        to="/mentors/$mentorId"
        params={{ mentorId: mentor.id }}
        className="wedge bg-ink text-inverse-foreground mt-4 px-5 py-2.5 text-center text-sm font-semibold transition-transform hover:-translate-y-0.5"
      >
        View profile &amp; book →
      </Link>
    </article>
  );
}
