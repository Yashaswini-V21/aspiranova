import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";

import { Atmosphere } from "@/components/Atmosphere";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/SiteFooter";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clinic", label: "Clinic view" },
  { to: "/alerts", label: "Alerts" },
  { to: "/community", label: "Community" },
  { to: "/history", label: "History" },
];

export function Logo({ tone = "default" }: { tone?: "default" | "invert" }) {
  return (
    <Link to="/" className="group flex shrink-0 items-center gap-2.5">
      <span
        className={cn(
          "relative grid size-9 place-items-center overflow-hidden rounded-xl",
          tone === "invert" ? "bg-onsky/12 ring-1 ring-onsky/25" : "gradient-sky",
        )}
      >
        <svg viewBox="0 0 64 64" className="size-5 text-onsky">
          <path
            d="M8 24h26a7 7 0 1 0-7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M8 40h34a8 8 0 1 1-8 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          tone === "invert" ? "text-onsky" : "text-foreground",
        )}
      >
        Aspira
      </span>
    </Link>
  );
}

export function SiteHeader({ tone = "default" }: { tone?: "default" | "invert" }) {
  const [open, setOpen] = useState(false);
  const invert = tone === "invert";

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        invert ? "absolute inset-x-0 bg-transparent" : "glass border-b border-border/70",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:h-16">
        <Logo tone={tone} />

        <nav
          className={cn(
            "ml-4 hidden items-center gap-1 rounded-2xl p-1 lg:flex",
            invert ? "bg-onsky/8 ring-1 ring-onsky/15" : "bg-secondary/70",
          )}
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                invert
                  ? "text-onsky/70 hover:text-onsky"
                  : "text-muted-foreground hover:text-foreground",
              )}
              activeProps={{
                className: invert
                  ? "bg-onsky/15 text-onsky"
                  : "bg-card text-foreground shadow-[var(--shadow-card)]",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="mr-1 hidden items-center gap-2 sm:flex">
            <span className="relative flex size-2 items-center justify-center">
              <span className="pulse-ring absolute size-2 rounded-full bg-calm" />
              <span className="size-2 rounded-full bg-calm" />
            </span>
            <span
              className={cn(
                "text-xs",
                invert ? "text-onsky/70" : "text-muted-foreground",
              )}
            >
              Synced 14m ago
            </span>
          </div>

          <ThemeToggle
            className={cn(
              invert && "border-onsky/25 bg-onsky/10 text-onsky",
            )}
          />

          <Link
            to="/dashboard"
            className={cn(
              "hidden rounded-xl px-4 py-2 text-sm font-semibold lift hover:lift-hover sm:inline-flex",
              invert
                ? "bg-onsky text-sky-deep"
                : "gradient-teal text-teal-foreground",
            )}
          >
            Open dashboard
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid size-9 place-items-center rounded-xl border lg:hidden",
              invert
                ? "border-onsky/25 text-onsky"
                : "border-border text-muted-foreground",
            )}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className={cn(
            "grid gap-1 border-t px-5 py-3 lg:hidden",
            invert ? "border-onsky/15 bg-sky-deep/80 backdrop-blur-md" : "border-border bg-card",
          )}
        >
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-3 py-2.5 text-sm font-medium",
                invert ? "text-onsky/80" : "text-muted-foreground",
              )}
              activeProps={{
                className: invert
                  ? "bg-onsky/15 text-onsky"
                  : "bg-accent text-accent-foreground",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  return (
    <div className="relative min-h-screen bg-background">
      <Atmosphere />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60" />

      <SiteHeader />

      <main key={pathname} className="reveal-in mx-auto max-w-6xl px-5 py-8">
        {children}
      </main>


      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="reveal-in eyebrow text-teal">{eyebrow}</p>
        <h1
          style={{ "--reveal-delay": "70ms" } as CSSProperties}
          className="reveal-in mt-2 text-3xl font-semibold sm:text-4xl"
        >
          {title}
        </h1>
        <p
          style={{ "--reveal-delay": "140ms" } as CSSProperties}
          className="reveal-in mt-2 text-sm leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
