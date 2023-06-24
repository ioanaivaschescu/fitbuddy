import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@server/db/client'
import { env } from '@env/server.mjs'

import stripe from '@utils/stripe'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  jwt: {
    maxAge: 60 * 60 * 24 * 30
  },
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout'
  },
  // Include user.id on session
  callbacks: {
    async jwt({ token, user, isNewUser }) {
      if (user) {
        token.id = user?.id
        token.role = user.role
        token.is_subscribed = user.is_subscribed
        token.stripe_customer = user.stripe_customer
      }

      if (isNewUser) {
        token.role = 'USER'
        token.is_subscribed = false
        if (user?.email) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name !== null ? user.name : undefined
          })
          await prisma.user.update({
            where: {
              email: user.email
            },
            data: {
              stripe_customer: customer.id
            }
          })
          token.stripe_customer = customer.id
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.is_subscribed = token.is_subscribed
        session.user.stripe_customer = token.stripe_customer
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
