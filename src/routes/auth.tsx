import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "../components/site-header";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

type Search = { next?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    next: typeof s["next"] === "string" && s["next"].startsWith("/") && !s["next"].startsWith("//") ? s["next"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — My NextMove AI" },
      { name: "description", content: "Sign in to book mentors and keep your NextMove sessions in one place." },
      { property: "og:title", content: "Sign in — My NextMove AI" },
      { property: "og:description", content: "Book mentors and track your sessions on My NextMove AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const go = () => navigate({ to: next ?? "/mentors" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else go();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + (next ?? "/mentors") },
      });
      if (error) setMsg(error.message);
      else if (data.session) go();
      else setMsg("Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  };

  const google = async () => {
    if (next) sessionStorage.setItem("nextmove.next", next);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) setMsg(r.error.message ?? "Google sign-in failed");
    else if (!r.redirected) go();
  };

  return (
    <div className="font-body min-h-screen">
      <SiteHeader />
      <main className="bg-canvas text-canvas-foreground">
        <div className="mx-auto max-w-md px-5 py-16">
          <h1 className="font-display text-4xl tracking-tight uppercase">
            {mode === "in" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Needed to book mentors and run a mentor profile.</p>
          <button
            onClick={google}
            className="border-ink/15 mt-8 w-full border px-5 py-3 text-sm font-semibold"
          >
            Continue with Google
          </button>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="border-ink/15 focus:border-volt w-full border bg-transparent p-3 outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-ink/15 focus:border-volt w-full border bg-transparent p-3 outline-none"
            />
            <button
              disabled={busy}
              className="wedge bg-volt text-ink w-full px-6 py-3 text-sm font-semibold disabled:opacity-50"
            >
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>
          {msg && <p className="border-flame mt-4 border-l-4 p-3 text-sm">{msg}</p>}
          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="text-muted-foreground mt-6 text-sm underline"
          >
            {mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
