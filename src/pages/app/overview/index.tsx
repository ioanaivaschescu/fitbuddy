import Button from '@components/core/button'
import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { Days } from '@prisma/client'
import { capitalizeFirstLetter } from '@utils/misc'
import { trpc } from '@utils/trpc'
import { add, eachDayOfInterval, format, getDay } from 'date-fns'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import Link from 'next/link'
import ArrowRight from '@icons/arrow-right'
import HistoryCard from '@components/history-card'
import { useUser } from '@lib/user-provider'

const dateMapper = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
}

const Overview: NextPageWithLayout = () => {
  const router = useRouter()
  const { user } = useUser()
  const { data } = trpc.gym.getEntries.useQuery({limit: 5})

  const handleSeeMore = () => {
    router.push('/app/overview/history')
  }

  return (
    <div>
      <p className="p-8 text-3xl font-semibold text-gray-900 ">
        Hi, {user?.name}
      </p>
      <p className="mt-6 text-base font-semibold text-gray-800">Your history</p>
      <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4 shadow shadow-gray-200">
        {data?.map((entry) => (
          <HistoryCard
            key={entry.id}
            name={
              entry.entryType === 'GYM'
                ? 'Gym'
                : entry.classSchedule?.class?.name ?? ''
            }
            time={format(entry.createdAt, 'dd/MM/yyyy')}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={() => handleSeeMore()}>See more</Button>
      </div>
    </div>
  )
}

Overview.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Overview">{page}</MainLayout>
}

export default Overview
