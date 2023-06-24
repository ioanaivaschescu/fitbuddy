import Button from '@components/core/button'
import GoogleSVG from '@icons/google'
import AuthLayout from '@layout/auth'
import { NextPageWithLayout } from '@pages/_app'
import { GetServerSidePropsContext, NextPage } from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { ReactElement } from 'react'

type Provider = {
  name: string
  id: string
}

type Props = {
  providers: Provider[]
}

const SignIn: NextPageWithLayout<Props> = ({ providers }) => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Welcome!</h2>
      <span className="h-[1px] w-full bg-gray-100" />
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <Button
              variant="secondary"
              icon={<GoogleSVG />}
              onClick={() =>
                signIn(provider.id, {
                  callbackUrl: `${window.location.origin}/`
                })
              }
            >
              Sign in with {provider.name}
            </Button>
          </div>
        )
      })}
    </>
  )
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout title="Sign In">{page}</AuthLayout>
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}

export default SignIn

