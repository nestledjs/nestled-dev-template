import { useMatches } from 'react-router'
import { WebUiDashboardList } from '@nestled-template/web-ui'
import { useState } from 'react'
import { WebListPowerHours, useGlobalCtx } from '@nestled-template/web'

export default function PowerHours() {
  const { user } = useGlobalCtx()
  const [expanded, setExpanded] = useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={
        <WebListPowerHours
          loggedInUserId={user?.id ?? ''}
          fontColor={'light'}
          selectedId={selectedId}
          setExpanded={setExpanded}
        />
      }
      backLink={'/members/dashboard'}
      title={'Power Hours'}
    />
  )
}
