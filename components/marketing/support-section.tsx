import { SectionIntro } from "@/components/marketing/section-intro";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SupportSection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-background to-background p-10 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <SectionIntro
                eyebrow={{
                  label: "Support inclus",
                  variant: "secondary",
                  className:
                    "border border-border/70 bg-background/80 text-xs uppercase tracking-wide text-primary",
                }}
                title="Besoin d'une configuration personnalisée ?"
                description="Nos experts vous accompagnent pour connecter vos outils existants (CRM, comptabilité, paiement). Déploiement rapide, formation et audit TVA."
                align="start"
                className="max-w-2xl space-y-4"
                titleClassName="text-balance text-3xl font-semibold text-foreground sm:text-4xl"
                descriptionClassName="text-lg text-muted-foreground"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full gap-2 text-base"
                  >
                    Demander un onboarding
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <a
                  href="mailto:bonjour@cotizoo.com"
                  className="text-sm font-medium text-primary transition hover:text-primary/80"
                >
                  Contacter l&apos;équipe →
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-inner shadow-primary/5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-10 text-primary" />
                <div>
                  <p className="text-base font-semibold text-foreground">
                    Gouvernance & conformité
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sauvegardes chiffrées, audit trail et gestion fine des
                    rôles.
                  </p>
                </div>
              </div>
              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Infrastructure hébergée en Europe et supervision 24/7.
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Authentification multifacteur propulsée par Better Auth.
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  Historisation des modifications et rapport TVA automatisé.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
