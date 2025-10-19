import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface UnauthorizedAccessProps {
  organizationSlug: string;
  title?: string;
  description?: string;
  returnUrl?: string;
  returnLabel?: string;
}

export function UnauthorizedAccess({
  organizationSlug,
  title = "Accès refusé",
  description = "Vous n'avez pas accès à cette organisation.",
  returnUrl = "/dashboard",
  returnLabel = "Retour au dashboard",
}: UnauthorizedAccessProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-destructive">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
              <p className="text-sm text-muted-foreground">
                L&apos;organisation{" "}
                <code className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  {organizationSlug}
                </code>{" "}
                n&apos;existe pas ou vous n&apos;êtes pas membre de cette
                organisation.
              </p>
              <div className="pt-4 flex gap-3">
                <Link
                  href={returnUrl}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {returnLabel}
                </Link>
                <Link
                  href="/create-organization"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Créer une organisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
