import { Days } from '@prisma/client'
import { eachDayOfInterval, add, format, getDay } from 'date-fns'

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase()
}

const dateMapper = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY'
}

export const getNext7Days = () => {
  const now = new Date(Date.now())
  const datesArray = eachDayOfInterval({
    start: now,
    end: add(now, { days: 6 })
  })
  const datesArrayFormatted = datesArray.map((day) => format(day, 'dd/MM/yyyy'))
  const weekDaysArray = datesArray.map(
    (day) => dateMapper[getDay(day)]
  ) as Days[]

  return {
    datesArray,
    datesArrayFormatted,
    weekDaysArray
  }
}

export const getDateWithHoursSet = () => {
  const initialDate = new Date()
  const setDate = new Date(
    initialDate.getFullYear(),
    initialDate.getMonth(),
    initialDate.getDate()
  )

  return setDate
}
