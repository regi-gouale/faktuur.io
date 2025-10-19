import { IconFileInvoice } from '@tabler/icons-react';
import Link from 'next/link';

const footerLinks = {
  product: [
    { href: '#features', label: 'Fonctionnalités' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/register', label: 'Commencer' },
  ],
  resources: [
    { href: '/about', label: 'À propos' },
    { href: 'mailto:contact@cotizoo.com', label: 'Contact', external: true },
    { href: '/docs', label: 'Guides & docs' },
  ],
  legal: [
    { href: '#', label: 'Confidentialité' },
    { href: '#', label: 'CGU' },
    { href: '#', label: 'Mentions légales' },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-border/80 bg-background/90 border-t py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-primary flex items-center gap-2">
              <IconFileInvoice className="size-6" />
              <span className="text-primary text-lg font-semibold">faktuur.io</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              La suite de facturation pensée pour les freelances, agences et studios créatifs qui
              veulent scaler sans friction.
            </p>
          </div>
          <FooterColumn title="Produit" links={footerLinks.product} />
          <FooterColumn title="Ressources" links={footerLinks.resources} />
          <FooterColumn title="Légal" links={footerLinks.legal} />
        </div>
        <div className="border-border/70 text-muted-foreground mt-12 border-t pt-6 text-center text-xs">
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
      <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        {title}
      </h3>
      <ul className="text-muted-foreground space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} className="hover:text-foreground transition">
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="hover:text-foreground transition">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
