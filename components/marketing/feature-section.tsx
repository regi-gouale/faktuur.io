import { SectionIntro } from "@/components/marketing/section-intro";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  FileText,
  GaugeCircle,
  LucideIcon,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

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
      "Données chiffrées, conformité RGPD et authentification forte.",
    badge: "Conformité RGPD",
    icon: ShieldCheck,
  },
] satisfies Array<{
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
}>;

export function FeatureSection() {
  return (
    <section
      id="features"
      className="relative border-t border-border/80 bg-muted/40 py-24"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <SectionIntro
          title="Une stack complète pour votre gestion commerciale"
          description="Chaque module a été pensé pour réduire les actions manuelles, limiter les erreurs et valoriser votre image de marque."
          className="max-w-3xl"
        />
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <Card
              className="group relative flex flex-col overflow-hidden border border-border/80 bg-background/90 p-6 shadow-sm shadow-primary/5 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10"
              key={feature.title}
            >
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition group-hover:border-primary/50 group-hover:bg-primary/15">
                    <feature.icon className="size-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full border-border/80 bg-background/80 text-xs font-medium uppercase tracking-wide text-muted-foreground/90"
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                En savoir plus
                <ArrowRight className="size-4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
