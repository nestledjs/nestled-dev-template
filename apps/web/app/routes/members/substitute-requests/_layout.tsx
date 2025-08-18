import { useMatches } from 'react-router'
import { WebUiDashboardList } from '@nestled-template/web-ui'
import { useState } from 'react'
import { WebListSubstituteRequests } from '@nestled-template/web'

export default function SubstituteRequestsLayout() {
  const [expanded, setExpanded] = useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={<WebListSubstituteRequests fontColor={'light'} selectedId={selectedId} setExpanded={setExpanded} />}
      backLink={'/members/dashboard'}
      title={'Substitute Requests'}
    />
  )
}
