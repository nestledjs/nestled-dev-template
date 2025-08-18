import React from 'react'
import { WebListPowerHours, useGlobalCtx } from '@nestled-template/web'

export default function PowerHours() {
  const { user } = useGlobalCtx()

  return <WebListPowerHours loggedInUserId={user?.id ?? ''} />
}
