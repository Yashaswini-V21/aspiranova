import { memo, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

type Orb = {
  tint: string;
  className: string;
  opacity: number;
  duration: string;
  delay: string;
  alt?: boolean;
};

const orbs: Orb[] = [
  {
    tint: "var(--teal)",
    className: "-left-[12%] top-[6%] size-[46rem]",
    opacity: 0.34,
    duration: "38s",
    delay: "0s",
  },
  {
    tint: "var(--violet)",
    className: "right-[-10%] top-[-8%] size-[40rem]",
    opacity: 0.26,
    duration: "44s",
    delay: "-11s",
    alt: true,
  },
  {
    tint: "var(--cyan)",
    className: "left-[28%] bottom-[-14%] size-[38rem]",
    opacity: 0.22,
    duration: "52s",
    delay: "-23s",
    alt: true,
  },
  {
    tint: "var(--ember)",
    className: "right-[16%] bottom-[2%] size-[28rem]",
    opacity: 0.16,
    duration: "46s",
    delay: "-7s",
  },
];

/**
 * Full-bleed animated mesh field. Purely decorative, fixed and contained so it
 * never participates in layout and only ever costs a compositor transform.
 */
export const Atmosphere = memo(function Atmosphere() {
  return (
    <>
      <div aria-hidden className="mesh-field">
        {orbs.map((o) => (
          <span
            key={o.tint + o.className}
            className={cn("mesh-orb", o.alt && "mesh-orb-alt", o.className)}
            style={
              {
                "--orb": o.tint,
                "--orb-opacity": o.opacity,
                "--orb-dur": o.duration,
                "--orb-delay": o.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div aria-hidden className="grain" />
    </>
  );
});
