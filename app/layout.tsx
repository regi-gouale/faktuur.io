import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'faktuur.io - Logiciel de facturation pour freelances et auto-entrepreneurs',
    template: '%s | faktuur.io',
  },
  description:
    'Créez et gérez vos devis et factures en ligne. Logiciel de facturation gratuit et simple pour freelances, auto-entrepreneurs et TPE. Conforme à la réglementation française.',
  keywords: [
    'logiciel de facturation',
    'facturation freelance',
    'devis en ligne',
    'facture auto-entrepreneur',
    'gestion facturation',
    'logiciel devis gratuit',
    'facturation TPE',
    'créer facture',
    'suivi paiement',
    'export PDF facture',
    'facturation conforme',
    'gestion clients',
  ],
  authors: [{ name: 'faktuur.io' }],
  creator: 'faktuur.io',
  publisher: 'faktuur.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'faktuur.io',
    title: 'faktuur.io - Logiciel de facturation pour freelances',
    description:
      'Créez et gérez vos devis et factures en ligne. Simple, rapide et conforme à la réglementation française.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'faktuur.io - Logiciel de facturation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'faktuur.io - Logiciel de facturation pour freelances',
    description: 'Créez et gérez vos devis et factures en ligne. Simple, rapide et conforme.',
    images: ['/og-image.png'],
    creator: '@faktuur_io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <NuqsAdapter>
              <main className="bg-background text-foreground relative min-h-screen w-full">
                <div
                  className="pointer-events-none absolute inset-0 z-0 dark:hidden"
                  style={{
                    backgroundImage: `
             radial-gradient(circle at center, #c4b5fd, transparent)
           `,
                  }}
                />

                <div
                  className="absolute inset-0 z-0 hidden dark:block"
                  style={{
                    backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)`,
                  }}
                />
                {children}
              </main>
            </NuqsAdapter>
          </ReactQueryProvider>
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
