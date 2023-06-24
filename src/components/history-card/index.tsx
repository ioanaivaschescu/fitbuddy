import { Class } from '@prisma/client'

type Props = Pick<Class, 'name'> & { time: string }

const HistoryCard = ({ name, time }: Props) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-semibold text-gray-600">{name}</div>
        <b className="text-sm font-medium text-gray-400">{time}</b>
      </div>
    </div>
  )
}

export default HistoryCard
