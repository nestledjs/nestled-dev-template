import React, { ReactElement, useEffect, useState } from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'
import { useChapterContext } from './_layout'
import {
  ChapterMember,
  ChapterMemberRole,
  Maybe,
  Role,
  useUpdateChapterMutation,
  useIndustriesQuery,
  CreateReplaceUploadInput,
  useUploadChapterImageMutation,
  useUserDeleteUploadMutation,
} from '@nestled-template/shared/sdk'
import { WebUiSimpleListItem } from '@nestled-template/web-ui'
import { WebUiAvatar } from '@nestled-template/web-ui'
import { useNavigate, useLoaderData, LoaderFunctionArgs } from 'react-router'
import { WebUiEditableText } from '@nestled-template/web-ui'
import { WebUiImageUpload } from '@nestled-template/web'
import { PencilIcon } from '@heroicons/react/24/outline'
import { useGlobalCtx } from '@nestled-template/web'
import { getCookie } from '@nestled-template/shared/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session_biz')
  return { token }
}

interface LeaderListProps {
  leaders: ChapterMember[]
  navigate: (path: string) => void
}
export function LeaderList({ leaders, navigate }: Readonly<LeaderListProps>): ReactElement {
  const order: { [key: string]: number } = {
    President: 1,
    VicePresident: 2,
    Chairperson: 3,
    Trainer: 4,
    Mentor: 5,
  }

  function sortLeadersByRole(leaders: ChapterMember[], order: { [key: string]: number }) {
    return [...leaders].sort((a, b) => {
      // First sort by role priority
      const roleOrder = (order[a.role ?? ''] ?? 0) - (order[b.role ?? ''] ?? 0)

      // If both are mentors, sort by membership date if available
      if (roleOrder === 0 && a.role === 'Mentor' && b.role === 'Mentor') {
        const dateA = (a as any).member?.membershipDate
        const dateB = (b as any).member?.membershipDate
        if (dateA && dateB) {
          return new Date(dateA).getTime() - new Date(dateB).getTime()
        }
      }

      return roleOrder
    })
  }

  const sortedLeaders = sortLeadersByRole(leaders, order)

  return (
    <>
      {sortedLeaders?.map((leader) => (
        <WebUiSimpleListItem
          key={leader.id}
          avatar={<WebUiAvatar size={'lg'} src={(leader as any)?.member?.avatarUrl ?? ''} />}
          lineOne={`${(leader as any)?.member?.firstName} ${(leader as any)?.member?.lastName}`}
          lineTwo={leader?.role ?? ''}
          onClick={() => navigate(`/members/member/${(leader as any)?.member?.id}`)}
        />
      ))}
    </>
  )
}

