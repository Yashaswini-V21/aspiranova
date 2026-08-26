import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Radio, Search } from "lucide-react";

import { searchRegions } from "@/lib/region.functions";
import { pinnedRegions, useRegion } from "@/lib/use-region";
import { cn } from "@/lib/utils";

export function RegionSearch({ className }: { className?: string }) {
  const { selected, select } = useRegion();
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(term.trim()), 320);
    return () => window.clearTimeout(t);
  }, [term]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const results = useQuery({
    queryKey: ["region-search", debounced],
    queryFn: () => searchRegions({ data: { query: debounced } }),
    enabled: debounced.length >= 2,
    staleTime: 5 * 60_000,
  });

  const matches = useMemo(() => results.data ?? [], [results.data]);

  return (
    <div ref={boxRef} className={cn("relative w-full max-w-md", className)}>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-[var(--shadow-card)] focus-within:border-primary">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={term}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          placeholder="Search any city — Delhi, Mumbai, Spokane…"
          aria-label="Search for a region"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {results.isFetching ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {open && debounced.length >= 2 ? (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-[var(--shadow-card)]">
          {matches.length === 0 && !results.isFetching ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              No matching location found. Try a different spelling.
            </p>
          ) : null}
          <ul className="max-h-72 overflow-auto">
            {matches.map((m) => (
              <li key={m.key}>
                <button
                  onClick={() => {
                    select(m);
                    setOpen(false);
                    setTerm("");
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate">{m.name}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {[m.state, m.country].filter(Boolean).join(", ")}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "num flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                      m.stationCount >= 2
                        ? "border-calm/25 bg-calm/10 text-calm"
                        : "border-urgent/25 bg-urgent/10 text-urgent",
                    )}
                  >
                    <Radio className="size-3" />
                    {m.stationCount} station{m.stationCount === 1 ? "" : "s"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className="eyebrow mr-1 text-muted-foreground">Quick select</span>
        {pinnedRegions.map((p) => (
          <button
            key={p.key}
            onClick={() => select(p)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-300",
              p.key === selected.key
                ? "gradient-teal text-teal-foreground shadow-[var(--shadow-card)]"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CoverageBadge({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl border border-urgent/25 bg-urgent/10 px-3 py-2 text-xs font-medium leading-relaxed text-urgent",
        className,
      )}
    >
      <Radio className="mt-0.5 size-3.5 shrink-0" />
      Limited official coverage — community check-ins carry more weight in this estimate.
    </p>
  );
}
