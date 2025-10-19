# Guide de Contribution - Faktuur.io

Merci de votre intérêt pour contribuer à Faktuur.io ! Ce document vous guidera à travers le processus de contribution.

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Git**

### Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/faktuur.io.git
cd faktuur.io

# Installer les dépendances
pnpm install

# Configurer la base de données
cp .env.example .env.local
pnpm prisma generate
pnpm prisma migrate dev

# Lancer le serveur de développement
pnpm dev
```

## 📝 Processus de contribution

### 1. Créer une branche

Créez une branche depuis `develop` avec un nom descriptif :

```bash
git checkout develop
git pull origin develop
git checkout -b feature/ma-nouvelle-fonctionnalite
```

Convention de nommage des branches :

- `feature/` - Nouvelles fonctionnalités
- `fix/` - Corrections de bugs
- `docs/` - Documentation
- `refactor/` - Refactorisation
- `test/` - Ajout ou modification de tests
- `chore/` - Tâches de maintenance

### 2. Développer votre fonctionnalité

Suivez les conventions de code du projet :

- **TypeScript strict** obligatoire
- **Prettier** pour le formatage automatique
- **ESLint** pour la qualité du code
- **Tests** pour toute nouvelle fonctionnalité

### 3. Tester votre code

Avant de commit, assurez-vous que :

```bash
# Le formatage est correct
pnpm format:check

# Le lint passe
pnpm lint

# Les types sont corrects
pnpm type-check

# Le build fonctionne
pnpm build

# Les tests passent
pnpm test:e2e
```

### 4. Commit vos changements

Utilisez des messages de commit clairs et descriptifs :

```bash
git add .
git commit -m "feat: ajouter la gestion des factures récurrentes"
```

Convention des messages de commit :

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, point-virgules manquants, etc.
- `refactor:` - Refactorisation du code
- `test:` - Ajout ou modification de tests
- `chore:` - Maintenance, dépendances, etc.

### 5. Pousser et créer une Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Ensuite, créez une Pull Request sur GitHub vers la branche `develop`.

## ✅ Checklist avant Pull Request

- [ ] Le code respecte les conventions TypeScript strict
- [ ] Le formatage Prettier est appliqué (`pnpm format`)
- [ ] ESLint ne retourne aucune erreur (`pnpm lint`)
- [ ] La vérification des types passe (`pnpm type-check`)
- [ ] Le build fonctionne (`pnpm build`)
- [ ] Les tests E2E passent (`pnpm test:e2e`)
- [ ] La documentation est à jour si nécessaire
- [ ] Les migrations Prisma sont incluses si nécessaire

## 🏗️ Structure du code

### Backend (Hono.js)

Les routes API doivent :

- Être placées dans `/src/api/routes/`
- Utiliser le DAL (Data Access Layer) dans `/src/lib/dal/`
- Valider les entrées avec Zod
- Retourner des réponses standardisées

Exemple :

```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createInvoiceSchema } from '@/lib/schemas/invoice';
import { createInvoice } from '@/lib/dal/invoice';

const app = new Hono();

app.post('/invoices', zValidator('json', createInvoiceSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const invoice = await createInvoice(data);
    return c.json({ success: true, data: invoice });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create invoice' }, 500);
  }
});

export default app;
```

### Frontend (Next.js)

Les composants doivent :

- Utiliser **React Server Components** par défaut
- Utiliser **Server Actions** pour les mutations
- Être placés dans `/src/components/`
- Utiliser **Shadcn UI** pour l'interface
- Être typés strictement

Exemple :

```typescript
import { getInvoices } from '@/lib/dal/invoice';
import { InvoiceList } from '@/components/invoices/invoice-list';

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div>
      <h1>Factures</h1>
      <InvoiceList invoices={invoices} />
    </div>
  );
}
```

### Data Access Layer (DAL)

Toutes les interactions avec la base de données passent par le DAL :

```typescript
import { prisma } from '@/lib/prisma';

export async function getInvoices() {
  return await prisma.invoice.findMany({
    include: {
      customer: true,
    },
  });
}

export async function createInvoice(data: CreateInvoiceInput) {
  return await prisma.invoice.create({
    data,
  });
}
```

## 🧪 Tests

### Tests E2E avec Playwright

Créez vos tests dans `/tests/` :

```typescript
import { test, expect } from '@playwright/test';

test.describe('Invoices', () => {
  test('should create a new invoice', async ({ page }) => {
    await page.goto('/dashboard/my-org/invoices');
    await page.click('button:has-text("Nouvelle facture")');

    await page.fill('[name="customer"]', 'ACME Corp');
    await page.fill('[name="amount"]', '1000');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Facture créée')).toBeVisible();
  });
});
```

## 🔍 Code Review

Votre Pull Request sera examinée selon ces critères :

- **Qualité du code** : Respect des conventions TypeScript et des patterns du projet
- **Tests** : Couverture adéquate avec des tests E2E
- **Performance** : Pas de régression de performance
- **Sécurité** : Validation des entrées, protection contre les injections
- **Documentation** : Code commenté si nécessaire, README à jour

## 🐛 Signaler un bug

Créez une issue GitHub avec :

- **Description** : Description claire du problème
- **Reproduction** : Étapes pour reproduire le bug
- **Comportement attendu** : Ce qui devrait se passer
- **Comportement actuel** : Ce qui se passe réellement
- **Environnement** : OS, navigateur, version Node.js

## 💡 Proposer une fonctionnalité

Créez une issue GitHub avec :

- **Problème** : Quel problème cela résout-il ?
- **Solution** : Comment proposez-vous de le résoudre ?
- **Alternatives** : Avez-vous considéré d'autres approches ?
- **Impact** : Qui sera affecté par ce changement ?

## 📚 Ressources

- [Architecture du projet](.github/copilot-instructions.md)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Hono](https://hono.dev/)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Playwright](https://playwright.dev/)

---

Merci de contribuer à Faktuur.io ! 🎉
