import Button from '@components/core/button'
import { loadStripe } from '@stripe/stripe-js'
import type { Plan } from '@ts/stripe'
import axios from 'axios'
import { FC } from 'react'

type Props = {
  plan: Plan
}

const PricingCard: FC<Props> = ({ plan }) => {
  const { id, name, price: planPrice, interval, currency, description } = plan
  const price = planPrice! / 100

  const processSubscription = async (planId: string) => {
    const { data } = await axios.get(`/api/payment/${planId}`)
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_KEY as string
    )
    await stripe?.redirectToCheckout({ sessionId: data.id })
  }

  return (
    <div className="min-w-48 flex flex-col divide-y rounded-lg border-2">
      <div className="flex w-full items-center justify-center rounded-lg bg-gradient-to-tr from-gray-100 to-gray-50 py-4 text-xl font-bold">
        {name}
      </div>
      <div className="flex w-full flex-col py-8 px-4 text-center">
        <span className="text-2xl font-semibold">
          {price} {currency.toUpperCase()} / {interval}
        </span>
        <p className="text-gray-500">{description}</p>
      </div>
      <div className="flex w-full items-center justify-center py-4">
        <Button variant="primary" onClick={() => processSubscription(id)}>
          Choose plan
        </Button>
      </div>
    </div>
  )
}

export default PricingCard
