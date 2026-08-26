import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Package, Users2 } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { RegionSearch } from "@/components/RegionSearch";
import { ReadinessDial } from "@/components/ReadinessDial";
import { clinicChecklist, historySeries } from "@/lib/aspira-data";
import { useRegion } from "@/lib/use-region";
import { styleFor } from "@/lib/band";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clinic")({
  head: () => ({
    meta: [
      { title: "Clinic & pharmacy readiness — Aspira" },
      {
        name: "description",
        content:
          "A 3–5 day respiratory demand forecast for clinics and pharmacies, with restock and staffing recommendations and a readiness checklist.",
      },
      { property: "og:title", content: "Clinic & pharmacy readiness — Aspira" },
      {
        property: "og:description",
        content: "Predicted respiratory visit volume and a specific operational action, days ahead.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClinicView,
});

const volumeCopy = {
  Normal: "Typical respiratory footfall expected.",
  Elevated: "Roughly 1.4× baseline respiratory visits expected.",
  High: "Roughly 2× baseline respiratory visits expected.",
} as const;

function ClinicView() {
  const { region } = useRegion();
  const s = styleFor(region.readiness);
  const [done, setDone] = useState<string[]>(["c1"]);
  const toggle = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Clinic & pharmacy"
        title="Operational readiness, three to five days out"
        description="The same Readiness Score, reframed around stock and staffing decisions you make this week."
        action={
          <div className="grid gap-2">
            <span className="justify-self-end rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground">
              Northside Pharmacy · {region.name}
            </span>
            <RegionSearch />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <section className="surface self-start p-6">
          <p className="eyebrow text-muted-foreground">Predicted demand</p>
          <ReadinessDial score={region.readiness} className="my-5" caption="Respiratory strain index" />
          <div className={cn("rounded-xl border p-4", s.chip)}>
            <p className="eyebrow">Visit volume Thu–Fri</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{region.visitVolume}</p>
            <p className="mt-1 text-xs text-foreground/70">{volumeCopy[region.visitVolume]}</p>
          </div>
          <div className="mt-4 space-y-3">
            <Recommendation icon={Package} title="Stock" body={region.clinicAction} />
            <Recommendation
              icon={Users2}
              title="Staffing"
              body="Consider adding respiratory triage capacity Thursday and Friday afternoon."
            />
          </div>
        </section>

        <div className="grid gap-5">
          <section className="tile sheen p-6">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-muted-foreground">Readiness checklist</p>
                <h2 className="mt-1 text-lg font-semibold">This week's preparation</h2>
              </div>
              <span className="num text-sm text-muted-foreground">
                {done.length}/{clinicChecklist.length} done
              </span>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {clinicChecklist.map((c) => {
                const isDone = done.includes(c.id);
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => toggle(c.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition-colors",
                        isDone
                          ? "border-primary/30 bg-accent text-accent-foreground"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-md border",
                          isDone ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {isDone ? <Check className="size-3" /> : null}
                      </span>
                      <span className={cn("font-medium", isDone && "line-through opacity-70")}>
                        {c.label}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">{c.due}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="tile sheen p-6">
            <p className="eyebrow text-muted-foreground">Track record</p>
            <h2 className="mt-1 text-lg font-semibold">
              14 days of Readiness Score vs your reported respiratory load
            </h2>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%" debounce={120}>
                <BarChart data={historySeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
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
                  <Bar
                    isAnimationActive={false}
                    dataKey="clinicLoad"
                    name="Reported load"
                    fill="var(--primary-soft)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="predicted"
                    name="Readiness score"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Reported load is self-rated by your team each evening. Inventory systems are not
              connected — every recommendation is a suggestion for a human to act on.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Recommendation({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-primary" />
        {title}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
