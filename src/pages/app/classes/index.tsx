import { NextPageWithLayout } from '@pages/_app'
import type { ReactElement } from 'react'
import MainLayout from '@layout/main'
import { Days } from '@prisma/client'
import { capitalizeFirstLetter, getNext7Days } from '@utils/misc'
import { trpc } from '@utils/trpc'
import { eachDayOfInterval, add, format, getDay } from 'date-fns'
import ClassCard from '@components/class-card'

const dateMapper = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
}

const Classes: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.gym.getClasses.useQuery()

  const { datesArrayFormatted, weekDaysArray } = getNext7Days()

  const weekDayClassNames = 'text-base font-semibold text-gray-800'

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Upcoming classes</h1>
      <div className="mt-16 flex flex-col gap-8">
        {weekDaysArray.map((weekDay, idx) => (
          <div key={`weekday-${weekDay}`}>
            {idx === 0 && (
              <h2 className={weekDayClassNames}>
                Today, {capitalizeFirstLetter(weekDay)},{' '}
                {datesArrayFormatted[idx]}
              </h2>
            )}

            {idx === 1 && (
              <h2 className={weekDayClassNames}>
                Tomorrow, {capitalizeFirstLetter(weekDay)},{' '}
                {datesArrayFormatted[idx]}
              </h2>
            )}

            {idx > 1 && (
              <h2 className={weekDayClassNames}>
                {capitalizeFirstLetter(weekDay)}, {datesArrayFormatted[idx]}
              </h2>
            )}
            <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4 shadow shadow-gray-200">
              {data && data[weekDay]?.length === 0 && (
                <p className="py-2 text-sm font-normal text-gray-400">
                  No classes scheduled for {capitalizeFirstLetter(weekDay)}.
                </p>
              )}
              {data &&
                data[weekDay]?.map((entry) => (
                  <ClassCard
                    key={`gym-entry-${entry.id}`}
                    id={entry.id}
                    class={entry.class}
                    time={entry.time}
                    duration={entry.duration}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Classes.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Classes">{page}</MainLayout>
}

export default Classes