export default function ChapterDetailHome() {
  const navigate = useNavigate()
  const loaderData = useLoaderData<typeof loader>()
  const { chapter, chapterLeader, chapterLeaders, chapterMembers, isMember, refetch } = useChapterContext()
  const { user: activeUser } = useGlobalCtx()
  const { data: industries } = useIndustriesQuery()
  const [deleteUpload] = useUserDeleteUploadMutation()
  const [uploadChapterImage] = useUploadChapterImageMutation()
  const [updateChapter] = useUpdateChapterMutation()
  const [path, setPath] = useState('')

  useEffect(() => {
    setPath(window.location.host)
  }, [])

  const isAdmin = activeUser?.role === Role.Admin

  async function updateMeetingDetails(newText: Maybe<string> | undefined) {
    await updateChapter({ variables: { chapterId: chapter?.id ?? 'NoId', input: { meetingDetails: newText } } })
  }

  const trainerEmailList = chapter?.members
    ?.filter((member: any) => (member.role as string) === 'Trainer' && member?.member?.email)
    .map((trainer: any) => trainer?.member?.email)
    .join(';')

  const mentorEmailList = chapter?.members
    ?.filter((member: any) => (member.role as string) === 'Mentor' && member?.member?.email)
    .map((mentor: any) => mentor?.member?.email)
    .join(';')

  const leaderEmailList = chapterLeaders
    ?.filter((leader: any) => leader?.member?.email)
    ?.map((leader: any) => leader?.member?.email)
    .join(';')

  const memberEmailList = chapterMembers
    ?.filter((member: any) => member?.member?.email)
    ?.map((member: any) => member?.member?.email)
    .join(';')

  // Deduplicate leader emails (including trainers)
  const deduplicatedLeaderEmails = [
    ...new Set((leaderEmailList ?? '').split(';').concat((trainerEmailList ?? '').split(';'))),
  ].join(';')

  // Deduplicate leader, trainer, and mentor emails
  const deduplicatedLeaderMentorEmails = [
    ...new Set(
      (leaderEmailList ?? '')
        .split(';')
        .concat((trainerEmailList ?? '').split(';'), (mentorEmailList ?? '').split(';')),
    ),
  ].join(';')

  function chapterMeetingDetails() {
    if (!chapter?.meetingDetails && !chapterLeader) {
      return null
    }
    if (chapterLeader) {
      return (
        <div>
          <WebUiEditableText
            text={chapter?.meetingDetails}
            onSave={updateMeetingDetails}
            multiline={true}
            defaultText={'Click here to add a chapter description'}
            highlight={true}
          />
        </div>
      )
    }
    return <p>{chapter?.meetingDetails}</p>
  }

  function handleImageUpload(image: CreateReplaceUploadInput) {
    uploadChapterImage({
      variables: {
        chapterId: chapter?.id || '',
        input: {
          ...image,
        },
      },
    })
      .then((res: any) => refetch())
      .catch((e: any) => console.error(e))
  }

  function handleImageDeletion(imageId: string, publicId: string) {
    deleteUpload({
      variables: {
        uploadId: imageId,
        publicId: publicId,
      },
    })
      .then((res: any) => refetch())
      .catch((e: any) => console.error(e))
  }

  const folder = `chapter_backgrounds/${chapter?.id}`
  const token = loaderData?.token || ''

  return (
    <>
      {chapterLeader ? (
        <>
          <div className="bg-zinc-500 aspect-w-10 aspect-h-1 relative w-full">
            <WebUiImageUpload
              type={'background'}
              image={(chapter as any)?.backgroundImage}
              folder={folder}
              handleUpload={handleImageUpload}
              token={token}
              handleDelete={handleImageDeletion}
              widgetId={'chapter-background'}
              fallbackUrl={(chapter as any)?.backgroundImageUrl}
            />
            <PencilIcon className="text-white absolute top-1 left-1 h-6 w-6 pointer-events-none" />
          </div>
          <div className="bg-sky-600 py-2 text-center relative w-full text-white text-sm">
            Click on the image above to set your chapter's background image. The ideal image size is 1800 x 200.
          </div>
        </>
      ) : (
        <img
          src={chapter?.backgroundImageUrl ?? 'https://picsum.photos/1800/200'}
          alt={chapter?.name ?? 'Header Image'}
          className={'w-full max-h-48 object-cover'}
        />
      )}

      <WebUiContainer width={'w-full'} className={'p-8'}>
        {chapterMeetingDetails()}
        <div className={'grid sm:grid-cols-2 gap-12 mt-4'}>
          <div className={'space-y-6'}>
            <span className={'text-3xl font-semibold'}>Leadership</span>

            {chapterLeaders && <LeaderList leaders={chapterLeaders} navigate={navigate} />}
            {isMember || isAdmin ? (
              <div className="bg-white rounded-lg p-4 flex flex-col space-y-4">
                <a href={`mailto:${deduplicatedLeaderEmails}`} className="text-blue-500 hover:text-blue-700">
                  Email All Leaders
                </a>
                <a href={`mailto:${deduplicatedLeaderMentorEmails}`} className="text-blue-500 hover:text-blue-700">
                  Email All Leaders & Mentors
                </a>
                <a href={`mailto:${memberEmailList}`} className="text-blue-500 hover:text-blue-700">
                  Email All Members
                </a>
              </div>
            ) : null}
          </div>

          <div className={'space-y-6'}>
            <span className={'text-3xl font-semibold'}>Industries</span>
            <ul className={'list-disc text-lg list-inside'}>
              {industries?.industries?.map((industry: any) => (
                <li key={industry?.id || industry}>{industry?.name || industry}</li>
              ))}
            </ul>
          </div>
        </div>
      </WebUiContainer>
    </>
  )
}
