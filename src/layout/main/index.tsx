import Button from '@components/core/button'
import Navbar from '@components/navbar'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PropsWithChildren } from 'react'

const MainLayout = ({
  children,
  title
}: PropsWithChildren<{ title?: string }>) => {
  const router = useRouter()
  const isNestedRoute = router.pathname.split('/').slice(2).length > 1

  return (
    <>
      <Head>
        <title>FitBuddy - {title}</title>
      </Head>
      <div className="relative min-h-full w-full bg-gray-50">
        {isNestedRoute ? (
          <div className="flex h-16 items-center space-x-8 bg-gray-200 p-4 text-gray-700">
            <Button
              variant="secondary"
              size="small"
              className="text-gray-700"
              onClick={() => router.back()}
            >
              ←
            </Button>
            <h1 className="text-md font-bold">FitBuddy</h1>
          </div>
        ) : (
          <div className="flex h-16 items-center p-4 text-gray-700">
            <h1 className="text-md font-bold">FitBuddy</h1>
          </div>
        )}
        <div className="p-4 pb-24">{children}</div>
        <Navbar />
      </div>
    </>
  )
}

export default MainLayout
