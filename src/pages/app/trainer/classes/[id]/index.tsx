import Button from '@components/core/button'
import Textarea from '@components/core/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import CalendarIcon from '@icons/calendar'
import PenIcon from '@icons/pen'
import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import Input from '@components/core/input'
import { ReactElement, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AddClassSchema, addClassSchema } from '../../add-class'
import XCircle from '@icons/x-circle'
import { capitalizeFirstLetter } from '@utils/misc'

const Class: NextPageWithLayout = () => {
  const { query, push } = useRouter()
  const context = trpc.useContext()

  const { data } = trpc.trainer.getClass.useQuery({
    id: query.id as string
  })
  const { mutateAsync } = trpc.trainer.updateClass.useMutation({
    onSuccess() {
      context.trainer.getClass.invalidate({ id: query.id as string })
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddClassSchema>({
    defaultValues: {
      name: data?.cls?.name,
      description: data?.cls?.description,
      maxSlots: data?.cls?.maxSlots
    },
    resolver: zodResolver(addClassSchema)
  })

  const [viewMode, setViewMode] = useState<'normal' | 'edit'>('normal')

  const onEditClick = () =>
    setViewMode((prev) => (prev === 'normal' ? 'edit' : 'normal'))

  const onSubmit = async (data: AddClassSchema) => {
    try {
      await mutateAsync({ id: query.id as string, data })
      setViewMode('normal')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          icon={<CalendarIcon />}
          onClick={() =>
            push(`/app/trainer/classes/${query.id as string}/add-timeslot`)
          }
        >
          Add Timeslot
        </Button>
        <Button
          icon={viewMode === 'normal' ? <PenIcon /> : <XCircle />}
          onClick={onEditClick}
        >
          {viewMode === 'normal' ? 'Edit' : 'Cancel Edit'}
        </Button>
      </div>
      {viewMode === 'normal' && (
        <div className="mt-8 flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {data?.cls?.name}
          </h1>
          <p className="text-gray-600">{data?.cls?.description}</p>
          <p className="text-gray-600">
            <b className="text-gray-900">Max Slots</b>: {data?.cls?.maxSlots}
          </p>
          <div className="mt-8 flex flex-col gap-4">
            <p className="font-bold text-gray-900">Timeslots:</p>
            <ul className="flex list-none flex-col gap-2">
              {data?.cls?.classSchedule.map((entry) => (
                <li key={entry.id}>
                  {capitalizeFirstLetter(entry?.day || '')} at {entry.time} for{' '}
                  {entry.duration} minutes
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {viewMode === 'edit' && (
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            id="name"
            labelMessage="Name"
            error={!!errors.name?.message}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Textarea
            id="description"
            rows={5}
            labelMessage="Description"
            error={!!errors.description?.message}
            errorMessage={errors.description?.message}
            {...register('description')}
          />
          <Input
            type="number"
            id="maxSlots"
            labelMessage="Maximum Slots"
            error={!!errors.name?.message}
            errorMessage={errors.name?.message}
            {...register('maxSlots', { valueAsNumber: true })}
          />
          <Button>Add class</Button>
        </form>
      )}
    </div>
  )
}

Class.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Add Class">{page}</MainLayout>
}

export default Class
