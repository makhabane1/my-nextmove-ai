import { Link } from "@tanstack/react-router";

import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="bg-inverse text-inverse-foreground font-body">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="wedge bg-volt text-ink font-display grid size-8 place-items-center text-lg">
            M
          </span>
          <span className="font-display text-lg leading-none tracking-tight">
            My NextMove <span className="text-volt">AI</span>
          </span>
        </Link>
        <nav className="text-mist hidden items-center gap-8 text-sm md:flex">
          <Link to="/simulate" className="hover:text-volt transition-colors">
            Simulate
          </Link>
          <Link to="/simulate" hash="compare" className="hover:text-volt transition-colors">
            Compare
          </Link>
          <Link to="/simulate" hash="plan" className="hover:text-volt transition-colors">
            Your Plan
          </Link>
          <Link to="/insights" className="hover:text-volt transition-colors">
            SA Insights
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/simulate"
            className="wedge bg-volt text-ink px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-inverse text-mist font-body">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 px-5 py-8 text-xs sm:flex-row sm:items-center sm:px-10">
        <span className="font-display text-inverse-foreground text-base">
          My NextMove <span className="text-volt">AI</span>
        </span>
        <span>
          Simulated insights only · not financial advice · Made in South Africa · ©{" "}
          {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
