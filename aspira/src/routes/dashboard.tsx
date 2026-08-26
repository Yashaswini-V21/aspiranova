import { createFileRoute } from "@tanstack/react-router";
import { memo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MapPin } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { CoverageBadge, RegionSearch } from "@/components/RegionSearch";
import { ReadinessDial } from "@/components/ReadinessDial";
import { CheckinWidget } from "@/components/CheckinWidget";
import { peakDay } from "@/lib/aspira-data";
import { useRegion } from "@/lib/use-region";
import { styleFor } from "@/lib/band";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Regional readiness dashboard — Aspira" },
      {
        name: "description",
        content:
          "Current AQI, a 5-day PM2.5 forecast and a plain-language Readiness Score with one specific recommended action for your region.",
      },
      { property: "og:title", content: "Regional readiness dashboard — Aspira" },
      {
        property: "og:description",
        content: "Five-day respiratory readiness forecasting for any region you follow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { region, limitedCoverage } = useRegion();
  const s = styleFor(region.readiness);
  const peak = peakDay(region.forecast);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Regional dashboard"
        title={`${region.name}${region.state ? `, ${region.state}` : ""}`}
        description="Live air quality, the five-day outlook, and what it means for breathing here."
        action={<RegionSearch />}
      />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <section className="tile sheen relative self-start overflow-hidden p-6">
          <span
            aria-hidden
            className="aurora-blob pointer-events-none absolute -right-20 -top-24 size-64 rounded-full opacity-25"
          />
          <div className="flex items-center justify-between">
            <p className="eyebrow text-muted-foreground">Readiness score</p>
            <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", s.chip)}>
              Peak {peak.day}
            </span>
          </div>
          <ReadinessDial
            score={region.readiness}
            className="my-5"
            caption="0–100 predicted respiratory strain"
          />
          <p className="text-sm leading-relaxed text-muted-foreground">{region.driver}</p>
          {limitedCoverage ? <CoverageBadge className="mt-4" /> : null}
          <div className={cn("mt-5 rounded-xl border p-4", s.chip)}>
            <p className="eyebrow">Do this</p>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground">
              {region.patientAction}
            </p>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="grid gap-3 sm:grid-cols-3">
            <Stat label="Current AQI" value={String(region.currentAqi)} sub="US EPA scale" />
            <Stat label="PM2.5" value={`${region.currentPm25}`} sub="µg/m³, hourly mean" />
            <Stat
              label="Official sensors"
              value={String(region.sensors)}
              sub={region.sensors === 0 ? "community signal only" : "OpenAQ, within 25 km"}
            />
          </section>

          <section className="tile sheen p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-muted-foreground">Five-day outlook</p>
                <h2 className="mt-1 text-lg font-semibold">Readiness vs particulate load</h2>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <Legend color="var(--primary)" label="Readiness" />
                <Legend color="var(--elevated)" label="PM2.5 µg/m³" />
              </div>
            </div>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%" debounce={120}>
                <AreaChart data={region.forecast} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--popover)",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="readiness"
                    name="Readiness"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fill="url(#dashFill)"
                  />
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="pm25"
                    name="PM2.5"
                    stroke="var(--elevated)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="4 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {region.forecast.map((d) => {
                const ds = styleFor(d.readiness);
                return (
                  <div key={d.day} className="rounded-xl border border-border p-3 lift hover:tile-hover">
                    <p className="text-xs font-medium">{d.day}</p>
                    <p className="text-[11px] text-muted-foreground">{d.date}</p>
                    <p className={cn("num mt-2 text-xl font-semibold", ds.text)}>{d.readiness}</p>
                    <p className="text-[11px] text-muted-foreground">AQI {d.aqi}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid gap-5 md:grid-cols-2">
            <CheckinWidget regionName={region.name} emphasized={limitedCoverage} />
            <section className="tile sheen p-6">
              <p className="eyebrow text-muted-foreground">Nearby coverage</p>
              <h2 className="mt-1 text-lg font-semibold">Where this estimate comes from</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    {region.sensors > 0
                      ? `${region.sensors} official OpenAQ station${region.sensors > 1 ? "s" : ""} reporting hourly.`
                      : "No official station within range — estimate is community-weighted."}
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    142 community check-ins logged here in the last 48 hours.
                  </span>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">
                    Forecast refreshed every three hours from public agency feeds.
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

const Stat = memo(function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="tile sheen p-5 hover:tile-hover">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="num mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
});

const Legend = memo(function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
});
