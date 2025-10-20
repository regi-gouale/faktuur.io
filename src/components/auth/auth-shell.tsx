import { SectionIntro } from '@/components/marketing/section-intro';
import type { MarketingEyebrow } from '@/lib/types/marketing';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AuthShellProps {
  readonly eyebrow?: MarketingEyebrow;
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
  readonly className?: string;
  readonly contentClassName?: string;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  className,
  contentClassName,
}: AuthShellProps) {
  return (
    <div
      className={cn(
        'mx-auto my-32 flex w-full max-w-5xl flex-col items-center gap-10 px-4 text-center',
        className
      )}
    >
      <SectionIntro
        eyebrow={eyebrow}
        title={title}
        description={description}
        align="center"
        titleTag="h1"
        className="w-full max-w-2xl"
        titleClassName="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        descriptionClassName="text-base text-muted-foreground sm:text-lg"
      />
      <div className={cn('w-full max-w-lg', contentClassName)}>{children}</div>
    </div>
  );
}
