import { HighlightPills } from '@/components/marketing/highlight-pills';
import { SectionIntro } from '@/components/marketing/section-intro';
import { StatsGrid } from '@/components/marketing/stats-grid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildMarketingMetadata } from '@/lib/metadata';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Globe,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = buildMarketingMetadata({
  title: 'À propos de faktuur.io - Notre mission pour simplifier votre gestion',
  description:
    'Découvrez notre histoire, notre vision produit et les personnes qui construisent faktuur.io pour les freelances, agences et TPE.',
  keywords: [
    'à propos faktuur.io',
    'mission faktuur.io',
    'équipe faktuur.io',
    'startup facturation freelance',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'À propos de faktuur.io',
    description:
      'Une équipe produit engagée pour simplifier la facturation et le suivi de trésorerie des indépendants.',
    url: '/about',
  },
});

const heroHighlights = [
  // "Née en 2025",
  'Basée en France',
  'Support humain inclus',
] as const;

const stats = [
  { value: '10K+', label: 'Entrepreneurs accompagnés' },
  { value: '500K+', label: 'Documents générés' },
  { value: '99,9%', label: 'Disponibilité plateforme' },
  { value: '4,9/5', label: 'Satisfaction client' },
] as const;

const values = [
  {
    icon: HeartHandshake,
    title: 'Simplicité radicale',
    description:
      "Chaque écran est conçu pour que l'action principale soit évidente et réalisable en moins de 30 secondes.",
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité by design',
    description:
      'Chiffrement, hébergement européen et conformité RGPD intégrée. Vos données ne quittent jamais un environnement contrôlé.',
  },
  {
    icon: Lightbulb,
    title: 'Écoute produit',
    description:
      "Chaque trimestre, nous priorisons nos sprints avec notre communauté d'utilisateurs pour livrer ce qui compte vraiment.",
  },
  {
    icon: Users,
    title: 'Relation longue durée',
    description:
      'Support humain réactif, onboarding guidé et ressources pédagogiques pour faire grandir votre activité.',
  },
] satisfies Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}>;

const milestones = [
  {
    year: '2023',
    title: 'Lancement public',
    description:
      'Première version ouverte aux freelances avec génération de devis et factures conformes. 300 comptes créés le premier mois.',
  },
  {
    year: '2024',
    title: 'Automations & TVA',
    description:
      'Ajout des relances intelligentes, du suivi de trésorerie et du moteur de TVA multi-activités compatible micro et régime réel.',
  },
  {
    year: '2025',
    title: 'Expansion agences',
    description:
      "Interface collaborative, rôles avancés et intégrations API pour les studios et collectifs qui opèrent à l'international.",
  },
] as const;

const teamMembers = [
  {
    name: 'Sarah Martin',
    role: 'CEO & Co-fondatrice',
    focus: 'Vision produit et expérience utilisateur',
  },
  {
    name: 'Thomas Dubois',
    role: 'CTO & Co-fondateur',
    focus: 'Architecture, sécurité et performances',
  },
  {
    name: 'Marie Laurent',
    role: 'Head of Product',
    focus: 'Discovery, roadmap et design system',
  },
  {
    name: 'Alexandre Chen',
    role: 'Head of Support',
    focus: 'Succès client, formation et communauté',
  },
] as const;

const commitments = [
  {
    title: 'Fabrication responsable',
    description:
      'Infrastructure alimentée par des datacenters européens à faible empreinte carbone et monitoring continu de notre consommation.',
  },
  {
    title: 'Ouverture des processus',
    description:
      'Roadmap publique, changelog détaillé et retours utilisateurs intégrés dans chaque sprint.',
  },
  {
    title: 'Écosystème connecté',
    description:
      'Connecteurs natifs avec les outils comptables, CRM et paiement leaders du marché pour fluidifier vos flux.',
  },
] as const;

