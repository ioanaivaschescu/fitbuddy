import { NextApiRequest, NextApiResponse } from 'next'
import stripe from '@utils/stripe'
import { buffer } from 'micro'
import { prisma } from '@server/db/client'

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const signature = req.headers['stripe-signature']
  const signingSecret = process.env.STRIPE_SIGNING_SECRET
  const reqBuffer = await buffer(req)

  let event
  try {
    //@ts-ignore
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (err) {
    console.log(err)
    return res.status(400).send(`Webhook error`)
  }

  switch (event.type) {
    case 'customer.subscription.created':
      await prisma.user.update({
        where: {
          //@ts-ignore
          stripe_customer: event.data.object.customer
        },
        data: {
          is_subscribed: true,
          //@ts-ignore
          subscription_id: event.data.object.id
        }
      })
      return res.status(201).send(`Stripe Webhook - Subscription Created`)
    case 'customer.subscription.deleted':
      await prisma.user.update({
        where: {
          //@ts-ignore
          stripe_customer: event.data.object.customer
        },
        data: {
          //@ts-ignore
          subscription_id: event.data.object.id
        }
      })
      return res.status(200).send(`Stripe Webhook - Subscription Updated`)
    case 'customer.subscription.deleted':
      await prisma.user.update({
        where: {
          //@ts-ignore
          stripe_customer: event.data.object.customer
        },
        data: {
          is_subscribed: false,
          subscription_id: null
        }
      })
      return res.status(200).send(`Stripe Webhook - Subscription Deleted`)
  }
}

export default handler
