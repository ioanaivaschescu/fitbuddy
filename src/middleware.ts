import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export default withAuth(function middleware(req) {
  const token = req.nextauth.token
  const url = req.nextUrl.clone()

  if (!token) {
    url.pathname = '/auth/signin'
    return NextResponse.rewrite(url)
  }

  if (
    (req.url.includes('/app') || url.pathname === '/') &&
    !token?.is_subscribed &&
    token.role === 'USER'
  ) {
    url.pathname = '/payment/pricing'
    return NextResponse.rewrite(url)
  }

  if (url.pathname === '/') {
    if (token.role === 'ADMIN') {
      url.pathname = '/admin/users'
    } else if (token.role === 'TRAINER') {
      url.pathname = '/app/trainer/my-classes'
    } else {
      url.pathname = '/app/overview'
    }

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/',
    '/app/:path*',
    '/auth/signout',
    '/payment/success',
    '/payment/failure'
  ]
}
