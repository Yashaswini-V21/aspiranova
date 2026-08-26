import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

/**
 * One shared IntersectionObserver for every reveal on the page, and the
 * class flip happens straight on the DOM node — no React state, so an
 * element entering the viewport never re-renders the tree around it.
 */
let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer?.unobserve(el);
        el.classList.add("reveal-in");
        el.addEventListener(
          "animationend",
          () => {
            // Release the GPU layer once the one-shot entrance is done.
            el.classList.add("reveal-done");
          },
          { once: true },
        );
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  return observer;
}

export function Reveal({ children, delay = 0, as, className }: Props) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getObserver();
    if (!io) {
      el.classList.add("reveal-in", "reveal-done");
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
