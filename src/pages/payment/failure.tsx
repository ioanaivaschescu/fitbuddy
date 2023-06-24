import type { ReactElement } from 'react'
import PaymentLayout from '@layout/payment'
import useSignoutAfterTimeout from '@lib/use-signout-after-timeout'
import type { NextPageWithLayout } from '@pages/_app'
import FailureIcon from '@icons/failure'

const Failure: NextPageWithLayout = () => {
  useSignoutAfterTimeout()

  return (
    <>
      <FailureIcon />
      <div className="px-4 text-sm font-light">
        There has been a problem with your payment. You'll be redirected to
        login in 5 seconds.
      </div>
    </>
  )
}

Failure.getLayout = function getLayout(page: ReactElement) {
  return <PaymentLayout title="Payment Failed">{page}</PaymentLayout>
}

export default Failure
