import { useState } from 'react'
import { useMatches } from 'react-router'
import { WebUiDashboardList } from '@nestled-template/web-ui'
import { WebListNotifications } from '@nestled-template/web'

export default function NotificationsLayout() {
  const [expanded, setExpanded] = useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={<WebListNotifications fontColor={'light'} selectedId={selectedId} setExpanded={setExpanded} />}
      backLink={'/members/dashboard'}
      title={'Notifications'}
    />
  )
}
