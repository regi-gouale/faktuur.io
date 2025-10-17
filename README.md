# Faktuur.io - Logiciel de Facturation pour Freelances

<div align="center">

![faktuur.io](https://img.shields.io/badge/Status-Production-green?style=flat-square)
![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

**Suite de facturation moderne pour freelances, auto-entrepreneurs et TPE.** 📋

[Site Web](https://faktuur.io) • [Tarifs](https://faktuur.io/pricing) • [À Propos](https://faktuur.io/about) • [Contact](mailto:contact@faktuur.io)

</div>

---

## 🎯 À Propos

**Faktuur.io** est une plateforme SaaS complète qui simplifie la gestion des devis, factures et paiements pour les travailleurs indépendants. Conçue pour réduire les actions manuelles et assurer la conformité réglementaire française.

### Chiffres Clés

- **10K+** entrepreneurs accompagnés
- **500K+** documents générés
- **99.9%** disponibilité plateforme
- **4.9/5** satisfaction client

---

## ✨ Fonctionnalités Principales

### 📄 Devis & Factures

- Créez des documents conformes en quelques secondes
- Transformation automatique devis → facture
- Modèles réutilisables et personnalisables
- Export PDF haute fidélité

### 👥 Gestion Clients

- CRM intégré pour centraliser vos contacts
- Historique complet des échanges
- Automations des suivis
- Base illimitée de clients

### 📊 Suivi Financier

- Tableau de bord temps réel
- Suivi des paiements et relances intelligentes
- Trésorerie et statistiques en direct
- Export comptable pour expert-comptable

### 🔐 Sécurité & Conformité

- Chiffrement SSL des données
- Hébergement européen (RGPD)
- Conformité TVA multi-activités (micro et régime réel)
- Authentification forte
- Sauvegardes quotidiennes

### ⚡ Automations

- Envoi d'emails avec branding personnalisé
- Relances programmées et intelligentes
- Exports comptables (FEC + PDF)
- Webhooks et API (plan Entreprise)

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- pnpm (gestionnaire de paquets)
- PostgreSQL ou SQLite (local)

### Installation

```bash
# Cloner le repository
git clone https://github.com/regi-gouale/faktuur.io.git
cd faktuur.io

# Installer les dépendances
pnpm install

# Configuration environnement
cp .env.example .env.local

# Migrations DB (pour développement)
pnpm dlx prisma migrate dev

# Démarrer le serveur de développement
pnpm dev
```

L'application sera disponible sur `http://localhost:3000`

---

## 📦 Architecture Technique

### Stack Frontend

- **Framework:** Next.js 15 + React 19 (Server Components)
- **Styling:** TailwindCSS + Shadcn UI
- **State Management:** Zustand
- **URL State:** Nuqs
- **Validation:** Zod
- **Forms:** React Hook Form

### Stack Backend

- **API:** Hono.js (routeur léger)
- **ORM:** Prisma
- **Auth:** Better-auth
- **Database:** PostgreSQL (production) / SQLite (local)

### Outils & Services

- **PDF Generation:** Puppeteer
- **Email:** UseSend
- **Testing:** Playwright (E2E)
- **Linting:** ESLint + Prettier
- **Deployment:** Coolify (VPS)

### Philosophie Architecturale

- **Monolithic Repository** (pas Turborepo)
- **Server Components First** (RSC + Server Actions)
- **Type-Safe End-to-End** (TypeScript strict)
- **Data Access Layer** (DAL pattern)
- **Immutability & FP** (principes fonctionnels)

---

## 📁 Structure du Projet

```
faktuur.io/
├── app/                      # Next.js app directory
│   ├── (marketing)/          # Pages publiques
│   │   ├── layout.tsx        # Layout header + footer
│   │   ├── page.tsx          # Accueil
│   │   ├── about/            # À propos
│   │   └── pricing/          # Tarification
│   ├── api/                  # Routes API (Hono)
│   └── layout.tsx            # Root layout
├── components/               # Composants React réutilisables
│   ├── marketing/            # Composants landing page
│   ├── shared/               # Composants partagés
│   └── ui/                   # Composants Shadcn UI
├── lib/
│   ├── dal/                  # Data Access Layer
│   ├── schemas/              # Validations Zod
│   ├── auth.ts               # Config Better-auth
│   ├── prisma.ts             # Client Prisma
│   └── utils.ts              # Utilitaires
├── prisma/
│   └── schema.prisma         # Modèles de données
├── tests/                    # Tests E2E Playwright
└── public/                   # Ressources statiques
```

---

## 🛠️ Scripts Disponibles

```bash
# Développement
pnpm dev              # Démarrer serveur dev
pnpm dev:turbo        # Avec Turbopack

# Build & Production
pnpm build            # Build Next.js
pnpm start            # Démarrer le serveur prod

# Database
pnpm db:migrate       # Lancer migrations
pnpm db:seed          # Initialiser données
pnpm studio           # Ouvrir Prisma Studio

# Testing
pnpm test             # Tests Playwright
pnpm test:ui          # Mode UI des tests
pnpm test:debug       # Mode debug

# Code Quality
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm type-check       # TypeScript
```

---

## 🔑 Variables d'Environnement

Créez un fichier `.env.local` :

```env
# Database
DATABASE_URL="file:./dev.db"  # SQLite local
# DATABASE_URL="postgresql://user:password@host:5432/faktuur"  # Production

# Better-auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"

# Email Service (UseSend)
USESEND_API_KEY="your-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🧪 Testing

### Tests E2E

```bash
# Exécuter les tests Playwright
pnpm exec playwright test

# Voir les résultats avec UI
pnpm exec playwright test --ui

# Test un fichier spécifique
pnpm exec playwright test tests/marketing/header.spec.ts
```

### Coverage

- Tests E2E pour parcours utilisateur critiques
- Tests de régression automatisés
- Accessibilité (WCAG 2.1 AA)

---

## 📊 Performance & Optimisations

### Rendu Statique

Les routes marketing (`/`, `/about`, `/pricing`) sont pré-générées au build pour:

- ✅ Serveur depuis le cache/CDN (0ms latency)
- ✅ Meilleurs Core Web Vitals (FCP, LCP, TTFB)
- ✅ Scalabilité sous trafic élevé

### Optimisations

- Server Components (réduction du bundle client)
- Data Access Layer (requêtes DB optimisées)
- Runtime Validation (Zod)
- Image Optimization (Next.js)
- Code Splitting automatique

---

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez:

1. **Forker** le repository
2. **Créer une branche** (`git checkout -b feature/amazing`)
3. **Committer** vos changements (`git commit -m 'Add amazing feature'`)
4. **Pousser** la branche (`git push origin feature/amazing`)
5. **Ouvrir une Pull Request**

### Conventions de Code

- **TypeScript strict mode** activé
- **ESLint** et **Prettier** obligatoires
- **Tests E2E** pour nouvelles features
- **Commits conventionnels** recommandés
- **Documentation** en français

---

## 📚 Documentation

- **[Guide d'Architecture](docs/ARCHITECTURE.md)** - Décisions architecturales
- **[Copilot Instructions](.github/copilot-instructions.md)** - Conventions pour l'IA
- **[Contributing](CONTRIBUTING.md)** - Guide complet de contribution
- **[Changelog](CHANGELOG.md)** - Historique des versions

---

## 🐛 Signaler un Bug

Avez-vous trouvé un bug? [Ouvrez une issue GitHub](https://github.com/regi-gouale/faktuur.io/issues)

Décrivez:

- ✅ Le comportement attendu
- ❌ Le comportement observé
- 📋 Étapes pour reproduire
- 💻 Votre environnement

---

## 🆘 Support & Contact

- **Email:** contact@faktuur.io
- **Website:** [faktuur.io](https://faktuur.io)
- **Docs:** [Guides & Documentation](https://faktuur.io/docs)

---

## 📄 License

© 2025 Faktuur.io. Tous droits réservés.

Ce projet est propriétaire et protégé par copyright. L'utilisation commerciale est interdite sans autorisation explicite.

---

## 👥 Équipe

- **Sarah Martin** — CEO & Co-fondatrice (Vision produit & UX)
- **Thomas Dubois** — CTO & Co-fondateur (Architecture & Sécurité)
- **Marie Laurent** — Head of Product (Discovery & Design)
- **Alexandre Chen** — Head of Support (Succès client)

---

## 🙏 Remerciements

Merci à tous les utilisateurs et contributeurs qui font de Faktuur.io une réalité!

Bâti avec ❤️ pour les freelances et petites entreprises.

---

<div align="center">

**[⬆ Retour en haut](#faktuurio---logiciel-de-facturation-pour-freelances)**

</div>
