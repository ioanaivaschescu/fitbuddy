import Button from '@components/core/button'
import Input from '@components/core/input'
import Label from '@components/core/label'
import {
  SelectRoot,
  SelectIcon,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectViewport,
  SelectGroup,
  SelectItem,
  SelectContent
} from '@components/core/select'
import { zodResolver } from '@hookform/resolvers/zod'
import ChevronDownIcon from '@icons/chevron-down'
import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { trpc } from '@utils/trpc'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const OPTIONS = [
  {
    label: 'Monday',
    value: 'MONDAY'
  },
  {
    label: 'Tuesday',
    value: 'TUESDAY'
  },
  {
    label: 'Wednesday',
    value: 'WEDNESDAY'
  },
  {
    label: 'Thursday',
    value: 'THURSDAY'
  },
  {
    label: 'Friday',
    value: 'FRIDAY'
  },
  {
    label: 'Saturday',
    value: 'SATURDAY'
  },
  {
    label: 'Sunday',
    value: 'SUNDAY'
  }
] as const

export const addTimeslotSchema = z.object({
  day: z.enum(
    [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ],
    { required_error: 'Day selector is required' }
  ),
  time: z
    .string()
    .regex(
      new RegExp(/^([01]\d|20|21|22|23):[0-5]\d$/),
      'This is not a valid time format.'
    ),
  duration: z
    .number({ required_error: 'Duration is required.' })
    .min(30, 'Classes cannot last less than 30 minutes')
    .max(120, 'Classes cannot exceed 120 minutes')
})

type AddTimeslotSchema = z.infer<typeof addTimeslotSchema>

const AddTimeslot: NextPageWithLayout = () => {
  const { query, back } = useRouter()
  const {
    register,
    control,
    formState: { errors },
    handleSubmit
  } = useForm<AddTimeslotSchema>({
    resolver: zodResolver(addTimeslotSchema)
  })
  const context = trpc.useContext()
  const { mutateAsync } = trpc.trainer.createTimeslot.useMutation({
    onSuccess() {
      context.trainer.getClass.invalidate({ id: query.id as string })
    }
  })

  const onSubmit = async ({ day, time, duration }: AddTimeslotSchema) => {
    try {
      const res = await mutateAsync({
        day,
        time,
        duration,
        classId: query.id as string
      })

      if (res.success) {
        back()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit(onSubmit, (err) => console.error(err))}
    >
      <div>
        <div className="flex items-center gap-4">
          <Label htmlFor="day" error={!!errors.day?.message}>
            Select day:
          </Label>
          <Controller
            control={control}
            name="day"
            render={({ field: { onChange, ...rest } }) => {
              return (
                <SelectRoot onValueChange={(e) => onChange(e)} {...rest}>
                  <SelectTrigger error={!!errors.day?.message}>
                    <SelectValue placeholder="Day Picker" />
                    <SelectIcon>
                      <ChevronDownIcon />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectContent>
                      <SelectViewport>
                        <SelectGroup>
                          {OPTIONS.map(({ label, value }) => (
                            <SelectItem
                              key={`select-day-${value}`}
                              value={value}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectViewport>
                    </SelectContent>
                  </SelectPortal>
                </SelectRoot>
              )
            }}
          />
        </div>
        <span className="text-sm text-red-400">{errors.day?.message}</span>
      </div>

      <div className="flex items-center gap-4">
        <Input
          id="time"
          labelMessage="Time:"
          placeholder="17:30"
          error={!!errors.time?.message}
          errorMessage={errors.time?.message}
          {...register('time')}
        />
      </div>

      <div className="flex items-center gap-4">
        <Input
          id="duration"
          labelMessage="Duration in minutes:"
          placeholder="60"
          error={!!errors.duration?.message}
          errorMessage={errors.duration?.message}
          {...register('duration', { valueAsNumber: true })}
        />
      </div>

      <Button type="submit">Add timeslot</Button>
    </form>
  )
}

AddTimeslot.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="Add Class">{page}</MainLayout>
}

export default AddTimeslot
