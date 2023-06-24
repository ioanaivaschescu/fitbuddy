import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect
} from 'react'
import { trpc } from '@utils/trpc'
import type { inferProcedureOutput } from '@trpc/server'
import type { AppRouter } from '@server/trpc/router/_app'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

type Context = {
  user:
    | inferProcedureOutput<AppRouter['_def']['procedures']['user']['init']>
    | undefined
}

const UserContext = createContext<Context>({
  user: undefined
})

const UserProvider = ({ children }: PropsWithChildren) => {
  const session = useSession()
  const { data, isLoading } = trpc.user.init.useQuery(undefined, {
    retry: 0,
    enabled: session.status === 'authenticated'
  })

  if (session.status === 'authenticated' && isLoading) {
    return <p>Loading... </p>
  }

  return (
    <UserContext.Provider value={{ user: data }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserProvider
