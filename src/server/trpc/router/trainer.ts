import { addClassSchema } from '@pages/app/trainer/add-class'
import { addTimeslotSchema } from '@pages/app/trainer/classes/[id]/add-timeslot'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { router, publicProcedure, protectedProcedure,  trainerProcedure } from '../trpc'

export const trainerRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return 'You are logged in and can see this secret message!'
  }),
  createClass: trainerProcedure
    .input(addClassSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description, maxSlots } = input
      const { user } = ctx.session

      try {
        await ctx.prisma?.class.create({
          data: {
            name,
            description,
            trainerId: user!.id,
            maxSlots
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
  getMyClasses: trainerProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session

    try {
      const classes = await ctx.prisma.class.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          maxSlots: true
        },
        where: {
          trainerId: user!.id
        }
      })

      return {
        classes
      }
    } catch (err) {
      console.error(err)
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
    }
  }),
  getClass: trainerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input

      try {
        const cls = await ctx.prisma.class.findUnique({
          include: {
            classSchedule: true
          },
          where: {
            id
          }
        })

        return {
          cls
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    }),
  updateClass: trainerProcedure
    .input(z.object({ id: z.string(), data: addClassSchema }))
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input

      try {
        await ctx.prisma.class.update({
          where: {
            id
          },
          data: {
            ...data
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
  createTimeslot: trainerProcedure
    .input(addTimeslotSchema.merge(z.object({ classId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session
      const { day, time, duration, classId } = input

      try {
        await ctx.prisma.classSchedule.create({
          data: {
            classId,
            day,
            time,
            duration
          }
        })

        return {
          success: true
        }
      } catch (err) {
        console.error(err)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      }
    })
})
