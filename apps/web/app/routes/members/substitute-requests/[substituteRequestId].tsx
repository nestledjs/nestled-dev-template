import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { WebUiContainer } from '@nestled-template/web-ui'
import { WebUiSimpleListItem } from '@nestled-template/web-ui'
import { WebUiLoading } from '@nestled-template/web-ui'
import { WebUiButton } from '@nestled-template/web-ui'
import { useSubstituteQuery, useDeleteSubstituteMutation } from '@nestled-template/shared/sdk'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useGlobalCtx } from '@nestled-template/web'
import { WebUiAvatar } from '@nestled-template/web-ui'
import { SubstituteAccepted, SubstituteCommitted, SubstituteReceived, SubstituteSent } from '@nestled-template/web-ui'

dayjs.extend(utc)

export default function SubstituteRequestDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { user } = useGlobalCtx()
  const [deleteSubstitute] = useDeleteSubstituteMutation()

  const { data, loading } = useSubstituteQuery({
    variables: {
      substituteId: params.substituteRequestId || '',
    },
    skip: !params.substituteRequestId,
  })

  if (loading) {
    return <WebUiLoading />
  }

  const substitute = data?.substitute
  const isSender = substitute?.sentBy?.id === user?.id
  const isFilled = Boolean(substitute?.substitute)

  return (
    <WebUiContainer width={'max-w-4xl space-y-4'}>
      {/* Case 1: Not sender and not filled - Substitute request received */}
      {!isSender && !isFilled && (
        <>
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={(substitute?.sentBy as any)?.avatarUrl || ''} />}
            lineOne={`${substitute?.sentBy?.firstName} ${substitute?.sentBy?.lastName}`}
            lineTwo={`${(substitute?.sentBy as any)?.phone}, ${substitute?.sentBy?.email}`}
            onClick={() => navigate(`/members/member/${substitute?.sentBy?.id}`)}
          />
          <SubstituteReceived substitute={substitute as any} />
        </>
      )}

      {/* Case 2: Not sender and filled - Someone else committed */}
      {!isSender && isFilled && (
        <>
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={(substitute?.invited?.[0] as any)?.avatarUrl || ''} />}
            lineOne={`${substitute?.invited?.[0]?.firstName || ''} ${substitute?.invited?.[0]?.lastName || ''}`}
            lineTwo={`${(substitute?.invited?.[0] as any)?.phone || ''}, ${substitute?.invited?.[0]?.email || ''}`}
            onClick={() => navigate(`/members/member/${substitute?.invited?.[0]?.id}`)}
          />
          <SubstituteCommitted substitute={substitute as any} />
        </>
      )}

      {/* Case 3: Sender and not filled - Your request sent */}
      {isSender && !isFilled && (
        <>
          {(substitute?.invited || []).map((person, idx) => (
            <WebUiSimpleListItem
              key={person?.id || idx}
              type={'div'}
              avatar={<WebUiAvatar src={(person as any)?.avatarUrl || ''} />}
              lineOne={`${person?.firstName || ''} ${person?.lastName || ''}`}
              lineTwo={`${(person as any)?.phone || ''}, ${person?.email || ''}`}
              onClick={() => navigate(`/members/member/${person?.id}`)}
            />
          ))}
          <SubstituteSent substitute={substitute as any} />
        </>
      )}

      {/* Case 4: Sender and filled - Your request accepted */}
      {isSender && isFilled && (
        <>
          {(substitute?.invited || []).map((person, idx) => (
            <WebUiSimpleListItem
              key={person?.id || idx}
              type={'div'}
              avatar={<WebUiAvatar src={(person as any)?.avatarUrl || ''} />}
              lineOne={`${person?.firstName || ''} ${person?.lastName || ''}`}
              lineTwo={`${(person as any)?.phone || ''}, ${person?.email || ''}`}
              onClick={() => navigate(`/members/member/${person?.id}`)}
            />
          ))}
          <SubstituteAccepted substitute={substitute as any} />
        </>
      )}
    </WebUiContainer>
  )
}
