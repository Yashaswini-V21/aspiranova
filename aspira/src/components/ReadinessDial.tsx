import { memo, useEffect, useRef } from "react";

import { useCountUp } from "@/hooks/use-count-up";
import { bandLabel, bandOf } from "@/lib/aspira-data";
import { styleFor } from "@/lib/band";
import { cn } from "@/lib/utils";

type Props = {
  score: number;
  size?: number;
  className?: string;
  caption?: string;
};

/**
 * The arc draws via stroke-dashoffset on a single path and the score counts
 * up through a DOM ref, so the whole animation runs with zero React renders
 * after mount.
 */
function ReadinessDialBase({ score, size = 176, className, caption }: Props) {
  const s = styleFor(score);
  const band = bandOf(score);
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75; // three-quarter dial
  const target = arc * (1 - score / 100);

  const arcRef = useRef<SVGCircleElement | null>(null);
  const numberRef = useCountUp<HTMLSpanElement>(score, 1200);

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.style.strokeDashoffset = String(target);
    });
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <span
          className="pulse-ring absolute inset-[10%] rounded-full"
          style={{ background: s.stroke, opacity: 0.07 }}
          aria-hidden
        />
        <svg width={size} height={size} className="relative -rotate-[225deg]" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${c}`}
          />
          <circle
            ref={arcRef}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arc} ${c}`}
            strokeDashoffset={arc}
            style={{ transition: "stroke-dashoffset 1.3s var(--ease-out-soft)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={numberRef}
            className={cn("num text-5xl font-semibold tabular-nums", s.text)}
            aria-label={`Readiness score ${score}, ${bandLabel[band]}`}
          >
            0
          </span>
          <span className="eyebrow mt-1 text-muted-foreground">{bandLabel[band]}</span>
        </div>
      </div>
      {caption ? (
        <p className="mt-1 text-center text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

export const ReadinessDial = memo(ReadinessDialBase);
