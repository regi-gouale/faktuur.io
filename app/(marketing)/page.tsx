import { HighlightPills } from "@/components/marketing/highlight-pills";
import { SectionIntro } from "@/components/marketing/section-intro";
import { StructuredData } from "@/components/seo/structured-data";
import { LandingHeaderActions } from "@/components/shared/landing-header-actions";
import { SiteFooter } from "@/components/shared/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { marketingMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import { IconInvoice } from "@tabler/icons-react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GaugeCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";

export const metadata: Metadata = marketingMetadata;

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/about", label: "À propos" },
] as const;

const heroHighlights = [
  "Sans engagement",
  "Support humain inclus",
  "Données sécurisées en France",
] as const;

const featureCards = [
  {
    title: "Devis & Factures",
    description:
      "Créez des documents conformes et transformez vos devis en factures sans friction.",
    badge: "Documents conformes",
    icon: FileText,
  },
  {
    title: "Gestion clients",
    description:
      "Centralisez vos contacts, automatisez les suivis et gardez l'historique complet des échanges.",
    badge: "CRM intégré",
    icon: Users,
  },
  {
    title: "Statistiques en direct",
    description:
      "Surveillez vos revenus, votre récurrence et vos taux de conversion en un coup d'œil.",
    badge: "Tableau de bord",
    icon: BarChart3,
  },
  {
    title: "Envoi intelligent",
    description:
      "Expédiez vos devis et factures par email en respectant votre branding et vos mentions légales.",
    badge: "Email automatique",
    icon: Zap,
  },
  {
    title: "Export & archivage",
    description:
      "Générez des PDF impeccables, archivez vos documents et préparez vos déclarations fiscales.",
    badge: "PDF haute fidélité",
    icon: GaugeCircle,
  },
  {
    title: "Sécurité by design",
    description:
      "Données chiffrées, conformité RGPD et authentification forte grâce à Better Auth.",
    badge: "Conformité RGPD",
    icon: ShieldCheck,
  },
] satisfies Array<{
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
}>;

const workflowSteps = [
  {
    title: "Créer",
    description:
      "Composez vos devis en quelques secondes avec des produits réutilisables et la TVA automatique.",
  },
  {
    title: "Partager",
    description:
      "Envoyez un lien sécurisé ou un PDF personnalisé et suivez la lecture en temps réel.",
  },
  {
    title: "Encaisser",
    description:
      "Relances programmées, statut des paiements et export comptable prêts pour votre expert-comptable.",
  },
] as const;

export default async function Home() {
  // Récupérer la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si connecté, récupérer l'organisation par défaut
  let orgSlug: string | undefined;
  if (session?.user?.id) {
    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    orgSlug = membership?.organization?.slug ?? undefined;
  }
  return (
    <>
      <StructuredData />
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-[radial-gradient(circle_at_top,_theme(colors.primary/20),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_theme(colors.primary/15),_transparent_60%)]" />

        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition group-hover:bg-primary/15">
                <IconInvoice className="size-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold">faktuur.io</span>
                <span className="text-xs font-medium text-muted-foreground">
                  Facturation moderne pour freelances
                </span>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <LandingHeaderActions
              user={
                session?.user
                  ? {
                      name: session.user.name,
                      email: session.user.email,
                      image: session.user.image ?? undefined,
                    }
                  : null
              }
              orgSlug={orgSlug}
            />
          </div>
        </header>

        <main className="flex-1">
          <section className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 via-transparent to-transparent dark:from-primary/15" />
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

          <section
            id="features"
            className="relative border-t border-border/80 bg-muted/40 py-24"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background via-muted/40 to-transparent" />
            <div className="container mx-auto px-4 lg:px-8">
              <SectionIntro
                title="Une stack complète pour votre gestion commerciale"
                description="Chaque module a été pensé pour réduire les actions manuelles, limiter les erreurs et valoriser votre image de marque."
                className="max-w-3xl"
              />
              <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featureCards.map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/90 p-6 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition group-hover:border-primary/50 group-hover:bg-primary/15">
                      <feature.icon className="size-5" />
                    </div>
                    <div className="mt-6 space-y-3">
                      <Badge
                        variant="outline"
                        className="w-fit rounded-full border-border/80 bg-background/80 text-xs font-medium uppercase tracking-wide text-muted-foreground/90"
                      >
                        {feature.badge}
                      </Badge>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                      En savoir plus
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative py-24">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-muted/40 via-background to-transparent" />
            <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
              <div className="flex flex-col gap-6">
                <SectionIntro
                  eyebrow={{
                    label: "Workflow guidé",
                    variant: "outline",
                    className: "border-primary/30 bg-primary/10 text-primary",
                  }}
                  title="Une expérience inspirée des produits Vercel"
                  description="De la première estimation à l'encaissement, chaque étape est orchestrée pour vous permettre de livrer vite tout en gardant le contrôle sur vos flux financiers."
                  align="start"
                  className="max-w-xl"
                  titleClassName="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                  descriptionClassName="text-lg text-muted-foreground"
                />
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm shadow-primary/5"
                    >
                      <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                        0{index + 1}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-medium text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
                <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background/80 p-6 shadow-xl shadow-primary/10 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Vue d&apos;ensemble
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      Temps réel
                    </span>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          Revenus MRR
                        </span>
                        <span className="text-xs font-semibold text-emerald-500">
                          +18%
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        7 540 €
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {[
                        {
                          label: "Devis signés",
                          value: "36",
                        },
                        {
                          label: "Factures payées",
                          value: "18",
                        },
                        {
                          label: "Paiements en retard",
                          value: "2",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-xl border border-border/70 bg-background/90 px-4 py-3"
                        >
                          <span className="text-sm font-medium text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-primary/10 p-4 text-primary">
                      <div>
                        <p className="text-sm font-medium">
                          Automations actives
                        </p>
                        <p className="text-xs text-primary/70">
                          Relances intelligentes tous les 7 jours
                        </p>
                      </div>
                      <Zap className="size-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
                        Historisation des modifications et rapport TVA
                        automatisé.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
