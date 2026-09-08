import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { addBooking, addReview, markPaid, readBookings, type Booking } from "../lib/bookings";
import { findMentor, initials, zarPrice } from "../lib/mentors";

export const Route = createFileRoute("/mentors/$mentorId")({
  loader: ({ params }) => {
    const mentor = findMentor(params.mentorId);
    if (!mentor) throw notFound();
    return { mentor };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Mentor not found — My NextMove AI" }, { name: "robots", content: "noindex" }],
      };
    }
    const m = loaderData.mentor;
    const title = `${m.name} — ${m.expertise} mentor in ${m.city} | My NextMove AI`;
    const description = `Book a session with ${m.name}, ${m.years} years in ${m.expertise}, based in ${m.city}. ${zarPrice(m.pricePerSession)} per session.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: MentorProfile,
});

function MentorProfile() {
  const { mentor } = Route.useLoaderData();
  const [slot, setSlot] = useState(mentor.slots[0] ?? "");
  const [note, setNote] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const refresh = () => setBookings(readBookings().filter((b) => b.mentorId === mentor.id));
  useEffect(refresh, [mentor.id]);

  const book = () => {
    if (!slot) return;
    addBooking({
      mentorId: mentor.id,
      mentorName: mentor.name,
      slot,
      price: mentor.pricePerSession,
      note,
      paymentStatus: "Pending payment",
    });
    setNote("");
    refresh();
  };

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />
      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1000px] px-5 py-12 sm:px-10">
          <Link to="/mentors" className="text-muted-foreground hover:text-flame text-xs uppercase">
            ← Back to all mentors
          </Link>

          <header className="mt-6 flex flex-wrap items-start gap-5">
            <span className="wedge bg-ink text-inverse-foreground font-display grid size-20 shrink-0 place-items-center text-3xl">
              {initials(mentor.name)}
            </span>
            <div>
              <h1 className="font-display text-3xl tracking-tight uppercase sm:text-5xl">
                {mentor.name}
              </h1>
              <p className="text-muted-foreground mt-2">{mentor.expertise}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {mentor.city}, {mentor.province} · {mentor.years} yrs · ★ {mentor.rating.toFixed(1)}{" "}
                ({mentor.reviews} reviews) · {mentor.helped} people helped ·{" "}
                {mentor.languages.join(", ")}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-[0.12em] uppercase">
                {mentor.availability}
              </p>
            </div>
            <span className="wedge bg-volt text-ink font-display ml-auto px-4 py-2 text-lg">
              {zarPrice(mentor.pricePerSession)} / session
            </span>
          </header>

          <p className="mt-6 max-w-2xl text-lg">{mentor.bio}</p>

          {/* Booking */}
          <section className="border-ink/10 bg-surface mt-10 border p-6 sm:p-8">
            <h2 className="font-display text-2xl tracking-tight uppercase">Book a session</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Pick a time that suits you. Sessions are 45 minutes on a video call.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {mentor.slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`wedge px-4 py-2 text-sm font-semibold ${
                    s === slot ? "bg-ink text-inverse-foreground" : "border-ink/15 border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                What do you want help with?
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="I want to move from retail into a junior IT role this year."
                className="border-ink/15 focus:border-volt mt-2 w-full border bg-transparent p-3 outline-none"
              />
            </label>
            <button
              onClick={book}
              disabled={!slot}
              className="wedge bg-volt text-ink mt-5 px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              Book {slot || "a session"} →
            </button>
            <p className="text-muted-foreground mt-3 text-xs">
              Payments and video calls are placeholders in this preview — nothing is charged.
            </p>
          </section>

          {/* Your bookings with this mentor */}
          {bookings.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl tracking-tight uppercase">
                Your sessions with {mentor.name.split(" ")[0]}
              </h2>
              <div className="mt-5 space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="border-ink/10 bg-surface border p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-lg">{b.slot}</span>
                      <span className="text-muted-foreground text-sm">{zarPrice(b.price)}</span>
                      <span className="wedge bg-ink text-inverse-foreground ml-auto px-3 py-1 text-xs font-semibold uppercase">
                        {b.paymentStatus}
                      </span>
                    </div>
                    {b.note && <p className="text-muted-foreground mt-2 text-sm">{b.note}</p>}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {b.paymentStatus === "Pending payment" && (
                        <button
                          onClick={() => {
                            markPaid(b.id);
                            refresh();
                          }}
                          className="wedge bg-volt text-ink px-4 py-2 text-xs font-semibold"
                        >
                          Pay {zarPrice(b.price)} (demo)
                        </button>
                      )}
                      <button
                        disabled
                        className="border-ink/15 px-4 py-2 text-xs font-semibold opacity-60 border"
                      >
                        Join video call (coming soon)
                      </button>
                    </div>

                    {b.review ? (
                      <p className="border-volt mt-4 border-l-4 pl-3 text-sm">
                        ★ {b.review.rating}/5 — {b.review.text}
                      </p>
                    ) : (
                      <div className="border-ink/10 mt-4 border-t pt-4">
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
                          Leave a review
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              onClick={() => setRating(r)}
                              className={`wedge px-3 py-1 text-xs font-semibold ${
                                r === rating ? "bg-ink text-inverse-foreground" : "border-ink/15 border"
                              }`}
                            >
                              {r}★
                            </button>
                          ))}
                          <input
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="How did the session go?"
                            className="border-ink/15 focus:border-volt min-w-[200px] flex-1 border bg-transparent p-2 text-sm outline-none"
                          />
                          <button
                            onClick={() => {
                              if (!reviewText.trim()) return;
                              addReview(b.id, rating, reviewText.trim());
                              setReviewText("");
                              refresh();
                            }}
                            className="wedge bg-volt text-ink px-4 py-2 text-xs font-semibold"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
