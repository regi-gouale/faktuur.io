/**
 * Script pour créer ou révoquer un administrateur
 *
 * Usage:
 *   pnpm tsx scripts/manage-admin.ts grant admin@example.com
 *   pnpm tsx scripts/manage-admin.ts revoke user@example.com
 *   pnpm tsx scripts/manage-admin.ts list
 */

import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function grantAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    console.log('\n✅ Droits administrateur accordés avec succès\n');
    console.log("📋 Détails de l'utilisateur:");
    console.log(`   Nom: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Admin: ${user.isAdmin ? '✓ Oui' : '✗ Non'}`);
    console.log(`   Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}\n`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`\n❌ Erreur: Aucun utilisateur trouvé avec l'email "${email}"\n`);
    } else {
      console.error('\n❌ Erreur:', error.message, '\n');
    }
    process.exit(1);
  }
}

async function revokeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: false },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    console.log('\n✅ Droits administrateur révoqués avec succès\n');
    console.log("📋 Détails de l'utilisateur:");
    console.log(`   Nom: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Admin: ${user.isAdmin ? '✓ Oui' : '✗ Non'}\n`);
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`\n❌ Erreur: Aucun utilisateur trouvé avec l'email "${email}"\n`);
    } else {
      console.error('\n❌ Erreur:', error.message, '\n');
    }
    process.exit(1);
  }
}

async function listAdmins() {
  try {
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (admins.length === 0) {
      console.log('\n⚠️  Aucun administrateur trouvé\n');
      return;
    }

    console.log(`\n👥 Liste des administrateurs (${admins.length})\n`);
    console.log('─'.repeat(80));
    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Créé le: ${admin.createdAt.toLocaleDateString('fr-FR')}`);
    });
    console.log('\n' + '─'.repeat(80) + '\n');
  } catch (error: any) {
    console.error('\n❌ Erreur:', error.message, '\n');
    process.exit(1);
  }
}

async function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║        🔐 Gestion des Administrateurs - Faktuur.io             ║
╚════════════════════════════════════════════════════════════════╝

📖 Usage:

  pnpm tsx scripts/manage-admin.ts <commande> [email]

📋 Commandes disponibles:

  grant <email>   Accorder les droits administrateur à un utilisateur
  revoke <email>  Révoquer les droits administrateur d'un utilisateur
  list            Lister tous les administrateurs
  help            Afficher cette aide

💡 Exemples:

  # Accorder les droits admin
  pnpm tsx scripts/manage-admin.ts grant admin@faktuur.io

  # Révoquer les droits admin
  pnpm tsx scripts/manage-admin.ts revoke user@faktuur.io

  # Lister tous les admins
  pnpm tsx scripts/manage-admin.ts list

⚠️  Attention:

  - Les administrateurs ont accès à TOUTES les données de l'application
  - Limitez le nombre d'admins au strict nécessaire
  - Les actions admin doivent être tracées et auditées

📚 Documentation complète: docs/ADMIN_SYSTEM.md
`);
}

async function main() {
  const command = process.argv[2];
  const email = process.argv[3];

  if (!command || command === 'help') {
    showHelp();
    process.exit(0);
  }

  switch (command) {
    case 'grant':
      if (!email) {
        console.error('\n❌ Erreur: Email requis\n');
        console.log('Usage: pnpm tsx scripts/manage-admin.ts grant <email>\n');
        process.exit(1);
      }
      await grantAdmin(email);
      break;

    case 'revoke':
      if (!email) {
        console.error('\n❌ Erreur: Email requis\n');
        console.log('Usage: pnpm tsx scripts/manage-admin.ts revoke <email>\n');
        process.exit(1);
      }
      await revokeAdmin(email);
      break;

    case 'list':
      await listAdmins();
      break;

    default:
      console.error(`\n❌ Commande inconnue: "${command}"\n`);
      showHelp();
      process.exit(1);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('\n❌ Erreur fatale:', error, '\n');
  prisma.$disconnect();
  process.exit(1);
});
