import type { ReactElement } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { trpc } from '@utils/trpc'
import UserProvider from '@lib/user-provider'
import '@tremor/react/dist/esm/tremor.css'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactElement<any, any>
}

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={session}>
      <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
