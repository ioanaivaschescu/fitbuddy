import MainLayout from '@layout/main'
import { ReactElement, useState } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@components/core/input'
import Textarea from '@components/core/textarea'
import Button from '@components/core/button'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'

export const addClassSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(24, 'Description must be at least 24 characters long'),
  maxSlots: z
    .number()
    .min(0, 'Slots must be greater than 0')
    .max(64, 'The Gym is not allowed to have more than 64 people in a class')
})

export type AddClassSchema = z.infer<typeof addClassSchema>

const AddClass = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AddClassSchema>({
    defaultValues: {
      name: '',
      description: '',
      maxSlots: 0
    },
    resolver: zodResolver(addClassSchema)
  })

  const { mutateAsync } = trpc.trainer.createClass.useMutation()

  const onSubmit = async ({ name, description, maxSlots }: AddClassSchema) => {
    try {
      const res = await mutateAsync({ name, description, maxSlots })
      if (res.success) {
        router.back()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, (err) => console.error(err))}
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
  )
}

AddClass.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Add Class">{page}</MainLayout>
}

export default AddClass
