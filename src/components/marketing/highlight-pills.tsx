import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HighlightPillsProps {
  readonly items: ReadonlyArray<string>;
  readonly className?: string;
  readonly badgeClassName?: string;
}

export function HighlightPills({
  items,
  className,
  badgeClassName,
}: HighlightPillsProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3",
        className
      )}
    >
      {items.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className={cn(
            "rounded-full border border-border/70 bg-background/90 px-4 py-2 text-sm font-normal text-muted-foreground",
            badgeClassName
          )}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}
