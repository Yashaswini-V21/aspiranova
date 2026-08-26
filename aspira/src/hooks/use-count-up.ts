import { useEffect, useRef } from "react";

/**
 * Eases a number from 0 to `target` by writing straight into a DOM node.
 * Deliberately avoids state: a 60fps counter driven by setState would
 * re-render its whole subtree ~70 times per reveal.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  duration = 1100,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = String(target);
      return;
    }

    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return ref;
}
