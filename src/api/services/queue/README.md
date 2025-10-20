# 📦 Système de Queue BullMQ

Ce dossier contient l'implémentation complète du système de gestion de tâches asynchrones avec BullMQ.

## 📁 Structure

```
queue/
├── index.ts              # Exports principaux et helpers
├── manager.ts            # QueueManager - Gestion des queues
├── redis.ts              # Configuration Redis
├── types.ts              # Types TypeScript
├── worker.ts             # Worker standalone (CLI)
└── workers/
    ├── index.ts          # WorkerManager
    ├── email-worker.ts   # Worker pour emails
    └── pdf-worker.ts     # Worker pour PDFs
```

## 🚀 Utilisation Rapide

### Dans votre code

```typescript
import { queueEmail, queuePDF } from '@/api/services/queue';

// Envoyer un email
await queueEmail({
  to: 'user@example.com',
  template: 'WELCOME',
  data: { name: 'John' },
});

// Générer un PDF
await queuePDF({
  type: 'invoice',
  documentId: 'inv_123',
});
```

### Via l'API

```bash
POST /api/jobs
{
  "type": "email",
  "payload": {
    "to": "user@example.com",
    "template": "WELCOME",
    "data": {"name": "John"}
  }
}
```

## 📚 Documentation

- **[QUEUE_QUICKSTART.md](../../../docs/QUEUE_QUICKSTART.md)** - Démarrer en 5 minutes
- **[QUEUE_USAGE.md](../../../docs/QUEUE_USAGE.md)** - Guide d'utilisation complet
- **[QUEUE_TESTING.md](../../../docs/QUEUE_TESTING.md)** - Tests et validation
- **[TASK_QUEUE_IMPLEMENTATION_PLAN.md](../../../docs/TASK_QUEUE_IMPLEMENTATION_PLAN.md)** - Architecture

## 🔧 Configuration

Variables d'environnement requises :

```env
REDIS_HOST=localhost
REDIS_PORT=6379
QUEUE_ENABLED=true
QUEUE_CONCURRENCY=5
```

## 🏃 Démarrer le Worker

```bash
# Développement (avec hot reload)
pnpm queue:dev

# Production
pnpm queue:worker
```

## 📊 Dashboard

Accessible à : **http://localhost:3000/api/admin/queues**

## 🆘 Support

Consultez [QUEUE_FINAL_SUMMARY.md](../../../docs/QUEUE_FINAL_SUMMARY.md) pour un résumé complet de l'implémentation.
