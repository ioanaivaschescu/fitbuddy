import MainLayout from '@layout/main'
import { trpc } from '@utils/trpc'
import { ReactElement } from 'react'
import { Card, Title, DonutChart } from '@tremor/react'
import HistoryCard from '@components/history-card'
import { format } from 'date-fns'

const History = () => {
  const { data } = trpc.gym.getEntries.useQuery({})

  const cntGym = data?.filter((entry) => entry.entryType === 'GYM').length
  const cntClass = data?.filter((entry) => entry.entryType === 'CLASS').length

  const chartData = [
    {
      name: 'Gym',
      times: cntGym
    },
    {
      name: 'Class',
      times: cntClass
    }
  ]

  return (
    <div>
      <Card maxWidth="max-w-md">
        <Title>Gym vs Class</Title>
        <DonutChart
          showAnimation={true}
          data={chartData}
          showLabel={false}
          category="times"
          dataKey="name"
          marginTop="mt-6"
          colors={['rose', 'amber']}
        />
      </Card>
      <div className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white px-4 shadow shadow-gray-200">
        {data?.map((entry) => (
          <HistoryCard
            key={entry.id}
            name={entry.entryType}
            time={format(entry.entryDate, 'dd/MM/yyyy')}
          />
        ))}
      </div>
    </div>
  )
}

History.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="History">{page}</MainLayout>
}

export default History
