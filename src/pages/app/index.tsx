import MainLayout from '@layout/main'
import { NextPageWithLayout } from '@pages/_app'
import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'

const Index: NextPageWithLayout = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('app/overview')
  }, [])

  return null
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default Index
