import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router'
import React from 'react'
import { WebUiFooter, WebUiHeader } from '@nestled-template/web-ui'
import { getCookie } from '@nestled-template/shared/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session_biz')
  if (token) {
    return { isAuthenticated: true }
  }
  return { isAuthenticated: false }
}

export default function PublicLayout() {
  const loaderData = useLoaderData<typeof loader>()
  return (
    <>
      <WebUiHeader
        logo={'/nestled-templatenowlogo.png'}
        icon={'/nestled-templatenowicon.png'}
        siteName={'Biz to Biz Now'}
        navigation={[
          { name: 'About', href: '/about' },
          { name: 'Chapters', href: '/directory/chapters' },
          { name: 'Awards', href: '/award-winners' },
          { name: 'Blog', href: '/blog' },
          { name: 'Contact', href: '/contact' },
        ]}
        isAuthenticated={loaderData?.isAuthenticated}
      />
      <Outlet />
      <WebUiFooter />
    </>
  )
}
