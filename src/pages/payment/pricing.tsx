import stripe from '@utils/stripe'
import type { Plan } from '@ts/stripe'
import PricingCard from '@components/pricing-card'
import { NextPageWithLayout } from '@pages/_app'
import PaymentLayout from '@layout/payment'
import { ReactElement } from 'react'

type Props = {
  plans: Plan[]
}

const Pricing: NextPageWithLayout<Props> = ({ plans }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Pricing</h2>
      <div className="px-4 text-gray-500">
        <p>Below you can see all our pricing plans.</p>
        <p>Can&apos;t wait to have you as a member!</p>
      </div>
      <span className="h-[1px] w-full bg-gray-100" />
      <div className="space-y-4">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
    </>
  )
}

Pricing.getLayout = function getLayout(page: ReactElement) {
  return <PaymentLayout title="Pricing">{page}</PaymentLayout>
}

export const getStaticProps = async () => {
  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product as string)

      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring?.interval,
        currency: price.currency,
        description: product.description
      }
    })
  )

  const sortedPlans = plans.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))

  return {
    props: {
      plans: sortedPlans
    }
  }
}

export default Pricing
