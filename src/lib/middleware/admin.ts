import { auth } from '@/lib/auth';
import { Context, Next } from 'hono';

/**
 * Middleware pour vérifier que l'utilisateur est administrateur
 * Doit être utilisé après le middleware d'authentification
 */
export async function requireAdmin(c: Context, next: Next) {
  const user = c.get('user');

  if (!user) {
    return c.json({ success: false, error: 'Authentification requise' }, 401);
  }

  // Vérifier si l'utilisateur est admin
  if (!user.isAdmin) {
    return c.json(
      {
        success: false,
        error: 'Accès refusé. Droits administrateur requis.',
      },
      403
    );
  }

  return next();
}

/**
 * Vérifier si un utilisateur est admin (pour les Server Components)
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const { PrismaClient } = await import('@/generated/prisma');
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    return user?.isAdmin ?? false;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Récupérer la session et vérifier si l'utilisateur est admin
 * Utile pour les Server Components Next.js
 */
export async function getAdminSession() {
  // Importer headers depuis next/headers pour accéder aux cookies
  const { headers: getHeaders } = await import('next/headers');
  const headersList = await getHeaders();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session || !session.user) {
    return null;
  }

  const isAdmin = await isUserAdmin(session.user.id);

  if (!isAdmin) {
    return null;
  }

  return {
    user: session.user,
    session: session.session,
  };
}
