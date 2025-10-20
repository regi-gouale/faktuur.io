#!/usr/bin/env tsx
/**
 * Script de vérification de la configuration avant déploiement
 *
 * Utilisation :
 *   pnpm tsx scripts/check-deployment.ts
 */

// Charger les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

import { getEnv } from '@/lib/env';

console.log('🔍 Vérification de la configuration pour le déploiement...\n');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const success = (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`);
const error = (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`);
const warning = (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
const info = (msg: string) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`);

let hasErrors = false;
let hasWarnings = false;

// 1. Validation des variables d'environnement
try {
  info("Validation des variables d'environnement...");
  const env = getEnv();
  success("Toutes les variables d'environnement sont valides");

  // 2. Vérifier NODE_ENV
  console.log('\n📦 Environment:');
  const nodeEnv = process.env.NODE_ENV || 'development';
  if (nodeEnv === 'production') {
    success(`NODE_ENV: ${nodeEnv}`);
  } else {
    warning(`NODE_ENV: ${nodeEnv} (devrait être "production" en prod)`);
    hasWarnings = true;
  }

  // 3. Vérifier la base de données
  console.log('\n🗄️  Base de données:');
  if (env.DATABASE_URL.startsWith('postgresql://')) {
    success('PostgreSQL configuré');
    // Masquer le mot de passe
    const maskedUrl = env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@');
    info(`URL: ${maskedUrl}`);
  } else if (env.DATABASE_URL.startsWith('file:')) {
    warning('SQLite configuré (OK pour dev, mais PostgreSQL recommandé en prod)');
    hasWarnings = true;
  } else {
    error('Format de DATABASE_URL non reconnu');
    hasErrors = true;
  }

  // 4. Vérifier Better Auth
  console.log('\n🔐 Authentication:');
  if (env.BETTER_AUTH_SECRET && env.BETTER_AUTH_SECRET.length >= 32) {
    success('BETTER_AUTH_SECRET configuré (longueur OK)');
  } else {
    error('BETTER_AUTH_SECRET trop court (minimum 32 caractères)');
    hasErrors = true;
  }

  if (env.BETTER_AUTH_URL) {
    success(`BETTER_AUTH_URL: ${env.BETTER_AUTH_URL}`);
    if (nodeEnv === 'production' && !env.BETTER_AUTH_URL.startsWith('https://')) {
      warning('BETTER_AUTH_URL devrait utiliser HTTPS en production');
      hasWarnings = true;
    }
  } else {
    error('BETTER_AUTH_URL non configuré');
    hasErrors = true;
  }

  // 5. Vérifier Email
  console.log('\n📧 Email:');
  if (env.EMAIL_FROM) {
    success(`EMAIL_FROM: ${env.EMAIL_FROM}`);
  } else {
    error('EMAIL_FROM non configuré');
    hasErrors = true;
  }

  if (env.EMAIL_PROVIDER) {
    success(`EMAIL_PROVIDER: ${env.EMAIL_PROVIDER}`);

    if (env.EMAIL_PROVIDER === 'usesend') {
      if (env.USESEND_API_KEY) {
        success('USESEND_API_KEY configuré');
      } else {
        error('USESEND_API_KEY manquant pour le provider "usesend"');
        hasErrors = true;
      }
    } else if (env.EMAIL_PROVIDER === 'nodemailer') {
      if (env.SMTP_HOST && env.SMTP_PORT) {
        success('Configuration SMTP OK');
      } else {
        error('SMTP_HOST et SMTP_PORT requis pour le provider "nodemailer"');
        hasErrors = true;
      }
    }
  } else {
    warning('EMAIL_PROVIDER non configuré (par défaut: nodemailer)');
    hasWarnings = true;
  }

  // 6. Vérifier Redis
  console.log('\n🔴 Redis (Queue):');
  if (env.REDIS_HOST) {
    success(`REDIS_HOST: ${env.REDIS_HOST}`);
  } else {
    warning('REDIS_HOST non configuré (défaut: localhost)');
    hasWarnings = true;
  }

  if (env.REDIS_PORT) {
    success(`REDIS_PORT: ${env.REDIS_PORT}`);
  } else {
    warning('REDIS_PORT non configuré (défaut: 6379)');
    hasWarnings = true;
  }

  // 7. Vérifier Queue Configuration
  console.log('\n⚙️  Queue:');
  if (env.QUEUE_CONCURRENCY) {
    success(`QUEUE_CONCURRENCY: ${env.QUEUE_CONCURRENCY}`);
    if (env.QUEUE_CONCURRENCY > 10) {
      warning('QUEUE_CONCURRENCY > 10 peut surcharger le serveur');
      hasWarnings = true;
    }
  } else {
    info('QUEUE_CONCURRENCY non configuré (défaut: 5)');
  }

  // 8. Résumé
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    error('Configuration invalide - Impossible de déployer');
    console.log('\n💡 Corrigez les erreurs ci-dessus avant de déployer.\n');
    process.exit(1);
  } else if (hasWarnings) {
    warning('Configuration valide avec des avertissements');
    console.log('\n💡 Vous pouvez déployer, mais vérifiez les avertissements.\n');
    process.exit(0);
  } else {
    success('Configuration parfaite - Prêt pour le déploiement !');
    console.log('\n🚀 Vous pouvez déployer en toute confiance.\n');
    process.exit(0);
  }
} catch (err) {
  console.error('\n' + '='.repeat(50));
  error('Erreur lors de la validation de la configuration');
  if (err instanceof Error) {
    console.error(`\n${colors.red}${err.message}${colors.reset}\n`);
  }
  console.log("💡 Assurez-vous que toutes les variables d'environnement requises sont définies.\n");
  console.log('📖 Consultez .env.example pour la liste complète.\n');
  process.exit(1);
}
