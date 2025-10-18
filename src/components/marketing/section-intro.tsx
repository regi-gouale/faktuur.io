import { Badge } from "@/components/ui/badge";
import type { MarketingEyebrow } from "@/lib/types/marketing";
import { cn } from "@/lib/utils";
import { createElement } from "react";

interface SectionIntroProps {
  readonly eyebrow?: MarketingEyebrow;
  readonly title: string;
  readonly description?: string;
  readonly align?: "start" | "center";
  readonly titleTag?: "h1" | "h2" | "h3";
  readonly className?: string;
  readonly titleClassName?: string;
  readonly descriptionClassName?: string;
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "center",
  titleTag = "h2",
  className,
  titleClassName,
  descriptionClassName,
}: SectionIntroProps) {
  const alignmentClass =
    align === "center" ? "mx-auto text-center" : "text-left";
  const baseWidthClass = align === "center" ? "max-w-3xl" : "max-w-3xl";

  return (
    <div className={cn("space-y-6", alignmentClass, baseWidthClass, className)}>
      {eyebrow ? (
        <Badge
          variant={eyebrow.variant ?? "secondary"}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm shadow-primary/10 backdrop-blur",
            eyebrow.className
          )}
        >
          {eyebrow.icon ? (
            <eyebrow.icon
              className={cn("h-3.5 w-3.5 text-primary", eyebrow.iconClassName)}
            />
          ) : null}
          {eyebrow.label}
        </Badge>
      ) : null}

      {createElement(
        titleTag,
        {
          className: cn(
            "text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
            titleClassName
          ),
        },
        title
      )}

      {description ? (
        <p
          className={cn("text-lg text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
