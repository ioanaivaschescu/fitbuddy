import { Class, ClassSchedule, Days, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { getDateWithHoursSet } from '@utils/misc'
import { add, parse, sub } from 'date-fns'
import { z } from 'zod'
import { adminProcedure, protectedProcedure, router } from '../trpc'

export const gymRouter = router({
  createEntry: adminProcedure
    .input(z.object({ userId: z.string(), timeslotId: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const { userId, timeslotId } = input

      const entryDate = new Date(Date.now())

      try {
        await ctx.prisma.entry.create({
          data: {
            userId,
            entryDate: entryDate,
            entryType: timeslotId ? 'CLASS' : 'GYM',
            timeslotId
          }
        })

        return {
          success: true
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  hasGymEntry: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input

      try {
        const currentDate = new Date()
        const dateEarly = sub(currentDate, { minutes: 30 })
        const dateLate = add(currentDate, { minutes: 30 })

        const data = await ctx.prisma.classBooking.findMany({
          where: {
            AND: [
              {
                date: {
                  lte: dateLate
                }
              },
              {
                date: {
                  gte: dateEarly
                }
              },
              {
                userId
              }
            ]
          }
        })

        return data
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  getClasses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const res = await ctx.prisma.classSchedule.findMany({
        include: {
          class: {
            include: {
              trainer: true
            }
          }
        },
        orderBy: {
          day: 'asc'
        }
      })
      const resultMap: Record<
        Days,
        Omit<ClassSchedule & { class: Class & { trainer: User } }, 'day'>[]
      > = {
        MONDAY: [],
        TUESDAY: [],
        WEDNESDAY: [],
        THURSDAY: [],
        FRIDAY: [],
        SATURDAY: [],
        SUNDAY: []
      }
      for (const { day, ...entry } of res) {
        resultMap[day!].push(entry)
      }

      return resultMap
    } catch (err) {
      console.error(err)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
  }),
  getTimeslot: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input
      const { user } = ctx.session

      const findTimeslot = ctx.prisma.classSchedule.findUnique({
        include: {
          class: {
            include: {
              trainer: true
            }
          }
        },
        where: { id }
      })
      const findSpotsBooked = ctx.prisma.classBooking.count({
        where: {
          date: {
            gt: new Date(Date.now())
          }
        }
      })
      const findUsersThatBooked = async () => {
        const setDate = getDateWithHoursSet()
        const res = await ctx.prisma.classBooking.findMany({
          select: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          where: {
            timeslotId: id,
            date: {
              gte: setDate
            }
          }
        })
        return res.map((result) => result.user)
      }
      try {
        const [promise1, promise2, promise3] = await Promise.all([
          findTimeslot,
          findSpotsBooked,
          findUsersThatBooked()
        ])
        return {
          ...promise1,
          spotsBooked: promise2,
          usersThatBooked: promise3,
          userAlreadyBooked: promise3.some((el) => el.id === user.id)
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  createBooking: protectedProcedure
    .input(z.object({ id: z.string(), date: z.string(), time: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id, date, time } = input
      const { user } = ctx.session

      const timeslotHour = parseInt(time.split(':')[0] as string)
      const timeslotMinutes = parseInt(time.split(':')[1] as string)

      const dateParsed = parse(date, 'dd/MM/yyyy', new Date())
      dateParsed.setHours(timeslotHour, timeslotMinutes, 0)

      try {
        await ctx.prisma.classBooking.create({
          data: { timeslotId: id, date: dateParsed, userId: user.id }
        })

        return {
          success: true
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  adminClassBooking: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input
      const todayBookings = () =>
        ctx.prisma.classBooking.findMany({
          include: {
            timeslot: {
              include: {
                class: true
              }
            }
          },
          where: {
            userId: id,
            date: {
              equals: getDateWithHoursSet()
            }
          }
        })
      const alreadyWentTo = () =>
        ctx.prisma.entry.findMany({
          include: {
            classSchedule: true
          },
          where: {
            userId: id,
            AND: [
              {
                createdAt: {
                  gte: getDateWithHoursSet()
                }
              },
              {
                createdAt: {
                  lte: add(getDateWithHoursSet(), {
                    hours: 25,
                    minutes: 59,
                    seconds: 59
                  })
                }
              }
            ]
          }
        })
      try {
        const [p1, p2] = await Promise.all([todayBookings(), alreadyWentTo()])

        const resultSet = p1.filter((e1) =>
          p2.every((e2) => e2.timeslotId !== e1.timeslotId)
        )
        return resultSet
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  getEntries: protectedProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { limit } = input
      try {
        const res = await ctx.prisma.entry.findMany({
          include: {
            classSchedule: {
              include: {
                class: true
              }
            }
          },
          where: {
            userId: user.id
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: limit
        })
        return res
      } catch (err) {
        console.error(err)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR'
        })
      }
    })
})
