import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import { IconLifebuoy, IconMapQuestion } from '@tabler/icons-react';
import { ArrowLeft, ChevronRightIcon, Compass, FileSearch } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_65%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-primary/10 absolute top-10 -left-24 size-[420px] rounded-full blur-3xl" />
        <div className="bg-muted/20 dark:bg-muted/10 absolute -right-32 bottom-0 size-[320px] rounded-full blur-3xl" />
      </div>
      <Empty className="border-border/60 bg-card/85 relative z-10 mx-auto w-full max-w-xl rounded-3xl border p-12 text-center shadow-2xl backdrop-blur">
        <EmptyMedia>
          <FileSearch className="text-primary size-20" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-primary text-2xl">404 - Page introuvable</EmptyTitle>
          <EmptyDescription className="text-muted-foreground mt-4 text-base leading-relaxed">
            Nous n&apos;avons pas pu localiser la ressource demandée. Elle a peut-être été déplacée
            ou supprimée.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Item
            variant={'default'}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild size="lg">
              <Link href="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Retour à l’accueil
              </Link>
            </Button>
            <Button asChild size="lg" variant="link">
              <Link href="/pricing">
                <Compass className="size-4" aria-hidden="true" />
                Découvrir nos offres
              </Link>
            </Button>
          </Item>
          <EmptyDescription>
            {/* Need help? <a href="#">Contact support</a> */}
            <div className="text-muted-foreground space-y-3 text-left text-sm">
              <Item variant={'muted'} className="rounded-xl">
                <ItemMedia>
                  <IconMapQuestion className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemContent>
                    <ItemTitle>
                      Contrôlez l’orthographe de l’URL ou utilisez la navigation principale.
                    </ItemTitle>
                  </ItemContent>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="ghost" className="cursor-auto" asChild>
                    <Link href="/">
                      <ChevronRightIcon className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </ItemActions>
              </Item>
              <Item variant={'muted'} className="rounded-xl">
                <ItemMedia>
                  <IconLifebuoy className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemContent>
                    <ItemTitle>
                      Besoin d’un coup de main&nbsp;? Contactez notre équipe pour obtenir de
                      l&apos;aide.
                    </ItemTitle>
                  </ItemContent>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="ghost" className="cursor-auto" asChild>
                    <Link href="/contact-us">
                      <ChevronRightIcon className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </ItemActions>
              </Item>
            </div>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </main>
  );
}
