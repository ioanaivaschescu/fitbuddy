import { useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

type TimeoutAmount = number | undefined

const useSignoutAfterTimeout = (timeoutAmount: TimeoutAmount = 5000) => {
  const router = useRouter()
  const { status } = useSession()

  if (status === 'authenticated') {
    signOut({ redirect: false })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/auth/signin')
    }, timeoutAmount)

    return () => clearTimeout(timeout)
  }, [])
}

export default useSignoutAfterTimeout
