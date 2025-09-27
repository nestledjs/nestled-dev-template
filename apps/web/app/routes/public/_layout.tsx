import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router'
import React from 'react'
import { WebUiFooter, WebUiHeader } from '@nestled-template/web-ui'
import { getCookie } from '@nestled-template/shared/utils'
import { useGlobalCtx } from '@nestled-template/web'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session')
  if (token) {
    return { isAuthenticated: true }
  }
  return { isAuthenticated: false }
}

export default function PublicLayout() {
  const loaderData = useLoaderData<typeof loader>()
  const { user } = useGlobalCtx()
  const isAuthenticated = !!user || !!loaderData?.isAuthenticated
  return (
    <>
      <WebUiHeader
        logo={'/logo.png'}
        icon={'/icon.png'}
        siteName={'Demo Site'}
        navigation={[
          { name: 'Features', href: '/features' },
          { name: 'Pricing', href: '/pricing' },
          { name: 'Blog', href: '/blog' },
          { name: 'Sign Up', href: '/register' },
        ]}
        isAuthenticated={isAuthenticated}
      />
      <Outlet />
      <WebUiFooter />
    </>
  )
}
