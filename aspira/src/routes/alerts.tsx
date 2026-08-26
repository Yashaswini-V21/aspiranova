import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Mail, MessageSquare } from "lucide-react";

import { AppShell, PageHeader } from "@/components/AppShell";
import { RegionSearch } from "@/components/RegionSearch";
import { personalAlerts } from "@/lib/aspira-data";
import { useRegion } from "@/lib/use-region";
import { bandStyles } from "@/lib/band";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Personal risk profile & alerts — Aspira" },
      {
        name: "description",
        content:
          "Set your respiratory risk profile and get calm, specific early warnings when the Readiness Score for your region crosses your threshold.",
      },
      { property: "og:title", content: "Personal risk profile & alerts — Aspira" },
      {
        property: "og:description",
        content: "Personal early warnings tied to your own risk profile, not a raw AQI number.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alerts,
});

const conditions = ["Asthma", "COPD", "Other respiratory condition", "None — caring for someone"];
const channels = [
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS", icon: MessageSquare },
  { key: "app", label: "In-app only", icon: Bell },
];

function Alerts() {
  const [condition, setCondition] = useState("Asthma");
  const [channel, setChannel] = useState("email");
  const { region } = useRegion();
  const [threshold, setThreshold] = useState(65);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Personal alerts"
        title="Your risk profile"
        description="Three questions. After that, warnings arrive only when they're actually about you."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="surface self-start p-6">
          <Field label="What do you manage?">
            <div className="grid gap-2 sm:grid-cols-2">
              {conditions.map((c) => (
                <Choice key={c} active={condition === c} onClick={() => setCondition(c)}>
                  {c}
                </Choice>
              ))}
            </div>
          </Field>

          <Field label="Home region">
            <RegionSearch className="max-w-none" />
            <p className="mt-2.5 text-xs text-muted-foreground">
              Currently following {region.name}
              {region.state ? `, ${region.state}` : ""} · {region.sensors} official station
              {region.sensors === 1 ? "" : "s"} nearby
            </p>
          </Field>

          <Field label="How should we reach you?">
            <div className="grid gap-2 sm:grid-cols-3">
              {channels.map((c) => (
                <Choice key={c.key} active={channel === c.key} onClick={() => setChannel(c.key)}>
                  <c.icon className="size-4" />
                  {c.label}
                </Choice>
              ))}
            </div>
          </Field>

          <Field label={`Alert me above a Readiness Score of ${threshold}`}>
            <input
              type="range"
              min={30}
              max={90}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[var(--primary)]"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Lower threshold means earlier, more frequent warnings.
            </p>
          </Field>

          <div className="mt-6 rounded-xl border border-border bg-secondary p-4">
            <p className="eyebrow text-muted-foreground">Preview</p>
            <p className="mt-1.5 text-sm leading-relaxed">
              “Bad air expected Thursday–Friday in {region.name}.
              Consider refilling your inhaler and limiting outdoor activity those two days.”
            </p>
          </div>
        </section>

        <section className="self-start">
          <div className="tile sheen p-6">
            <p className="eyebrow text-muted-foreground">Alert timeline</p>
            <h2 className="mt-1 text-lg font-semibold">Upcoming and past</h2>
            <ul className="mt-5 space-y-3">
              {personalAlerts.map((a) => {
                const s = bandStyles[a.band];
                return (
                  <li key={a.id} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.chip)}>
                        {a.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {a.when} · {a.region}
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm font-semibold">{a.headline}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="mb-2.5 text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function Choice({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-colors",
        active
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
