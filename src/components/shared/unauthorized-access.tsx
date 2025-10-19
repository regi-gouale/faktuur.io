import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UnauthorizedAccessProps {
  organizationSlug: string;
  title?: string;
  description?: string;
  returnUrl?: string;
  returnLabel?: string;
}

export function UnauthorizedAccess({
  organizationSlug,
  title = 'Accès refusé',
  description = "Vous n'avez pas accès à cette organisation.",
  returnUrl = '/dashboard',
  returnLabel = 'Retour au dashboard',
}: UnauthorizedAccessProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-destructive mt-1 h-6 w-6 flex-shrink-0" />
            <div className="space-y-2">
              <h1 className="text-destructive text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
              <p className="text-muted-foreground text-sm">
                L&apos;organisation{' '}
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono">{organizationSlug}</code>{' '}
                n&apos;existe pas ou vous n&apos;êtes pas membre de cette organisation.
              </p>
              <div className="flex gap-3 pt-4">
                <Link
                  href={returnUrl}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
                >
                  {returnLabel}
                </Link>
                <Link
                  href="/create-organization"
                  className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors"
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
