import { HighlightPills } from "@/components/marketing/highlight-pills";
import { SectionIntro } from "@/components/marketing/section-intro";
import { FAQStructuredData } from "@/components/seo/faq-structured-data";
import { PricingStructuredData } from "@/components/seo/pricing-structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import Link from "next/link";

type Plan = {
  readonly name: string;
  readonly price: string;
  readonly period: string;
  readonly description: string;
  readonly popular?: boolean;
  readonly ctaLabel: string;
  readonly features: ReadonlyArray<{
    name: string;
    included: boolean;
  }>;
};

const plans = [
  {
    name: "Starter",
    price: "0€",
    period: "/mois",
    description:
      "Idéal pour valider votre offre et facturer vos premiers clients",
    ctaLabel: "Créer mon compte",
    features: [
      { name: "5 devis & factures par mois", included: true },
      { name: "10 clients maximum", included: true },
      { name: "Exports PDF basiques", included: true },
      { name: "Relances manuelles", included: true },
      { name: "Automations intelligentes", included: false },
      { name: "Personnalisation avancée", included: false },
      { name: "Support prioritaire", included: false },
    ],
  },
  {
    name: "Pro",
    price: "29€",
    period: "/mois",
    description: "Le cockpit complet pour freelances et studios en croissance",
    popular: true,
    ctaLabel: "Démarrer la période d'essai",
    features: [
      { name: "Documents illimités", included: true },
      { name: "Clients illimités", included: true },
      { name: "Exports PDF premium", included: true },
      { name: "Automations et relances smart", included: true },
      { name: "Dashboard trésorerie en temps réel", included: true },
      { name: "3 utilisateurs inclus", included: true },
      { name: "Support prioritaire", included: true },
    ],
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Solution sur-mesure pour les équipes finance et operations",
    ctaLabel: "Parler à un expert",
    features: [
      { name: "Tout le plan Pro", included: true },
      { name: "Utilisateurs illimités", included: true },
      { name: "API et webhooks avancés", included: true },
      { name: "Intégrations comptables personnalisées", included: true },
      { name: "SLA & support 24/7", included: true },
      { name: "Hébergement dédié", included: true },
      { name: "Audit de sécurité annuel", included: true },
    ],
  },
] satisfies ReadonlyArray<Plan>;

const heroHighlights = [
  "Sans engagement",
  "Support humain",
  "Mises à jour incluses",
] as const;

const billingGuarantees = [
  {
    title: "Facturation flexible",
    description:
      "Changez de plan en fonction de vos missions. La facturation est recalculée automatiquement au prorata.",
  },
  {
    title: "Accompagnement expert",
    description:
      "Onboarding personnalisé, support prioritaire en plan Pro et équipe dédiée pour les comptes Entreprise.",
  },
  {
    title: "Évolution continue",
    description:
      "De nouvelles intégrations, exports et automations sont livrées chaque mois sans surcoût.",
  },
] as const;

const faq = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer:
      "Oui, l'upgrade ou le downgrade est immédiat. Nous recalculons automatiquement votre facturation au prorata.",
  },
  {
    question: "Y a-t-il un engagement ?",
    answer:
      "Non, tous nos plans sont mensuels sans engagement de durée. Vous pouvez partir quand vous le souhaitez.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer:
      "Cartes bancaires Visa, Mastercard, Amex. Virements SEPA disponibles pour les plans Entreprise.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Infrastructure chiffrée, hébergement en Europe, sauvegardes quotidiennes et conformité RGPD native.",
  },
  {
    question: "Le plan Starter est-il vraiment gratuit ?",
    answer:
      "Oui, aucun moyen de paiement n'est requis. Vous pouvez passer au plan Pro quand vous êtes prêt.",
  },
] as const;

