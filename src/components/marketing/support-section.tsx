import { SectionIntro } from '@/components/marketing/section-intro';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SupportSection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="border-border/60 from-primary/15 via-background to-background shadow-primary/10 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-10 shadow-xl backdrop-blur">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <SectionIntro
                eyebrow={{
                  label: 'Support inclus',
                  variant: 'secondary',
                  className:
                    'border border-border/70 bg-background/80 text-xs uppercase tracking-wide text-primary',
                }}
                title="Besoin d'une configuration personnalisée ?"
                description="Nos experts vous accompagnent pour connecter vos outils existants (CRM, comptabilité, paiement). Déploiement rapide, formation et audit TVA."
                align="start"
                className="max-w-2xl space-y-4"
                titleClassName="text-balance text-3xl font-semibold text-foreground sm:text-4xl"
                descriptionClassName="text-lg text-muted-foreground"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full gap-2 text-base">
                    Demander un onboarding
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <a
                  href="mailto:bonjour@cotizoo.com"
                  className="text-primary hover:text-primary/80 text-sm font-medium transition"
                >
                  Contacter l&apos;équipe →
                </a>
              </div>
            </div>
            <div className="border-border/60 bg-background/80 shadow-primary/5 rounded-2xl border p-6 shadow-inner">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary size-10" />
                <div>
                  <p className="text-foreground text-base font-semibold">
                    Gouvernance & conformité
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Sauvegardes chiffrées, audit trail et gestion fine des rôles.
                  </p>
                </div>
              </div>
              <ul className="text-muted-foreground mt-6 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="bg-primary h-2.5 w-2.5 rounded-full" />
                  Infrastructure hébergée en Europe et supervision 24/7.
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary h-2.5 w-2.5 rounded-full" />
                  Authentification multifacteur propulsée par Better Auth.
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-primary h-2.5 w-2.5 rounded-full" />
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
