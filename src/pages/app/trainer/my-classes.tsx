import Button from '@components/core/button'
import ArrowUpRight from '@icons/arrow-up-right'
import PlusIcon from '@icons/plusIcon'
import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

const MyClasses: NextPageWithLayout = () => {
  const router = useRouter()
  const { data, isLoading } = trpc.trainer.getMyClasses.useQuery()

  const onEditClassClick = (classId: string) => {
    router.push(`/app/trainer/classes/${classId}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <Button
          variant="secondary"
          onClick={() => router.push('/app/trainer/add-class')}
        >
          <PlusIcon />
        </Button>
      </div>
      {data?.classes.map((cls) => (
        <div className="border-grey-200 flex flex-col gap-2 rounded-md border p-4">
          <h4 className="font-semibold">{cls.name}</h4>
          <p className="text-sm text-gray-600">{cls.description}</p>
          <Button
            icon={<ArrowUpRight />}
            className="mt-6 w-full text-sm"
            onClick={() => onEditClassClick(cls.id)}
          >
            <span>View more</span>
          </Button>
        </div>
      ))}
      {data?.classes && !!!data?.classes.length && (
        <p className="text-sm text-gray-600">Seems like you don&apos;t have any classes created yet. Go ahead a create one!</p>
      )}
    </div>
  )
}

MyClasses.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="My Classes">{page}</MainLayout>
}

export default MyClasses
