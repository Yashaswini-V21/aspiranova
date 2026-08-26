import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const SESSION_KEY = "aspira-splash-seen";

/**
 * Once-per-session intro. The overlay renders on the server so there is no
 * flash of the page before it; a returning visitor removes it on mount.
 */
export function Splash() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable — show the intro */
    }

    if (seen) {
      setPhase("gone");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    const leave = window.setTimeout(() => setPhase("out"), 1500);
    const done = window.setTimeout(() => setPhase("gone"), 2150);

    return () => {
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] grid place-items-center gradient-sky",
        phase === "out" && "splash-leave",
      )}
    >
      <span
        className="aurora-blob absolute size-[42rem] rounded-full opacity-45"
        style={{ ["--aurora-tint" as string]: "var(--teal)" }}
      />

      <div className="relative flex flex-col items-center">
        <div className="relative grid size-24 place-items-center">
          <span className="splash-ring absolute size-24 rounded-full border border-onsky/40" />
          <span
            className="splash-ring absolute size-24 rounded-full border border-onsky/25"
            style={{ animationDelay: "0.45s" }}
          />
          <svg viewBox="0 0 64 64" className="relative size-12 text-onsky">
            <path
              d="M6 24h30a8 8 0 1 0-8-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="trace-line"
              style={{ ["--trace-len" as string]: "90" }}
            />
            <path
              d="M6 40h38a9 9 0 1 1-9 9"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="trace-line"
              style={{ ["--trace-len" as string]: "110", animationDelay: "0.45s" }}
            />
          </svg>
        </div>

        <p
          className="reveal-in mt-7 font-display text-2xl font-semibold tracking-tight text-onsky"
          style={{ ["--reveal-delay" as string]: "420ms" }}
        >
          Aspira
        </p>
        <p
          className="reveal-in mt-1.5 text-xs text-onsky/70"
          style={{ ["--reveal-delay" as string]: "620ms" }}
        >
          Breathe ahead of the forecast
        </p>
      </div>
    </div>
  );
}
