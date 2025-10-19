import { CreateOrganizationForm } from "@/components/shared/create-organization-form";

export default function CreateOrganizationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Créer votre organisation</h1>
          <p className="text-muted-foreground">
            Commencez par créer votre première organisation pour accéder au
            dashboard.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-8">
          <CreateOrganizationForm />
        </div>
      </div>
    </div>
  );
}
