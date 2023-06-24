import { router, publicProcedure, protectedProcedure } from '../trpc'
import { z } from 'zod'
import stripe from '@utils/stripe'
import { differenceInDays, fromUnixTime } from 'date-fns'

export const userRouter = router({
  init: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      }
    })

    let days_until_subscription_expires: number | null = null
    if (user?.is_subscribed && user?.subscription_id) {
      const { cancel_at } = await stripe.subscriptions.retrieve(
        user.subscription_id
      )
      if (cancel_at) {
        days_until_subscription_expires = differenceInDays(
          fromUnixTime(cancel_at!),
          Date.now()
        )
      }
    }
    return {
      ...user,
      days_until_subscription_expires
    }
  }),
})
