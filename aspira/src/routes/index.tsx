import type { CSSProperties } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity,
  ArrowRight,
  Bell,
  Building2,
  HeartPulse,
  MapPin,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import heroSky from "@/assets/hero-sky.jpg";
import { SiteHeader } from "@/components/AppShell";
import { Atmosphere } from "@/components/Atmosphere";
import { Reveal } from "@/components/Reveal";
import { ReadinessDial } from "@/components/ReadinessDial";
import { SiteFooter } from "@/components/SiteFooter";
import { getRegion, regions } from "@/lib/aspira-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aspira — Breathe ahead of the forecast" },
      {
        name: "description",
        content:
          "Aspira turns air quality forecasts into respiratory readiness — so clinics, pharmacies and at-risk people can prepare days before bad air arrives.",
      },
      { property: "og:title", content: "Aspira — Breathe ahead of the forecast" },
      {
        property: "og:description",
        content:
          "Forecast to predicted respiratory demand to a specific action, days ahead. Readiness Scores for clinics, patients and community health workers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: heroSky }],
  }),
  component: Landing,
});

const steps = [
  {
    icon: Radar,
    title: "Watches",
    body: "Continuously ingests public PM2.5, ozone and AQI forecasts for every region you follow.",
  },
  {
    icon: HeartPulse,
    title: "Predicts",
    body: "Models expected respiratory strain from the particulate curve, sharpened by local community check-ins.",
  },
  {
    icon: Bell,
    title: "Acts early",
    body: "Delivers one specific action — restock, staff up, refill — days before the air actually turns.",
  },
];

const audiences = [
  {
    icon: HeartPulse,
    label: "I'm a patient",
    body: "A personal early warning tied to your own risk profile, not a raw AQI number.",
    to: "/alerts",
    cta: "See personal alerts",
  },
  {
    icon: Building2,
    label: "I'm a clinic or pharmacy",
    body: "A 3–5 day demand readiness forecast with a concrete restock and staffing call.",
    to: "/clinic",
    cta: "Open the clinic view",
  },
  {
    icon: Users,
    label: "I'm a community health worker",
    body: "Hyperlocal visibility even where no official sensor exists.",
    to: "/community",
    cta: "Explore coverage",
  },
] as const;

const marquee = [
  "PM2.5 · OpenAQ",
  "Ozone · AirNow",
  "Wildfire smoke plumes",
  "Community check-ins",
  "Clinic demand signal",
  "3–5 day lead time",
];

