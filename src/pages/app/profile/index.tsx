import Button from '@components/core/button'
import ExclamationCircleIcon from '@icons/exclamationCircle'
import WarningIcon from '@icons/warning'
import MainLayout from '@layout/main'
import { useUser } from '@lib/user-provider'
import { NextPageWithLayout } from '@pages/_app'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

const Profile: NextPageWithLayout = () => {
  const router = useRouter()
  const { user } = useUser()

  const [entryURL, setEntryURL] = useState('')

  const loadPortal = async () => {
    const { data } = await axios.get('/api/portal')
    router.push(data.url)
  }

  const daysTilExpiring = (
    user?.days_until_subscription_expires === null
      ? 9999
      : user?.days_until_subscription_expires
  ) as number

  useEffect(() => {
    if (window) {
      setEntryURL(
        `${window.location.protocol}//${window.location.host}/api/admin/create-entry/${user?.id}`
      )
    }
  }, [])

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-full bg-gray-100 shadow-md">
          <img
            className="h-full w-full rounded-full bg-cover"
            src={user?.image || ''}
          />
        </div>
        <h2 className="text-2xl font-semibold">{user?.name}</h2>
      </div>
      <div className="py-8">
        <h2 className="text-center font-semibold text-gray-700 md:text-center">
          Your membership
        </h2>
      </div>
      {daysTilExpiring <= 5 && daysTilExpiring > 3 && (
        <div className="flex space-x-2 text-amber-600">
          <ExclamationCircleIcon />
          <p>You have {daysTilExpiring} days left of your membership!</p>
        </div>
      )}
      {daysTilExpiring <= 3 && (
        <div className="flex space-x-2">
          <WarningIcon />
          <p className="text-red-600">
            You have {daysTilExpiring} days left of your membership!
          </p>
        </div>
      )}
      <div className="flex justify-center py-4">
        <QRCode value={entryURL} size={184} />
      </div>
      <div className="mt-8 flex flex-col items-start gap-4 md:items-center">
        {user?.role !== 'ADMIN' && user?.role !== 'TRAINER' && (
          <Button
            className="w-full md:w-min md:whitespace-nowrap"
            onClick={loadPortal}
          >
            Manage Subscription
          </Button>
        )}
        <Button
          variant="secondary"
          className="w-full md:w-min md:whitespace-nowrap"
          onClick={() => router.push('/auth/signout')}
        >
          Sign out
        </Button>
      </div>
    </div>
  )
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Profile">{page}</MainLayout>
}

export default Profile
