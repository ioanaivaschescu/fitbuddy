import Button from '@components/core/button'
import FailureIcon from '@icons/failure'
import LoadingSpinner from '@icons/loadingSpinner'
import SuccessIcon from '@icons/success'
import AuthLayout from '@layout/auth'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const CreateEntry: NextPageWithLayout = () => {
  const { query } = useRouter()
  const {
    mutate: createEntry,
    isSuccess,
    isError,
    isLoading,
    isIdle
  } = trpc.gym.createEntry.useMutation({
    retry: false
  })
  const { data: bookings } = trpc.gym.hasGymEntry.useQuery({
    userId: query.userId as string
  })

  const handleCreateGymEntry = async () => {
    await createEntry({ userId: query.userId as string })
  }

  const handleCreateClassEntry = async () => {
    await createEntry({
      userId: query.userId as string,
      timeslotId: bookings?.[0]?.timeslotId
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 text-sm text-gray-600">
      {isSuccess && (
        <>
          <SuccessIcon />
          Success
        </>
      )}
      {isError && (
        <>
          <FailureIcon />
          Failure
        </>
      )}
      {isLoading && <LoadingSpinner />}
      {(isIdle || isLoading) && (
        <Button onClick={handleCreateGymEntry} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Create Gym Entry'}
        </Button>
      )}
      {!!bookings?.length && (isIdle || isLoading) && (
        <Button
          variant="secondary"
          onClick={handleCreateClassEntry}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Create Class Entry'}
        </Button>
      )}
    </div>
  )
}

CreateEntry.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout title="Create Gym Entry">{page}</AuthLayout>
}

export default CreateEntry
