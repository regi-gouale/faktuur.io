import { sendEmailVerificationEmail, sendPasswordResetEmail } from '@/lib/dal/email';
import { prisma } from '@/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { openAPI, organization } from 'better-auth/plugins';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url, 1);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail(user.email, url);
    },
  },
  plugins: [organization(), openAPI()],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 7 * 24 * 60 * 60,
  },
});
