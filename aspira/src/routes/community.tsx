import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio, TriangleAlert } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { CoverageBadge, RegionSearch } from "@/components/RegionSearch";
import { CheckinWidget } from "@/components/CheckinWidget";
import { coverageGrid } from "@/lib/aspira-data";
import { useRegion } from "@/lib/use-region";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community coverage map — Aspira" },
      {
        name: "description",
        content:
          "See official air-quality sensors alongside community symptom check-in density, and find the neighbourhoods where the crowdsourced layer matters most.",
      },
      { property: "og:title", content: "Community coverage map — Aspira" },
      {
        property: "og:description",
        content: "Hyperlocal air signal for neighbourhoods with no official monitoring station.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

function nearSensor(x: number, y: number) {
  return coverageGrid.some((c) => c.sensor && Math.abs(c.x - x) <= 2 && Math.abs(c.y - y) <= 1);
}

function Community() {
  const { region, limitedCoverage } = useRegion();
  const [hover, setHover] = useState<string | null>(null);
  const gaps = coverageGrid.filter((c) => !nearSensor(c.x, c.y) && c.signal > 0.6);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Community signal layer"
        title="Coverage map"
        description="Official sensors, community check-in density, and the gap between the two."
        action={<RegionSearch />}
      />

      {limitedCoverage ? <CoverageBadge className="mb-5" /> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="surface self-start p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{region.name} metro grid</h2>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" /> Official sensor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-calm/50" /> Check-in density
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm border border-urgent bg-urgent/25" /> Uncovered
                but active
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-12 gap-1.5 rounded-xl bg-secondary p-3">
            {coverageGrid.map((c) => {
              const key = `${c.x}-${c.y}`;
              const covered = nearSensor(c.x, c.y);
              const gap = !covered && c.signal > 0.6;
              return (
                <button
                  key={key}
                  onMouseEnter={() => setHover(key)}
                  onMouseLeave={() => setHover(null)}
                  className={cn(
                    "relative aspect-square rounded-md transition-transform hover:scale-105",
                    gap && "ring-1 ring-urgent",
                  )}
                  style={{
                    backgroundColor: gap
                      ? `color-mix(in oklab, var(--urgent) ${Math.round(c.signal * 45)}%, transparent)`
                      : `color-mix(in oklab, var(--calm) ${Math.round(c.signal * 55)}%, transparent)`,
                  }}
                  aria-label={`Grid cell ${key}`}
                >
                  {c.sensor ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="size-2.5 rounded-full bg-primary ring-2 ring-card" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {hover
              ? (() => {
                  const c = coverageGrid.find((g) => `${g.x}-${g.y}` === hover)!;
                  return `Cell ${hover} · ${Math.round(c.signal * 40)} check-ins in 48h · ${
                    c.sensor ? "official sensor on site" : nearSensor(c.x, c.y) ? "sensor within 2 cells" : "no sensor nearby"
                  }`;
                })()
              : "Hover a cell to inspect its signal density and sensor coverage."}
          </p>
        </section>

        <div className="grid content-start gap-5">
          <section className="tile sheen p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <TriangleAlert className="size-4 text-urgent" />
              {gaps.length} uncovered active areas
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              These neighbourhoods have no official station within range but strong recent check-in
              activity — the crowdsourced layer is carrying the estimate here.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {gaps.slice(0, 4).map((c) => (
                <li
                  key={`${c.x}-${c.y}`}
                  className="flex items-center justify-between rounded-lg border border-urgent/25 bg-urgent/8 px-3 py-2"
                >
                  <span className="font-medium">Cell {c.x}-{c.y}</span>
                  <span className="num text-xs text-muted-foreground">
                    {Math.round(c.signal * 40)} check-ins
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="tile sheen p-6">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Radio className="size-4 text-primary" /> Signal health
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Check-ins, last 48h", "1,284"],
                ["Active contributors", "406"],
                ["Cells with any signal", "78 / 84"],
                ["Official stations", String(region.sensors)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="num font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <CheckinWidget regionName={region.name} emphasized={limitedCoverage} />
        </div>
      </div>
    </AppShell>
  );
}
