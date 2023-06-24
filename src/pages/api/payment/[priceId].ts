import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import stripe from '@utils/stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { priceId } = req.query
  const session = await getServerAuthSession({ req, res })

  if (!session?.user) {
    return res.send({
      error: 'You must be signed in to view the protected content on this page.'
    })
  }

  const lineItems = [
    {
      price: priceId as string,
      quantity: 1
    }
  ]

  const stripeSession = await stripe.checkout.sessions.create({
    customer: session.user.stripe_customer,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: 'http://localhost:3000/payment/success',
    cancel_url: 'http://localhost:3000/payment/failure'
  })

  res.send({
    id: stripeSession.id
  })
}

export default handler
