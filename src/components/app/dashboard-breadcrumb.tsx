'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

interface DashboardBreadcrumbProps {
  organizationSlug: string;
  organizationName: string;
}

export function DashboardBreadcrumb({
  organizationSlug,
  organizationName,
}: DashboardBreadcrumbProps) {
  const pathname = usePathname();

  // Parse le pathname pour créer les breadcrumbs
  const paths = pathname.split('/').filter(Boolean);

  // Retirer 'dashboard' et le slug de l'organisation des paths
  const breadcrumbPaths = paths.slice(2); // Enlève "dashboard" et le slug

  // Map des noms de routes
  const routeNames: Record<string, string> = {
    invoices: 'Factures',
    clients: 'Clients',
    settings: 'Paramètres',
    new: 'Nouveau',
    edit: 'Modifier',
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/dashboard/${organizationSlug}`}>
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbPaths.length > 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/${organizationSlug}`}>
                {organizationName}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {breadcrumbPaths.map((path, index) => {
          const isLast = index === breadcrumbPaths.length - 1;
          const href = `/dashboard/${organizationSlug}/${breadcrumbPaths
            .slice(0, index + 1)
            .join('/')}`;
          const name = routeNames[path] || path;

          return (
            <Fragment key={path}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{name}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
