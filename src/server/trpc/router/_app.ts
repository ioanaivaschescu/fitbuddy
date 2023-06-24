// src/server/trpc/router/_app.ts
import { router } from '../trpc'
import { authRouter } from './auth'
import { userRouter } from './user'
import { gymRouter } from './gym'
import { trainerRouter } from './trainer'
import { adminRouter } from './admin'

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  gym: gymRouter,
  trainer: trainerRouter,
  admin: adminRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
