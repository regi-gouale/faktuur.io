import { getOrganizationForUser } from "@/lib/dal/organization";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UnauthorizedAccess } from "@/components/shared/unauthorized-access";

interface DashboardSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
        <p className="text-muted-foreground">
          Rôle : <span className="font-medium">{organization.role}</span>
        </p>
      </div>

      <div className="rounded-lg border p-8">
        <p className="text-muted-foreground">
          Bienvenue sur le dashboard de votre organisation.
        </p>
        {/* TODO: Contenu du dashboard à implémenter */}
        <div className="mt-4 p-4 bg-muted rounded-md">
          <pre className="text-sm">{JSON.stringify(organization, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
