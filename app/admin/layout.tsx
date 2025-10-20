import { getAdminSession } from '@/lib/middleware/admin';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Vérifier que l'utilisateur est authentifié et admin
  const session = await getAdminSession();

  if (!session) {
    // Rediriger vers la page de connexion si non authentifié ou non admin
    redirect('/login');
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header Admin */}
      <header className="bg-card border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-destructive text-destructive-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-sm font-bold">A</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold">Administration</h1>
              <p className="text-muted-foreground text-xs">Faktuur.io</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-muted-foreground text-xs">{session.user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Admin */}
      <nav className="bg-muted/40 border-b">
        <div className="container flex gap-6 px-4 py-3">
          <a
            href="/admin/jobs"
            className="text-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            Gestion des Tâches
          </a>
          <a
            href="/admin/queues"
            className="text-foreground hover:text-primary text-sm font-medium transition-colors"
          >
            Gestion des Queues
          </a>
          <a
            href="/api/admin/queues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Bull Board (externe)
          </a>
        </div>
      </nav>

      {/* Contenu */}
      <main className="container py-6">{children}</main>
    </div>
  );
}
