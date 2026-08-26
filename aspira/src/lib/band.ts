import { bandOf, type Band } from "./aspira-data";

export const bandStyles: Record<
  Band,
  { text: string; bg: string; ring: string; stroke: string; chip: string }
> = {
  calm: {
    text: "text-calm",
    bg: "bg-calm",
    ring: "border-calm/30",
    stroke: "var(--calm)",
    chip: "bg-calm/10 text-calm border-calm/25",
  },
  watch: {
    text: "text-watch",
    bg: "bg-watch",
    ring: "border-watch/30",
    stroke: "var(--watch)",
    chip: "bg-watch/10 text-watch border-watch/25",
  },
  elevated: {
    text: "text-elevated",
    bg: "bg-elevated",
    ring: "border-elevated/35",
    stroke: "var(--elevated)",
    chip: "bg-elevated/12 text-elevated border-elevated/30",
  },
  urgent: {
    text: "text-urgent",
    bg: "bg-urgent",
    ring: "border-urgent/40",
    stroke: "var(--urgent)",
    chip: "bg-urgent/12 text-urgent border-urgent/30",
  },
};

export function styleFor(score: number) {
  return bandStyles[bandOf(score)];
}