const comparisonMetrics = [
  {
    label: "Documents mensuels",
    starter: "5",
    pro: "Illimités",
    enterprise: "Illimités",
  },
  {
    label: "Automations de relance",
    starter: "Manuelles",
    pro: "Smart + personnalisables",
    enterprise: "Playbooks dédiés",
  },
  {
    label: "Exports comptables",
    starter: "CSV",
    pro: "FEC + PDF avancé",
    enterprise: "Connecteurs ERP",
  },
  {
    label: "Support",
    starter: "Email 48h",
    pro: "Email & chat 4h",
    enterprise: "Support dédié 24/7",
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <PricingStructuredData plans={plans} />
      <FAQStructuredData />
      <div className="space-y-24 pb-24 pt-24">
        <section className="relative overflow-hidden">
          <div className="container mx-auto flex flex-col items-center gap-10 px-4 text-center lg:px-8">
            <SectionIntro
              eyebrow={{
                label: "Tarification transparente",
                icon: Sparkles,
                variant: "outline",
                className:
                  "border-border/80 bg-background/80 text-muted-foreground",
              }}
              title="Des plans pensés pour chaque étape de votre croissance"
              description="Démarrez gratuitement, débloquez les automations, exports comptables et dashboards avancés dès que votre activité s'accélère."
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
          <div className="grid gap-6 md:grid-cols-3">
            {billingGuarantees.map((guarantee) => (
              <Card
                key={guarantee.title}
                className="border border-border/70 bg-background/95 p-6 shadow-sm shadow-primary/5"
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {guarantee.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pt-2 text-sm text-muted-foreground">
                  {guarantee.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col overflow-hidden border border-border/70 bg-background/95 p-6 shadow-sm shadow-primary/5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${
                  plan.popular ? "ring-2 ring-primary/40" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute right-6 top-6 rounded-full bg-primary text-primary-foreground">
                    Le plus choisi
                  </Badge>
                )}
                <CardHeader className="px-0 pb-6">
                  <CardTitle className="text-2xl font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 px-0">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        {feature.included ? (
                          <Check className="mt-0.5 size-4 text-emerald-500" />
                        ) : (
                          <X className="mt-0.5 size-4 text-muted-foreground/50" />
                        )}
                        <span
                          className={
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="mt-8">
                  <Link
                    href={
                      plan.name === "Entreprise"
                        ? "mailto:bonjour@cotizoo.com"
                        : "/register"
                    }
                    className="block"
                  >
                    <Button
                      size="lg"
                      className="w-full gap-2 text-base"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.ctaLabel}
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-lg shadow-primary/10">
            <div className="space-y-6 p-8">
              <SectionIntro
                eyebrow={{
                  label: "Comparatif rapide",
                  variant: "outline",
                  className:
                    "w-fit rounded-full border-border/70 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground",
                }}
                title="Toutes les fonctionnalités Pro, plus l'accompagnement dont vous avez besoin"
                description="Le plan Pro concentre nos meilleures automations : relances intelligentes, paiements suivis, exports comptables prêts pour votre expert. La formule Entreprise ajoute l'API et un support dédié."
                align="start"
                className="max-w-3xl"
                titleClassName="text-balance text-2xl font-semibold text-foreground"
                descriptionClassName="text-sm leading-6 text-muted-foreground"
              />
            </div>
            <div className="overflow-x-auto border-t border-border/70">
              <table className="w-full min-w-[640px] border-separate border-spacing-y-2 px-4 py-6 text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="rounded-l-xl bg-muted/40 px-4 py-3 text-muted-foreground">
                      Fonctionnalité
                    </th>
                    <th className="bg-muted/40 px-4 py-3 text-muted-foreground">
                      Starter
                    </th>
                    <th className="bg-muted/40 px-4 py-3 text-muted-foreground">
                      Pro
                    </th>
                    <th className="rounded-r-xl bg-muted/40 px-4 py-3 text-muted-foreground">
                      Entreprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMetrics.map((metric) => (
                    <tr key={metric.label} className="text-muted-foreground">
                      <td className="rounded-l-xl bg-background px-4 py-3 font-medium text-foreground">
                        {metric.label}
                      </td>
                      <td className="bg-background px-4 py-3">
                        {metric.starter}
                      </td>
                      <td className="bg-background px-4 py-3">{metric.pro}</td>
                      <td className="rounded-r-xl bg-background px-4 py-3">
                        {metric.enterprise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8">
          <SectionIntro
            eyebrow={{
              label: "Questions fréquentes",
              variant: "secondary",
              className:
                "rounded-full border border-border/70 bg-background/90 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary",
            }}
            title="Tout ce qu'il faut savoir avant de vous lancer"
            className="mx-auto max-w-3xl"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {faq.map((item) => (
              <Card
                key={item.question}
                className="border border-border/70 bg-background/95 p-6 shadow-sm shadow-primary/5"
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pt-2 text-sm text-muted-foreground">
                  {item.answer}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-background to-background p-10 text-center shadow-xl shadow-primary/10 backdrop-blur">
            <div className="mx-auto max-w-3xl space-y-6">
              <SectionIntro
                eyebrow={{
                  label: "Prêt à envoyer vos factures ?",
                  variant: "secondary",
                  className:
                    "rounded-full border border-border/60 bg-background/80 px-4 py-1 text-xs font-medium uppercase tracking-wide text-primary",
                }}
                title="Activez votre cockpit de facturation en moins de 5 minutes"
                description="Créez votre compte, importez vos clients et expédiez votre premier devis grâce à nos modèles prêts à l'emploi."
                className="space-y-6"
              />
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2 text-base">
                    Essayer gratuitement
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
                <Link
                  href="mailto:bonjour@cotizoo.com"
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full gap-2 text-base"
                  >
                    Parler à un spécialiste
                    <ArrowRight className="size-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
