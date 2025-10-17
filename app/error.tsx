"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ClipboardCopy,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleCopyDigest = async () => {
    if (
      !error.digest ||
      typeof navigator === "undefined" ||
      !("clipboard" in navigator)
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(error.digest);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.warn("Unable to copy error digest", copyError);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-10rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.1),_transparent_70%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-destructive/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 size-[360px] rounded-full bg-primary/10 blur-3xl" />
      </div>
      <Empty className="relative z-10 mx-auto w-full max-w-xl rounded-3xl border border-border/60 bg-card/85 p-12 text-center shadow-2xl backdrop-blur">
        <EmptyMedia
          variant="icon"
          className="size-20 rounded-2xl bg-destructive/10 text-destructive"
        >
          <AlertTriangle className="size-10" aria-hidden="true" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle className="text-3xl font-semibold">
            Quelque chose s’est mal passé
          </EmptyTitle>
          <EmptyDescription className="text-base leading-relaxed">
            {error.message ||
              "Une erreur inattendue est survenue. Réessayez ou tentez une autre action."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="mt-4 flex w-full max-w-sm flex-wrap justify-center">
            <Button onClick={() => reset()} size="lg">
              <RefreshCw className="size-4" aria-hidden="true" />
              Réessayer
            </Button>
            <Button asChild size="lg" variant="link">
              <Link href="/">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Retour à l’accueil
              </Link>
            </Button>
          </div>

          <Item variant="muted" className="mt-6 rounded-xl">
            <ItemMedia>
              <AlertTriangle
                className="size-6 text-destructive"
                aria-hidden="true"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Besoin d’un coup de main&nbsp;?</ItemTitle>
              <ItemDescription>
                Consultez la base de connaissances ou contactez votre
                administrateur pour obtenir une aide rapide.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/support">Ouvrir le support</Link>
              </Button>
            </ItemActions>
          </Item>

          {(error.digest || error.message) && (
            <details className="group mt-6 w-full text-left">
              <summary className="cursor-pointer text-xs font-medium uppercase tracking-wide text-muted-foreground/70 transition-colors group-open:text-muted-foreground">
                Voir les détails techniques
              </summary>
              <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4">
                {error.message && (
                  <Item variant="outline" size="sm" className="rounded-lg">
                    <ItemContent>
                      <ItemTitle>Message d’erreur</ItemTitle>
                      <ItemDescription className="!text-xs !leading-relaxed">
                        {error.message}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                )}

                {error.digest && (
                  <InputGroup className="rounded-xl">
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>Référence</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      readOnly
                      value={error.digest}
                      aria-label="Identifiant d’erreur"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Copier la référence"
                        onClick={handleCopyDigest}
                      >
                        <ClipboardCopy className="size-4" aria-hidden="true" />
                      </InputGroupButton>
                      <InputGroupText className="text-xs text-muted-foreground">
                        {copied ? "Copié" : "Copier"}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                )}
              </div>
            </details>
          )}
        </EmptyContent>
      </Empty>
    </main>
  );
}
