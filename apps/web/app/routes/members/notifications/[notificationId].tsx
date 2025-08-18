import { useNavigate, useParams } from 'react-router'
import { WebUiContainer } from '@nestled-template/web-ui'
import { WebUiAvatar } from '@nestled-template/web-ui'
import { WebUiSimpleListItem } from '@nestled-template/web-ui'
import { WebUiLoading } from '@nestled-template/web-ui'
import { WebUiButton } from '@nestled-template/web-ui'
import { CheckIcon } from '@heroicons/react/20/solid'
import React, { useContext } from 'react'
import { DashboardDataContext } from '@nestled-template/web-ui'
import {
  useMarkNotificationReadMutation,
  useMarkNotificationUnreadMutation,
  NotificationsDocument,
  useNotificationQuery,
  User,
} from '@nestled-template/shared/sdk'
import { NotificationItemDetails } from '@nestled-template/web-ui'
import { getNotificationMeta } from '@nestled-template/web'

const isClient = typeof window !== 'undefined'

export default function NotificationDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { updated, setUpdated } = useContext(DashboardDataContext)
  const [markRead] = useMarkNotificationReadMutation({
    refetchQueries: [{ query: NotificationsDocument, variables: {} }],
  })
  const [markUnread] = useMarkNotificationUnreadMutation({
    refetchQueries: [{ query: NotificationsDocument, variables: {} }],
  })

  const { data, refetch, loading } = useNotificationQuery({
    skip: !params?.notificationId,
    variables: {
      notificationId: params?.notificationId ?? 'NoId',
    },
  })

  if (!params?.notificationId) return <div>No Id</div>

  let notificationFrom: any

  switch (data?.notification?.referenceType) {
    case 'Referral':
      notificationFrom = data?.notification?.referral?.from || {}
      break
    case 'PowerHour':
      notificationFrom = data?.notification?.powerHour?.from || {}
      break
    case 'Substitute':
      notificationFrom = data?.notification?.actor || {}
      break
    case 'Testimonial':
      notificationFrom = data?.notification?.testimonial?.from || {}
      break
    default:
      notificationFrom = data?.notification?.actor || {}
  }

  let meta

  if (data?.notification) {
    meta = getNotificationMeta(data.notification)
  }

  return isClient && !data?.notification ? (
    <WebUiLoading />
  ) : (
    <WebUiContainer key={params?.notificationId} width={'max-w-4xl'}>
      <div className={'space-y-4 mb-8'}>
        <h2>{meta?.title}</h2>
        {data?.notification?.read ? (
          <WebUiButton
            buttonType={'Transparent'}
            size={'sm'}
            icon={<CheckIcon />}
            onClick={async () => {
              await markUnread({ variables: { notificationId: params?.notificationId ?? 'null' } })
              setUpdated(!updated)
            }}
          >
            Mark as Unread
          </WebUiButton>
        ) : (
          <WebUiButton
            buttonType={'Secondary'}
            size={'sm'}
            icon={<CheckIcon />}
            onClick={async () => {
              await markRead({ variables: { notificationId: params?.notificationId ?? 'null' } })
              setUpdated(!updated)
            }}
          >
            Mark as Read
          </WebUiButton>
        )}

        {notificationFrom ? (
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={notificationFrom?.avatarUrl || ''} />}
            lineOne={`${notificationFrom?.firstName} ${notificationFrom?.lastName}`}
            lineTwo={`${notificationFrom?.phone}, ${notificationFrom?.email}`}
            onClick={() => navigate(`/members/member/${notificationFrom?.id}`)}
          />
        ) : (
          <WebUiLoading />
        )}
        <NotificationItemDetails notification={data?.notification as any} />
      </div>
    </WebUiContainer>
  )
}
