import React from 'react'
import { LoaderFunctionArgs } from 'react-router'
import { useLoaderData } from 'react-router'
import { getJsonCookie } from '@nestled-template/shared/utils'
import { User } from '@nestled-template/shared/sdk'
// ❌ MISSING: WebListMeetingAttendance needs to be created in @nestled-template/web
import { WebListMeetingAttendance } from '@nestled-template/web'

export async function loader({ request }: LoaderFunctionArgs) {
  const activeUser: User | null = getJsonCookie<User>(request.headers, '__user')
  return activeUser
}

export default function MeetingAttendance() {
  const activeUser: User | null = useLoaderData<typeof loader>()
  return <WebListMeetingAttendance loggedInUserId={activeUser?.id ?? ''} />
}
