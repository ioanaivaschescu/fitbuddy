import { Class, ClassSchedule, User } from '@prisma/client'
import { formatDuration, intervalToDuration } from 'date-fns'
import ArrowRight from '@icons/arrow-right'
import Link from 'next/link'

type Props = Omit<ClassSchedule, 'classId' | 'day'> & {
  class: Class & { trainer: User }
}

const ClassCard = ({
  id,
  class: { name, trainer },
  time,
  duration
}: Props) => {
  return (
    <Link href={`/app/classes/${id}`}>
      <div className="flex items-center justify-between py-2">
        <div>
          <div className="text-sm font-semibold text-gray-600">{name}</div>
          <p className="text-sm text-gray-400">
            At: <b className="font-medium">{time}</b> with {trainer?.name}
          </p>
          <p className="text-sm text-gray-400">
            Duration: <b className="font-medium">{duration}</b>
          </p>
        </div>
        <ArrowRight />
      </div>
    </Link>
  )
}

export default ClassCard
