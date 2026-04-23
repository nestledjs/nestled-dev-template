import { getSessionCookieName } from '@nestled-template/shared/utils'
import { redirect } from 'react-router'

export async function loader({ request }: { request: Request }) {
  const cookieName = getSessionCookieName()
  const url = new URL(request.url)
  const returnUrl = url.searchParams.get('return_url')
  const loginPath = returnUrl ? `/login?return_url=${encodeURIComponent(returnUrl)}` : '/login'

  return redirect(loginPath, {
    headers: {
      'Set-Cookie': `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
    },
  })
}

export default function ForceLogoutRoute() {
  return null
}
