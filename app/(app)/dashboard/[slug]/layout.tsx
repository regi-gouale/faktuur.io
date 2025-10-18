import { DashboardBreadcrumb } from "@/components/app/dashboard-breadcrumb";
import { DashboardSidebar } from "@/components/app/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { getUserOrganizations } from "@/lib/dal/organization";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { slug } = await params;

  // Vérifier la session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Récupérer toutes les organisations de l'utilisateur
  const organizations = await getUserOrganizations(session.user.id);

  // Vérifier que l'utilisateur a accès à cette organisation
  const currentOrganization = organizations.find((org) => org.slug === slug);

  if (!currentOrganization) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        organizations={organizations}
        currentSlug={slug}
        user={{
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image || null,
        }}
      />
      <SidebarInset>
        {/* Header avec breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <DashboardBreadcrumb
            organizationSlug={slug}
            organizationName={currentOrganization.name}
          />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
