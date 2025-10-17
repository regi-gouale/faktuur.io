import { HighlightPills } from "@/components/marketing/highlight-pills";
import { SectionIntro } from "@/components/marketing/section-intro";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const heroHighlights = [
    "Sans engagement",
    "Support humain inclus",
    "Données sécurisées en France",
  ] as const;

  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 pb-24 pt-24 text-center md:pb-32 md:pt-32 lg:px-8">
        <SectionIntro
          eyebrow={{
            label:
              "Nouveautés 2025 • Export PDF enrichi et automations avancées",
            icon: Sparkles,
            variant: "outline",
            className:
              "border-border/80 bg-background/80 text-muted-foreground",
          }}
          title="Gérez devis et factures avec la même exigence que vos missions"
          description="faktuur.io vous offre un cockpit Vercel-like pour piloter vos ventes, consolider votre trésorerie et offrir une expérience premium à vos clients."
          align="center"
          titleTag="h1"
          className="max-w-4xl"
          titleClassName="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          descriptionClassName="mx-auto max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl"
        />
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 text-base">
              Essayer gratuitement
              <ArrowRight className="size-5" />
            </Button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="ghost"
              className="w-full gap-2 text-base"
            >
              Découvrir l&apos;interface
              <Sparkles className="size-5" />
            </Button>
          </Link>
        </div>
        <HighlightPills items={heroHighlights} className="pt-6" />
      </div>
    </section>
  );
}
