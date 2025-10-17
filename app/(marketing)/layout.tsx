import { StructuredData } from "@/components/seo/structured-data";
import { LandingHeaderActions } from "@/components/shared/landing-header-actions";
import { SiteFooter } from "@/components/shared/site-footer";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { IconFileInvoice } from "@tabler/icons-react";
import { headers } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/#features", label: "Fonctionnalités" },
  { href: "/pricing", label: "Tarifs" },
  { href: "/about", label: "À propos" },
] as const;

interface MarketingLayoutProps {
  readonly children: ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let orgSlug: string | undefined;
  if (session?.user?.id) {
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
      orderBy: { createdAt: "asc" },
    });
    orgSlug = membership?.organization?.slug ?? undefined;
  }

  return (
    <>
      <StructuredData />
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-[radial-gradient(circle_at_top,_theme(colors.primary/20),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_theme(colors.primary/15),_transparent_60%)]" />

        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
            <Link href="/" className="group flex items-center gap-2">
              <IconFileInvoice className="size-8 text-primary" />
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-semibold text-primary">
                  faktuur.io
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Facturation moderne pour freelances
                </span>
              </div>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <LandingHeaderActions
              user={
                session?.user
                  ? {
                      name: session.user.name,
                      email: session.user.email,
                      image: session.user.image ?? undefined,
                    }
                  : null
              }
              orgSlug={orgSlug}
            />
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
