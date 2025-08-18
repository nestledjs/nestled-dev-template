import { useMatches } from 'react-router'
import { WebUiDashboardList } from '@nestled-template/web-ui'
import { useState } from 'react'
import { WebListReferralsSent } from '@nestled-template/web'

export default function ReferralsSent() {
  const [expanded, setExpanded] = useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={<WebListReferralsSent fontColor={'light'} selectedId={selectedId} setExpanded={setExpanded} />}
      backLink={'/members/dashboard'}
      title={'Referrals Sent'}
    />
  )
}
