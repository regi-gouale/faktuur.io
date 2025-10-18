import { prisma } from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization } from "better-auth/plugins";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
} from "./dal/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      console.log("Reset token:", token);
      console.log("Reset URL:", url);
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
  },
});
