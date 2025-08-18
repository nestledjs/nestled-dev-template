import React from 'react'
import { useMatches } from 'react-router'
import { WebListBiz } from '@nestled-template/web'
import { WebUiDashboardList } from '@nestled-template/web-ui'

export default function BizLayout() {
  const [expanded, setExpanded] = React.useState(false)
  const matches = useMatches()
  const selectedId = matches.slice(-1)[0].pathname.split('/').pop()

  return (
    <WebUiDashboardList
      expanded={expanded}
      setExpanded={setExpanded}
      listing={<WebListBiz fontColor={'light'} selectedId={selectedId} setExpanded={setExpanded} />}
      backLink={'/members/dashboard'}
      title={'$ in Biz'}
    />
  )
}
