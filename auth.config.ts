import type { NextAuthConfig, User } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { JWT } from "next-auth/jwt";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/drizzle";
import ratelimit from "@/lib/ratelimit";

declare module "next-auth/jwt" {
  interface JWT {
    id: string | undefined;
  }
}

export default {
  adapter: DrizzleAdapter(db),
  providers: [
    CredentialsProvider({
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) return redirect("/too-fast");

        const user = await db.query.users.findFirst({
          where: (user, { eq }) => eq(user.email, credentials.email.toString()),
        });

        if (!user) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user?.password!
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        } as User;
      },
    }),
    GitHub,
    Google,
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
