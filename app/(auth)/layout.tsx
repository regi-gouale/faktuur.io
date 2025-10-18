import { StructuredData } from "@/components/seo/structured-data";
import { HeaderActionsServer } from "@/components/shared/header-actions-server";
import { MobileNav } from "@/components/shared/mobile-nav";
import { SiteFooter } from "@/components/shared/site-footer";
import { IconFileInvoice } from "@tabler/icons-react";
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

export const revalidate = false; // Static: never revalidate

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <StructuredData />
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-[500px] bg-[radial-gradient(circle_at_top,_theme(colors.primary/20),_transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_theme(colors.primary/15),_transparent_60%)]" />

        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
            {/* Logo */}
            <Link
              href="/"
              className="group flex flex-shrink-0 items-center gap-2"
            >
              <IconFileInvoice className="size-8 text-primary" />
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-lg font-semibold text-primary">
                  faktuur.io
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Facturation moderne
                </span>
              </div>
              <div className="flex flex-col leading-tight sm:hidden">
                <span className="text-lg font-semibold text-primary">
                  faktuur.io
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
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

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <HeaderActionsServer />
              {/* Mobile Navigation */}
              <MobileNav navLinks={navLinks} />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
