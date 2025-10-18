export default function CreateOrganizationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Créer votre organisation</h1>
        <p className="text-muted-foreground mb-8">
          Commencez par créer votre première organisation pour accéder au
          dashboard.
        </p>
        {/* TODO: Formulaire de création d'organisation à implémenter */}
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">
            Formulaire de création d&apos;organisation à venir
          </p>
        </div>
      </div>
    </div>
  );
}
