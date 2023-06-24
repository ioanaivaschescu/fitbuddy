import { ReactElement } from 'react'
import MainLayout from '@layout/main'
import { useRouter } from 'next/router'
import { trpc } from '@utils/trpc'
import { getNext7Days } from '@utils/misc'
import Button from '@components/core/button'
import { parse } from 'date-fns'
import Avatar from '@components/avatar'

const TimeslotDetails = () => {
  const { query, back } = useRouter()
  const { data } = trpc.gym.getTimeslot.useQuery({
    id: (query.timeslotId as string) || ''
  })

  const { mutateAsync } = trpc.gym.createBooking.useMutation()

  const { datesArrayFormatted, weekDaysArray } = getNext7Days()
  const weekDayIdx = weekDaysArray.findIndex((val) => val === data?.day)
  const dayInWhichItTakesPlace = datesArrayFormatted[weekDayIdx] as string

  const isButtonDisabled =
    data?.userAlreadyBooked || data?.class?.maxSlots! - data?.spotsBooked! === 0

  const handleCreateBooking = async () => {
    try {
      const res = await mutateAsync({
        id: query.timeslotId as string,
        date: dayInWhichItTakesPlace,
        time: data?.time as string
      })
      if (res.success) {
        back()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-full flex-col gap-24 pb-32">
      <div>
        <h1 className="mt-16 p-4 text-xl font-semibold">{data?.class?.name}</h1>
        <div className="p-4 text-gray-800">
          <p>Trainer: {data?.class?.trainer.name}</p>
          <p>Date: {dayInWhichItTakesPlace} </p>
          <p>Time: {data?.time}</p>
          <p>Spots left: {data?.class?.maxSlots! - data?.spotsBooked!}</p>
        </div>
        <p className="mt-8 p-4 text-sm text-gray-600">
          {data?.class?.description}
        </p>
        <div className="mt-4 p-4 ">
          <h2 className="text-lg font-semibold">People that already booked</h2>
          <div className="flex gap-4 mt-2">
            {data?.usersThatBooked.length !== 0 ? data?.usersThatBooked.map((entry) => <Avatar key={entry.id} name={entry.name!}/>) : <p className="text-gray-500 text-sm">No users booked yet.</p>}
          </div>
        </div>
      </div>
      <Button disabled={isButtonDisabled} onClick={() => handleCreateBooking()}>
        Book spot
      </Button>
    </div>
  )
}

TimeslotDetails.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Classes">{page}</MainLayout>
}

export default TimeslotDetails
