import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell, PageHeader } from "@/components/AppShell";
import { historySeries } from "@/lib/aspira-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Prediction track record — Aspira" },
      {
        name: "description",
        content:
          "Past Readiness Scores plotted against what actually happened, so the score earns trust over time instead of asking for it.",
      },
      { property: "og:title", content: "Prediction track record — Aspira" },
      {
        property: "og:description",
        content: "Predicted vs actual respiratory strain across the last two weeks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: History,
});

function History() {
  const errors = historySeries.map((p) => Math.abs(p.predicted - p.actual));
  const mae = (errors.reduce((a, b) => a + b, 0) / errors.length).toFixed(1);
  const within5 = Math.round((errors.filter((e) => e <= 5).length / errors.length) * 100);

  return (
    <AppShell>
      <PageHeader
        eyebrow="History & impact"
        title="How the score has actually performed"
        description="Two weeks of predictions in Spokane, plotted against measured outcomes and clinic-reported load."
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Metric label="Mean absolute error" value={mae} sub="points on a 0–100 scale" />
        <Metric label="Within 5 points" value={`${within5}%`} sub="of the 14 days shown" />
        <Metric label="Lead time" value="3.2 days" sub="median warning before a peak" />
      </div>

      <section className="surface mt-5 p-6">
        <p className="eyebrow text-muted-foreground">Predicted vs actual</p>
        <h2 className="mt-1 text-lg font-semibold">Aug 12 – Aug 25, Spokane</h2>
        <div className="mt-5 h-80">
          <ResponsiveContainer width="100%" height="100%" debounce={120}>
            <LineChart data={historySeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="predicted"
                name="Predicted readiness"
                stroke="var(--primary)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="actual"
                name="Actual strain"
                stroke="var(--elevated)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
              />
              <Line
                type="monotone"
                isAnimationActive={false}
                dataKey="clinicLoad"
                name="Clinic-reported load"
                stroke="var(--primary-deep)"
                strokeWidth={1.5}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          This page exists to make the score's track record visible, not to be an analytics suite.
          Actual strain is derived from measured PM2.5 after the fact; clinic load is self-reported.
        </p>
      </section>
    </AppShell>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="tile sheen p-5 hover:tile-hover">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="num mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