export default function AboutPage() {
  return (
    <div className="space-y-24 pt-24 pb-24">
      <section className="relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center gap-10 px-4 text-center lg:px-8">
          <SectionIntro
            eyebrow={{
              label: 'Notre histoire',
              icon: Sparkles,
              variant: 'outline',
              className: 'border-border/80 bg-background/80 text-muted-foreground',
            }}
            title="Simplifier la gestion administrative à l'échelle humaine"
            description="faktuur.io est né d'une conviction simple : les freelances et petites équipes méritent une expérience de facturation aussi aboutie que les meilleurs produits SaaS."
            align="center"
            titleTag="h1"
            className="max-w-4xl"
            titleClassName="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            descriptionClassName="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl"
          />
          <HighlightPills items={heroHighlights} />
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <StatsGrid items={stats} />
      </section>

      <section className="relative">
        <div className="from-primary/5 absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b via-transparent to-transparent" />
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <Card className="border-border/70 bg-background/95 shadow-primary/10 shadow-lg">
            <CardHeader>
              <Badge
                variant="outline"
                className="border-border/70 bg-background/80 text-muted-foreground w-fit rounded-full text-xs font-medium tracking-wide uppercase"
              >
                Pourquoi Cotizoo ?
              </Badge>
              <CardTitle className="text-foreground text-3xl font-semibold">
                Une suite pensée pour vous faire gagner 10 heures par mois
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm leading-6">
              <p>
                Après des années à naviguer entre outils cloisonnés, nos fondateurs ont décidé de
                créer une plateforme qui concilie conformité, design et automatisation.
              </p>
              <p>
                Nous collaborons chaque semaine avec un panel d&apos;utilisateurs pour valider
                chaque fonctionnalité, du calcul de TVA aux relances intelligentes.
              </p>
              <p>
                Notre promesse : une expérience fluide, que vous soyez en solo, en collectif ou à la
                tête d&apos;une agence qui facture des dizaines de clients.
              </p>
            </CardContent>
          </Card>
          <div className="space-y-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="border-border/70 bg-background/90 shadow-primary/5 rounded-2xl border p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/10 text-primary rounded-full">
                    {milestone.year}
                  </Badge>
                  <h3 className="text-foreground text-lg font-medium">{milestone.title}</h3>
                </div>
                <p className="text-muted-foreground mt-3 text-sm">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <SectionIntro
          eyebrow={{
            label: 'Nos valeurs',
            variant: 'secondary',
            className:
              'border border-border/70 bg-background/90 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary',
          }}
          title="Un socle produit solide pour des indépendants sereins"
          description="Nous construisons des fonctionnalités robustes mais accessibles, pour que vous puissiez facturer, suivre et relancer sans friction."
          className="mx-auto max-w-3xl"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <Card
              key={value.title}
              className="group border-border/70 bg-background/90 shadow-primary/5 hover:border-primary/50 hover:shadow-primary/10 relative overflow-hidden border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="border-primary/30 bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full border">
                <value.icon className="size-5" />
              </div>
              <CardHeader className="px-0 pt-6">
                <CardTitle className="text-foreground text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-0">
                <CardDescription className="text-muted-foreground text-sm leading-6">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionIntro
            eyebrow={{
              label: 'Rencontrez l&apos;équipe',
              variant: 'outline',
              className:
                'border-border/70 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground',
            }}
            title="Des profils produits, tech et customer success embarqués"
            description="Une équipe resserrée qui expédie vite, écoute et accompagne chaque client avec soin."
            className="mx-auto max-w-3xl"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {teamMembers.map((member) => (
              <Card
                key={member.name}
                className="border-border/70 bg-background/95 shadow-primary/5 border p-6 text-center shadow-sm"
              >
                <div className="border-border/60 bg-muted/40 mx-auto flex h-20 w-20 items-center justify-center rounded-full border">
                  <Users className="text-muted-foreground size-10" />
                </div>
                <CardHeader className="px-0 pt-6">
                  <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground px-0 pt-0 text-sm">
                  {member.focus}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {commitments.map((commitment, index) => (
            <Card
              key={commitment.title}
              className="border-border/70 bg-background/95 shadow-primary/5 relative overflow-hidden border p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/10 text-primary rounded-full">0{index + 1}</Badge>
                <h3 className="text-foreground text-lg font-medium">{commitment.title}</h3>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">{commitment.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8">
        <div className="border-border/60 from-primary/15 via-background to-background shadow-primary/10 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-10 text-center shadow-xl backdrop-blur">
          <div className="mx-auto max-w-3xl space-y-6">
            <SectionIntro
              eyebrow={{
                label: 'Rejoindre la communauté',
                variant: 'secondary',
                className:
                  'border border-border/60 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary',
              }}
              title="Construisons la prochaine génération de facturation ensemble"
              description="Onboardez-vous en quelques minutes, connectez vos premiers clients et laissez les automations faire le reste."
              className="space-y-6"
            />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 text-base">
                  Commencer gratuitement
                  <ArrowRight className="size-5" />
                </Button>
              </Link>
              <Link href="mailto:bonjour@cotizoo.com" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full gap-2 text-base">
                  Échanger avec l&apos;équipe
                  <Globe className="size-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