function Landing() {
  const region = getRegion("spokane-wa");

  return (
    <div className="relative min-h-screen bg-background">
      <Atmosphere />
      <SiteHeader tone="invert" />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <img
          src={heroSky}
          alt="City skyline seen through morning haze"
          fetchPriority="high"
          decoding="async"
          className="drift-slow absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-sky opacity-92" />
        <span
          aria-hidden
          className="aurora-blob absolute -left-28 top-4 z-[1] size-[36rem] rounded-full"
          style={{ "--aurora-tint": "var(--teal)", opacity: 0.5 } as CSSProperties}
        />
        <span
          aria-hidden
          className="aurora-blob absolute left-[38%] -top-32 z-[1] size-[34rem] rounded-full"
          style={
            { "--aurora-tint": "var(--violet)", opacity: 0.4, animationDelay: "-16s" } as CSSProperties
          }
        />
        <span
          aria-hidden
          className="aurora-blob absolute right-[6%] top-[24%] z-[1] size-[26rem] rounded-full"
          style={
            { "--aurora-tint": "var(--cyan)", opacity: 0.3, animationDelay: "-24s" } as CSSProperties
          }
        />
        <span
          aria-hidden
          className="aurora-blob absolute -right-24 bottom-[-6rem] z-[1] size-[30rem] rounded-full"
          style={
            { "--aurora-tint": "var(--urgent)", opacity: 0.25, animationDelay: "-9s" } as CSSProperties
          }
        />

        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-haze)" }} />

        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 pb-24 pt-28 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pb-32 lg:pt-36">
          <div>
            <p className="reveal-in inline-flex items-center gap-2 rounded-full border border-onsky/20 bg-onsky/8 px-3 py-1.5 text-xs font-medium text-onsky/85">
              <Sparkles className="size-3.5" />
              Predictive respiratory readiness
            </p>
            <h1
              style={{ "--reveal-delay": "90ms" } as CSSProperties}
              className="reveal-in mt-6 text-balance font-display text-6xl leading-[0.98] text-onsky sm:text-7xl lg:text-[5.25rem]"
            >
              Clean air, <span className="prism-text">forecast</span>
              <br />
              days before you feel it.
            </h1>

            <p
              style={{ "--reveal-delay": "180ms" } as CSSProperties}
              className="reveal-in mt-6 max-w-xl text-lg leading-relaxed text-onsky/75"
            >
              Aspira predicts respiratory health impact before bad air arrives — so clinics,
              pharmacies and at-risk people can prepare, not just react.
            </p>
            <div
              style={{ "--reveal-delay": "270ms" } as CSSProperties}
              className="reveal-in mt-9 flex flex-wrap gap-3"
            >
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl bg-onsky px-5 py-3.5 text-sm font-semibold text-sky-deep lift hover:lift-hover"
              >
                See a live readiness score
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/clinic"
                className="inline-flex items-center rounded-xl border border-onsky/25 px-5 py-3.5 text-sm font-medium text-onsky transition-colors hover:bg-onsky/10"
              >
                For clinics & pharmacies
              </Link>
            </div>

            <dl
              style={{ "--reveal-delay": "360ms" } as CSSProperties}
              className="reveal-in mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-onsky/15 pt-6"
            >
              {[
                ["3–5 days", "of usable lead time"],
                ["4", "regions modelled"],
                ["10s", "to log a check-in"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="num font-display text-2xl font-semibold text-onsky">{v}</dt>
                  <dd className="mt-1 text-xs leading-snug text-onsky/65">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Live readiness card */}
          <div
            style={{ "--reveal-delay": "340ms" } as CSSProperties}
            className="reveal-in float-slow rounded-3xl border border-onsky/15 bg-card p-6 shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow text-muted-foreground">Readiness score</p>
                <p className="mt-1 font-display text-lg font-semibold">
                  {region.name}, {region.state}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-urgent/30 bg-urgent/12 px-3 py-1 text-xs font-semibold text-urgent">
                Peaks Thu–Fri
              </span>
            </div>

            <div className="mt-5 grid items-center gap-4 sm:grid-cols-[auto_1fr]">
              <ReadinessDial score={region.readiness} size={156} />
              <div>
                <div className="h-[104px]">
                  <ResponsiveContainer width="100%" height="100%" debounce={120}>
                    <AreaChart data={region.forecast} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="landingFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--urgent)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="var(--urgent)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--popover)",
                          color: "var(--popover-foreground)",
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [`${v}`, "Readiness"]}
                      />
                      <Area
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="readiness"
                        stroke="var(--urgent)"
                        strokeWidth={2}
                        fill="url(#landingFill)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">5-day predicted respiratory strain</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-urgent/25 bg-urgent/8 p-4">
              <p className="eyebrow text-urgent">Recommended action</p>
              <p className="mt-1.5 text-sm font-medium leading-relaxed">
                Restock rescue inhaler supply by Wednesday.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{region.driver}</p>
            </div>
          </div>
        </div>

        {/* Signal marquee */}
        <div className="relative z-10 border-y border-onsky/12 bg-sky-deep/25 py-3.5 backdrop-blur-sm">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="marquee-track flex shrink-0 gap-10 pr-10">
              {[...marquee, ...marquee].map((m, i) => (
                <span
                  key={`${m}-${i}`}
                  className="flex shrink-0 items-center gap-2 whitespace-nowrap text-xs font-medium tracking-wide text-onsky/60"
                >
                  <Activity className="size-3.5" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="defer-paint relative mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <p className="eyebrow text-teal">How it works</p>
          <h2 className="mt-3 max-w-3xl text-balance text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
            The forecast already exists. Aspira turns it into the action worth taking.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 110}
              className="group tile sheen relative p-7 hover:tile-hover"
            >
              <span className="absolute right-5 top-5 num font-display text-4xl font-semibold text-muted/70">
                0{i + 1}
              </span>
              <span className="grid size-11 place-items-center rounded-2xl gradient-teal text-teal-foreground transition-transform duration-500 group-hover:scale-110">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Bento: coverage ---------------- */}
      <section className="defer-paint relative overflow-hidden border-y border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="tile sheen flex flex-col justify-between p-8 hover:tile-hover lg:row-span-2">
              <div>
                <p className="eyebrow text-teal">Community signal layer</p>
                <h2 className="mt-3 text-balance text-4xl leading-[1.05] sm:text-[2.75rem]">
                  Coverage that begins where the sensors end.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Many neighbourhoods have no monitoring station nearby. A ten-second symptom
                  check-in from residents fills that gap and sharpens the hyperlocal prediction
                  exactly where it is weakest. It's a novel combination, not a proven-at-scale
                  technique — its value depends on real adoption.
                </p>
              </div>
              <Link
                to="/community"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal"
              >
                Explore the coverage map
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>

            {[
              { v: "1 in 3", l: "monitored regions have no sensor within 15 km", icon: MapPin },
              { v: "2×", l: "asthma ER visits recorded during major smoke events", icon: HeartPulse },
              { v: "3–5 days", l: "of usable lead time in a typical forecast window", icon: Radar },
              { v: "100%", l: "public data sources — no private feeds required", icon: ShieldCheck },
            ].map((s, i) => (
              <Reveal key={s.v} delay={90 + i * 80} className="tile sheen p-7 hover:tile-hover">
                <s.icon className="size-5 text-teal" />
                <p className="num mt-4 font-display text-3xl font-semibold">{s.v}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Regions strip ---------------- */}
      <section className="defer-paint mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <p className="eyebrow text-teal">Live in the demo</p>
          <h2 className="mt-3 text-balance text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
            Four regions. Four very different weeks of air.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((r, i) => (
            <Reveal key={r.id} delay={i * 80} className="tile sheen p-6 hover:tile-hover">
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.state}</p>
              <p className="num mt-5 font-display text-4xl font-semibold">{r.readiness}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                AQI {r.currentAqi} · {r.sensors === 0 ? "no official sensor" : `${r.sensors} sensors`}
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full gradient-teal transition-[width] duration-700"
                  style={{ width: `${r.readiness}%` }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Audiences ---------------- */}
      <section className="defer-paint border-y border-border bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="text-balance text-4xl sm:text-5xl lg:text-[3.5rem] lg:leading-[1.02]">
              Built for whoever breathes the risk first.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {audiences.map((a, i) => (
              <Reveal key={a.label} delay={i * 100} className="group tile sheen p-7 hover:tile-hover">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <a.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{a.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <Link
                  to={a.to}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal"
                >
                  {a.cta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative overflow-hidden gradient-sky">
        <span
          aria-hidden
          className="aurora-blob absolute -left-20 top-0 size-[28rem] rounded-full"
          style={{ "--aurora-tint": "var(--teal)", opacity: 0.4 } as CSSProperties}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-balance font-display text-5xl leading-[1.03] text-onsky sm:text-6xl">
            Know what next week's air will do — before it does it.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-onsky/75">
            Open the dashboard and follow a region — the readiness score, the driver behind it, and
            the one action worth taking are all on one screen.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-onsky px-6 py-3.5 text-sm font-semibold text-sky-deep lift hover:lift-hover"
            >
              Open the dashboard
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center rounded-xl border border-onsky/25 px-6 py-3.5 text-sm font-medium text-onsky transition-colors hover:bg-onsky/10"
            >
              See prediction accuracy
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter className="bg-background" />
    </div>
  );
}
