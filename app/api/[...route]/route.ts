import emailRouter from '@/api/routes/email';
import { auth } from '@/lib/auth';
import { getUserFirstOrganizationSlug } from '@/lib/dal/organization';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const runtime = 'nodejs';

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath('/api');

app
  .on(['POST', 'GET'], '/auth/*', (c) => {
    return auth.handler(c.req.raw);
  })
  .use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set('user', null);
      c.set('session', null);
      return next();
    }

    c.set('user', session.user);
    c.set('session', session.session);
    return next();
  })
  .route('/email', emailRouter)
  .get('/session', async (c) => {
    const session = c.get('session');
    const user = c.get('user');

    if (!user) return c.body(null, 401);

    // Récupérer le slug d'organisation de l'utilisateur
    const orgSlug = await getUserFirstOrganizationSlug(user.id);

    return c.json({
      session,
      user,
      orgSlug,
    });
  })
  .get('/debug/members/:userId', async (c) => {
    const userId = c.req.param('userId');

    const { prisma } = await import('@/lib/prisma');

    // Récupérer tous les members
    const members = await prisma.member.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });

    return c.json({
      userId,
      membersCount: members.length,
      members,
    });
  });

export const GET = handle(app);
export const POST = handle(app);
