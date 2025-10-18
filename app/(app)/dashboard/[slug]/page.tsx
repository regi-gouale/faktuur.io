interface DashboardSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DashboardSlugPage({
  params,
}: DashboardSlugPageProps) {
  const { slug } = await params;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard - Organisation: {slug}
      </h1>
      <p className="text-muted-foreground">
        Bienvenue sur le dashboard de votre organisation.
      </p>
      {/* TODO: Contenu du dashboard à implémenter */}
    </div>
  );
}
