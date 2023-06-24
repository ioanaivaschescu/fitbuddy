import { ReactElement } from 'react'
import PaymentLayout from '@layout/payment'
import useSignoutAfterTimeout from '@lib/use-signout-after-timeout'
import type { NextPageWithLayout } from '@pages/_app'
import SuccessIcon from '@icons/success'

const Success: NextPageWithLayout = () => {
  useSignoutAfterTimeout()
  return (
    <>
      <SuccessIcon />
      <div className="px-4 text-sm font-light">
        Your payment has been successfully received! You'll be now logged out in
        5 seconds in order to have access to the latest information.
      </div>
    </>
  )
}
Success.getLayout = function getLayout(page: ReactElement) {
  return <PaymentLayout title="Payment Success">{page}</PaymentLayout>
}

export default Success
