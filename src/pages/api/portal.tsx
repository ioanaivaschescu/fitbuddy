import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '@server/common/get-server-auth-session'
import stripe from '@utils/stripe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })

  if (!session?.user) {
    return res.send({
      error: 'You must be signed in to view the protected content on this page.'
    })
  }

  const stripePortal = await stripe.billingPortal.sessions.create({
    customer: session.user.stripe_customer,
    return_url: 'http://localhost:3000/app/overview'
  })

  res.send({
    url: stripePortal.url
  })
}

export default handler
