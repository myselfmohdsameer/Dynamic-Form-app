import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope:
            "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/spreadsheets",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: ({ token, account, profile }) => {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      if (session.user) {
        session.user.name = (token.profile as any).given_name as string;
        session.user.email = (token.profile as any).email as string;
        session.user.image = (token.profile as any).picture as string;
      }

      return session;
    },
  },
});
