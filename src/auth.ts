import NextAuth from "next-auth"
import { linkOAuthAccount } from "@/actions/user"
import { getUserById } from "@/actions/user"
import { prisma } from "@/db"
import { env } from "@/env.mjs"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "@/config/auth"

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    verifyRequest: "/signin/magic-link-signin",
  },
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) await linkOAuthAccount({ userId: user.id })
    },
    async createUser ({user}){
      if (!user.id) return
      await prisma.user.update(
        {
          where : {
            id : user.id
          },
          data : {
            credit : 50
          }
        }
      )
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) return false
      if (account?.provider !== "credentials") return true

      const existingUser = await getUserById({ id: user.id })

      return !!existingUser?.emailVerified
    },
  },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
})
