import { ChapterMember } from '@nestled-template/shared/sdk'
import { WebContactCard } from '@nestled-template/web'
import React from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'
import { useChapterContext } from './_layout'

export default function ChapterMembers() {
  const { chapterMembers } = useChapterContext()

  return (
    <WebUiContainer width={'w-full'} className={'flex-grow min-h-screen'}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {chapterMembers?.map((member: any) => {
          if (!member?.member) return null
          const user = member.member
          const contact = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            industry: user.industry,
            avatarUrl: user.avatarUrl,
            email: user.email,
            phone: user.phone,
            awards: user.awards ?? [],
            role: member.role,
          }
          return <WebContactCard key={member.id} contact={contact as any} />
        })}
      </div>
    </WebUiContainer>
  )
}
