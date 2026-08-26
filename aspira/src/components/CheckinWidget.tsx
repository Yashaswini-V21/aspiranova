import { useState } from "react";
import { Check } from "lucide-react";

import { checkinOptions } from "@/lib/aspira-data";
import { cn } from "@/lib/utils";

export function CheckinWidget({
  regionName,
  emphasized = false,
}: {
  regionName: string;
  emphasized?: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <section
      className={cn(
        "surface p-6 transition-all duration-500",
        emphasized &&
          "scale-[1.015] border-primary/40 shadow-[0_0_0_1px_var(--primary),var(--shadow-card)]",
      )}
    >
      {emphasized ? (
        <p className="mb-3 inline-flex rounded-full border border-primary/30 bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
          Higher weight here — few official sensors nearby
        </p>
      ) : null}
      <p className="eyebrow text-muted-foreground">Community signal</p>
      <h2 className="mt-1 text-lg font-semibold">How's the air treating you today?</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Ten seconds. It sharpens the estimate for everyone near {regionName}.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {checkinOptions.map((o) => (
          <button
            key={o.key}
            onClick={() => setPicked(o.key)}
            className={cn(
              "flex items-center justify-between rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-colors",
              picked === o.key
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {o.label}
            {picked === o.key ? <Check className="size-4" /> : null}
          </button>
        ))}
      </div>
      {picked ? (
        <p className="mt-4 rounded-lg bg-secondary px-3.5 py-3 text-sm text-secondary-foreground">
          Logged. Your check-in joins 142 others near {regionName} in the last 48 hours.
        </p>
      ) : null}
    </section>
  );
}
