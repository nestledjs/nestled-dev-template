import { useMatches } from 'react-router'
import { WebListMyReferrals } from '@nestled-template/web'
import { WebUiDashboardList } from '@nestled-template/web-ui'
import { useState } from 'react'

export default function MyReferrals() {
  const [expanded, setExpanded] = useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={<WebListMyReferrals fontColor={'light'} selectedId={selectedId} setExpanded={setExpanded} />}
      backLink={'/members/dashboard'}
      title={'My Referrals'}
    />
  )
}
