import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { readBookings, type Booking } from "../lib/bookings";
import { MENTORS, zarPrice } from "../lib/mentors";

export const Route = createFileRoute("/mentor-dashboard")({
  head: () => ({
    meta: [
      { title: "Mentor Dashboard — My NextMove AI" },
      {
        name: "description",
        content:
          "Manage your mentor profile, incoming bookings, earnings, messages, reviews and availability on My NextMove AI.",
      },
      { property: "og:title", content: "Mentor Dashboard — My NextMove AI" },
      {
        property: "og:description",
        content: "Bookings, earnings, reviews and availability for NextMove mentors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MentorDashboard,
});

const TABS = ["Bookings", "Earnings", "Messages", "Reviews", "Availability", "Profile"] as const;

function MentorDashboard() {
  // Demo: sign in as the first mentor in the directory.
  const [mentorId, setMentorId] = useState(MENTORS[0]!.id);
  const mentor = MENTORS.find((m) => m.id === mentorId)!;
  const [tab, setTab] = useState<(typeof TABS)[number]>("Bookings");
  const [all, setAll] = useState<Booking[]>([]);

  useEffect(() => setAll(readBookings()), []);
  const mine = all.filter((b) => b.mentorId === mentorId);
  const paid = mine.filter((b) => b.paymentStatus === "Paid (demo)");
  const earnings = paid.reduce((s, b) => s + b.price, 0);
  const reviews = mine.filter((b) => b.review);

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />
      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-10">
          <span className="wedge bg-ink text-inverse-foreground inline-block px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
            Mentor dashboard
          </span>
          <h1 className="font-display mt-5 text-3xl tracking-tight uppercase sm:text-5xl">
            Welcome back, <span className="text-flame">{mentor.name.split(" ")[0]}</span>
          </h1>

          <label className="mt-5 block max-w-xs">
            <span className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
              Viewing as (demo)
            </span>
            <select
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              className="border-ink/15 focus:border-volt bg-canvas mt-2 w-full border p-3 text-sm outline-none"
            >
              {MENTORS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.category}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            <Stat label="Bookings" value={String(mine.length)} />
            <Stat label="Paid" value={String(paid.length)} />
            <Stat label="Earnings" value={zarPrice(earnings)} />
            <Stat label="Rating" value={`★ ${mentor.rating.toFixed(1)}`} />
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`wedge px-4 py-2 text-sm font-semibold ${
                  t === tab ? "bg-ink text-inverse-foreground" : "border-ink/15 border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <section className="border-ink/10 bg-surface mt-6 border p-6 sm:p-8">
            {tab === "Bookings" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Incoming bookings</h2>
                {mine.length === 0 ? (
                  <p className="text-muted-foreground mt-3 text-sm">
                    No bookings yet. They appear here as soon as someone books a session with you.
                  </p>
                ) : (
                  <ul className="mt-5 space-y-4">
                    {mine.map((b) => (
                      <li key={b.id} className="border-ink/10 border-b pb-4 last:border-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-display text-lg">{b.slot}</span>
                          <span className="text-muted-foreground text-sm">{zarPrice(b.price)}</span>
                          <span className="ml-auto text-xs font-semibold uppercase">
                            {b.paymentStatus}
                          </span>
                        </div>
                        {b.note && <p className="text-muted-foreground mt-1 text-sm">{b.note}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "Earnings" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Earnings</h2>
                <p className="mt-3 text-sm">
                  Paid sessions: <strong>{paid.length}</strong> · Total{" "}
                  <strong>{zarPrice(earnings)}</strong> · Pending{" "}
                  <strong>{zarPrice(mine.length * mentor.pricePerSession - earnings)}</strong>
                </p>
                <p className="text-muted-foreground mt-3 text-xs">
                  Payouts are a placeholder in this preview. No real money moves yet.
                </p>
              </div>
            )}

            {tab === "Messages" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Messages</h2>
                {mine.length === 0 ? (
                  <p className="text-muted-foreground mt-3 text-sm">No messages yet.</p>
                ) : (
                  <ul className="mt-5 space-y-3 text-sm">
                    {mine.map((b) => (
                      <li key={b.id} className="border-volt border-l-4 pl-3">
                        <p className="text-muted-foreground text-xs uppercase">
                          About {b.slot}
                        </p>
                        <p>{b.note || "No message left."}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "Reviews" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground mt-3 text-sm">
                    No session reviews yet on this device.
                  </p>
                ) : (
                  <ul className="mt-5 space-y-3 text-sm">
                    {reviews.map((b) => (
                      <li key={b.id} className="border-ink/10 border-b pb-3 last:border-0">
                        ★ {b.review!.rating}/5 — {b.review!.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === "Availability" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Availability</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Slots you are currently offering.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {mentor.slots.map((s) => (
                    <span key={s} className="wedge border-ink/15 border px-4 py-2 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mt-4 text-xs">
                  Editing your calendar arrives with mentor accounts.
                </p>
              </div>
            )}

            {tab === "Profile" && (
              <div>
                <h2 className="font-display text-2xl tracking-tight uppercase">Your profile</h2>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <Field label="Category" value={mentor.category} />
                  <Field label="Expertise" value={mentor.expertise} />
                  <Field label="Location" value={`${mentor.city}, ${mentor.province}`} />
                  <Field label="Experience" value={`${mentor.years} years`} />
                  <Field label="Price per session" value={zarPrice(mentor.pricePerSession)} />
                  <Field label="Languages" value={mentor.languages.join(", ")} />
                  <div className="sm:col-span-2">
                    <Field label="Bio" value={mentor.bio} />
                  </div>
                </dl>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-ink/10 bg-surface border p-5">
      <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
        {label}
      </p>
      <p className="font-display mt-2 text-2xl">{value}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase">
        {label}
      </dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
