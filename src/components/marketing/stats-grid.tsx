import type { MarketingStat } from '@/lib/types/marketing';
import { cn } from '@/lib/utils';

interface StatsGridProps {
  readonly items: ReadonlyArray<MarketingStat>;
  readonly className?: string;
  readonly columnsClassName?: string;
}

export function StatsGrid({ items, className, columnsClassName }: StatsGridProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-4', columnsClassName, className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="border-border/70 bg-background/90 shadow-primary/5 rounded-2xl border p-6 text-center shadow-sm"
        >
          <p className="text-primary text-4xl font-semibold sm:text-5xl">{item.value}</p>
          <p className="text-muted-foreground mt-2 text-sm">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
