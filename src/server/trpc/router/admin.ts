import { TRPCError } from '@trpc/server'
import { router, adminProcedure } from '../trpc'
import z from 'zod'
import { eachDayOfInterval, format, sub } from 'date-fns'

export const adminRouter = router({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        where: {
          NOT: {
            role: 'ADMIN'
          }
        }
      })

      return users
    } catch (err) {
      console.error(err)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
  }),
  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(['USER', 'TRAINER', 'ADMIN'])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, role } = input

      try {
        return ctx.prisma.user.update({
          where: {
            id: userId
          },
          data: {
            role
          }
        })
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  getStatistics: adminProcedure.query(async ({ ctx }) => {
    const now = Date.now()
    const last30Days = sub(now, { days: 30 })
    const interval = eachDayOfInterval({
      start: last30Days,
      end: new Date()
    })
    const intervalFormatted = interval.map((i) => format(i, 'dd-MMM'))

    try {
      const stats = await ctx.prisma.entry.groupBy({
        by: ['entryDate'],
        _count: {
          id: true
        },
        where: {
          createdAt: {
            gte: last30Days
          }
        }
      })

      const entriesFormatted = stats.map((entry) => ({
        entryDate: format(entry.entryDate, 'dd-MMM'),
        entries: entry._count.id
      }))

      const statsFormatted = intervalFormatted.map((i) => {
        const found = entriesFormatted.find((entry) => entry.entryDate === i)

        return {
          date: i,
          'Number of entries': found?.entries || 0
        }
      })

      return statsFormatted
    } catch (err) {
      console.error(err)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
  })
})
