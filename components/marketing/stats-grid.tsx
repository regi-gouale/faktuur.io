import type { MarketingStat } from "@/lib/types/marketing";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  readonly items: ReadonlyArray<MarketingStat>;
  readonly className?: string;
  readonly columnsClassName?: string;
}

export function StatsGrid({
  items,
  className,
  columnsClassName,
}: StatsGridProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
        columnsClassName,
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border/70 bg-background/90 p-6 text-center shadow-sm shadow-primary/5"
        >
          <p className="text-4xl font-semibold text-primary sm:text-5xl">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
