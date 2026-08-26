import { Link } from "@tanstack/react-router";
import { Github, Heart, MapPin, Wind } from "lucide-react";

import { Logo } from "@/components/AppShell";
import { ThemeToggle } from "@/components/theme-toggle";
import { ASPIRA_DISCLAIMER } from "@/lib/use-region";
import { cn } from "@/lib/utils";

const product = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/clinic", label: "Clinic view" },
  { to: "/alerts", label: "Personal alerts" },
];

const insight = [
  { to: "/community", label: "Community map" },
  { to: "/history", label: "Prediction history" },
  { to: "/", label: "Overview" },
];

export function SiteFooter({ className }: { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("relative mt-12 overflow-hidden border-t border-border/70", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 opacity-70"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--teal) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Air-quality readiness forecasting that blends official sensor networks with
              community check-ins — so people can plan before the air turns.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-secondary/50 px-3 py-2 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-teal" />
              Built in <span className="font-semibold text-foreground">Bengaluru, Karnataka</span> · India
            </div>
          </div>

          <nav className="text-sm">
            <p className="eyebrow text-teal">Product</p>
            <ul className="mt-3 space-y-2.5">
              {product.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="text-sm">
            <p className="eyebrow text-teal">Insight</p>
            <ul className="mt-3 space-y-2.5">
              {insight.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-start gap-2">
            <ThemeToggle />
            <a
              href="https://openaq.org"
              target="_blank"
              rel="noreferrer"
              aria-label="Data source: OpenAQ"
              className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Wind className="size-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Source code"
              className="grid size-9 place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
          </div>
        </div>

        <p className="mt-8 border-t border-border/70 pt-5 text-xs leading-relaxed text-muted-foreground">
          {ASPIRA_DISCLAIMER}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {year} Aspira · Live data by OpenAQ</span>
          <span className="inline-flex items-center gap-1.5">
            Made with <Heart className="size-3.5 text-ember" /> in Bengaluru, Karnataka
          </span>
        </div>
      </div>
    </footer>
  );
}
