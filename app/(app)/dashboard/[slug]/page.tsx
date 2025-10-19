import { DashboardSkeleton } from "@/components/app/dashboard-skeleton";
import { UnauthorizedAccess } from "@/components/shared/unauthorized-access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getOrganizationForUser } from "@/lib/dal/organization";
import { Euro, FileText, TrendingUp, Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface DashboardSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Composant pour les statistiques
async function DashboardStats({ organizationId }: { organizationId: string }) {
  // Simulation de récupération de données
  await new Promise((resolve) => setTimeout(resolve, 100));

  const stats = [
    {
      title: "Chiffre d'affaires",
      value: "0 €",
      description: "+0% par rapport au mois dernier",
      icon: Euro,
    },
    {
      title: "Factures",
      value: "0",
      description: "0 en attente de paiement",
      icon: FileText,
    },
    {
      title: "Clients",
      value: "0",
      description: "0 clients actifs",
      icon: Users,
    },
    {
      title: "Croissance",
      value: "+0%",
      description: "Tendance ce mois-ci",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default async function DashboardSlugPage({
  params,
}: DashboardSlugPageProps) {
  const { slug } = await params;

  // Récupérer la session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si pas de session, rediriger vers login (normalement géré par le layout)
  if (!session) {
    redirect("/login");
  }

  // Vérifier que l'utilisateur a accès à cette organisation
  const organization = await getOrganizationForUser(session.user.id, slug);

  // Si l'organisation n'existe pas ou l'utilisateur n'est pas membre
  if (!organization) {
    return <UnauthorizedAccess organizationSlug={slug} />;
  }

  // L'utilisateur a accès, afficher le dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre espace de gestion {organization.name}
        </p>
      </div>

      {/* Stats avec Suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats organizationId={organization.id} />
      </Suspense>

      {/* Contenu principal */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune activité pour le moment
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Commencez par créer votre première facture ou ajouter un client.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
