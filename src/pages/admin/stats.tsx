import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { ReactElement } from 'react'
import { Card, Title, AreaChart } from '@tremor/react'

const Stats: NextPageWithLayout = () => {
  const { data } = trpc.admin.getStatistics.useQuery()

  return (
    <div>
      <Card>
        <Title>Last 30 days activity</Title>
        <AreaChart
          data={data || []}
          categories={['Number of entries']}
          dataKey="date"
          height="h-72"
          colors={['indigo']}
          marginTop="mt-4"
        />
      </Card>
    </div>
  )
}

Stats.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Statistics">{page}</MainLayout>
}

export default Stats
