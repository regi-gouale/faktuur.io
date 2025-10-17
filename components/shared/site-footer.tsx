import { IconFileInvoice } from "@tabler/icons-react";
import Link from "next/link";

const footerLinks = {
  product: [
    { href: "#features", label: "Fonctionnalités" },
    { href: "/pricing", label: "Tarifs" },
    { href: "/signup", label: "Commencer" },
  ],
  resources: [
    { href: "/about", label: "À propos" },
    { href: "mailto:bonjour@cotizoo.com", label: "Contact", external: true },
    { href: "/marketing/pricing", label: "Guides & docs" },
  ],
  legal: [
    { href: "#", label: "Confidentialité" },
    { href: "#", label: "CGU" },
    { href: "#", label: "Mentions légales" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 bg-background/90 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <IconFileInvoice className="size-6" />
              <span className="text-lg font-semibold text-primary">
                faktuur.io
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La suite de facturation pensée pour les freelances, agences et
              studios créatifs qui veulent scaler sans friction.
            </p>
          </div>
          <FooterColumn title="Produit" links={footerLinks.product} />
          <FooterColumn title="Ressources" links={footerLinks.resources} />
          <FooterColumn title="Légal" links={footerLinks.legal} />
        </div>
        <div className="mt-12 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} faktuur.io. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  readonly title: string;
  readonly links: ReadonlyArray<{
    href: string;
    label: string;
    external?: boolean;
  }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-3 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} className="transition hover:text-foreground">
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="transition hover:text-foreground"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
