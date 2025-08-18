import {
  Chapter,
  ChapterMember,
  ChapterMemberRole,
  UserStatus,
  useChapterQuery,
} from '@nestled-template/shared/sdk'
import { Link, Outlet, useMatches, useOutletContext, useParams } from 'react-router'
import React from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { WebUiSvgIcon } from '@nestled-template/web-ui'
import clsx from 'clsx'
import { WebUiLoading } from '@nestled-template/web-ui'
import { useGlobalCtx } from '@nestled-template/web'

type ChapterContextType = {
  chapter: Chapter | null | undefined
  chapterLeaders: ChapterMember[] | null | undefined
  chapterLeader: boolean | undefined
  isMember: boolean | null | undefined
  chapterMembers: ChapterMember[] | null | undefined
  refetch: () => void
}

export default function ChapterLayout() {
  const params = useParams()
  const { user: activeUser } = useGlobalCtx()
  const [expanded, setExpanded] = React.useState(true)
  const matches = useMatches()
  const { data, loading, refetch } = useChapterQuery({
    variables: {
      chapterId: params?.chapterId ?? 'NoId',
    },
    fetchPolicy: 'cache-and-network',
  })

  const chapter = data?.chapter

  const chapterLeaders = data?.chapter?.members?.filter((member: any) => member?.role !== ChapterMemberRole.Member)

  const chapterMembers = data?.chapter?.members
    ?.filter((member: any) => member?.member?.status === UserStatus.Active)
    .sort((a: any, b: any) => {
      // Convert membershipDate to Date objects for accurate comparison
      const dateA = new Date(a?.member?.membershipDate).getTime()
      const dateB = new Date(b?.member?.membershipDate).getTime()

      // Compare the dates
      return dateA - dateB // For ascending order
    })

  const path = matches.slice(-1)[0].pathname
  const segments = path.split('/')
  const lastSegment = segments[segments.length - 1]

  // Handle trailing slash - if last segment is empty, use second-to-last (with bounds check)
  const actualLastSegment = lastSegment === ''
    ? (segments.length > 1 ? segments[segments.length - 2] : segments[0])
    : lastSegment

  // Check if we're on the chapter details page (index route)
  // We're on chapter details if the actual last segment matches the chapterId (not 'members' or 'attendance')
  const isChapterDetailsActive = actualLastSegment === params?.chapterId && actualLastSegment !== 'members' && actualLastSegment !== 'attendance'


  const chapterLeader = chapterLeaders?.some((leader: any) => leader?.member?.id === activeUser?.id)

  const dollarUS = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return loading ? (
    <div className={'min-h-screen min-w-full'}>
      <WebUiLoading />
    </div>
  ) : (
    <div className={'lg:flex w-full'}>
      <div className={'p-6 bg-sky-600 w-full lg:w-4/12 2xl:w-3/12 2xl:p-10 h-full lg:min-h-screen text-white'}>
        <div className={`${expanded ? '' : 'hidden lg:block'} space-y-6`}>
          <h1 className={'font-sans text-white'}>{chapter?.name}</h1>
          {chapter?.virtual ? (
            <p>
              <a href={chapter?.meetingUrl ?? ''} target={'_blank'} rel="noreferrer">
                Virtual Meeting
              </a>
            </p>
          ) : (
            <p>
              {chapter?.description ? (
                <>
                  {chapter.description} <br />
                </>
              ) : null}
              {chapter?.address ? (
                <>
                  {chapter.address} <br />
                </>
              ) : null}
              {chapter?.address2 ? (
                <>
                  {chapter.address2} <br />
                </>
              ) : null}
              {chapter?.city ?? null}
              {chapter?.city && chapter?.state ? ', ' : null}
              {chapter?.state ?? null} {chapter?.postCode ?? null}
            </p>
          )}
          <div className={'bg-gradient-to-t from-rose-500 to-orange-300 p-4 text-center rounded-lg'}>
            <span className={'text-3xl'}>Next Meeting</span>
            <br />
            <strong className={'text-3xl'}>
              {chapter?.meetingDay} at {chapter?.meetingTime}
            </strong>
          </div>
          <div className={'flex items-center'}>
            <WebUiSvgIcon type={'referrals-out'} />
            <div className={'ml-6'}>
              <h4 className={'text-3xl font-semibold text-white'}>{(chapter as any)?._count?.referralsFrom || 0}</h4>
              <p className={'text-lg text-white'}>Referrals Sent</p>
            </div>
          </div>
          <div className={'flex items-center'}>
            <WebUiSvgIcon type={'referrals-in'} />
            <div className={'ml-6'}>
              <h4 className={'text-3xl font-semibold text-white'}>{(chapter as any)?._count?.referralsTo || 0}</h4>
              <p className={'text-lg text-white'}>Referrals Received</p>
            </div>
          </div>
          <div className={'flex items-center'}>
            <WebUiSvgIcon type={'biz'} />
            <div className={'ml-6'}>
              <h4 className={'text-3xl font-semibold text-white'}>{dollarUS.format(0)}</h4>
              <p className={'text-lg text-white'}>$ in Biz</p>
            </div>
          </div>
          <div className={'flex flex-col gap-y-6 lg:items-end '}>
            <Link
              to={`/members/chapter/${chapter?.id}`}
              className={clsx(
                isChapterDetailsActive ? 'rounded-md -mr-10 lg:rounded-r-none' : 'rounded-md',
                'block w-full lg:w-64 text-center py-4 bg-zinc-100 text-black  hover:bg-zinc-200 transition duration-200',
              )}
            >
              Chapter Details
            </Link>
            <Link
              to={`/members/chapter/${chapter?.id}/members`}
              className={clsx(
                actualLastSegment === 'members' ? 'rounded-md -mr-10 lg:rounded-r-none' : 'rounded-md',
                'block w-full lg:w-64 text-center py-4 bg-zinc-100 text-black hover:bg-zinc-200 transition duration-200',
              )}
            >
              Members
            </Link>
            {chapterLeader ? (
              <Link
                to={`/members/chapter/${chapter?.id}/attendance`}
                className={clsx(
                  actualLastSegment === 'attendance' ? 'rounded-md -mr-10 lg:rounded-r-none' : 'rounded-md',
                  'block w-full lg:w-64 text-center py-4 bg-zinc-100 text-black hover:bg-zinc-200 transition duration-200',
                )}
              >
                Attendance
              </Link>
            ) : null}
          </div>
        </div>

        <div className={`${expanded ? 'hidden' : 'flex lg:hidden'}`}>
          <h4 className={'text-white font-semibold inline-flex'} onClick={() => setExpanded(true)}>
            <ChevronLeftIcon className={'h-6 w-6 mr-4'} /> {' Back to Dashboard'}
          </h4>
        </div>
      </div>

      <div className={`bg-zinc-100 flex flex-col flex-grow flex-1 `}>
        <Outlet
          context={
            {
              chapter: chapter as any,
              chapterLeaders: chapterLeaders as any,
              chapterLeader,
              chapterMembers: chapterMembers as any,
              isMember: (chapter as any)?.isMember,
              refetch,
            } satisfies ChapterContextType
          }
        />
      </div>
    </div>
  )
}

export function useChapterContext() {
  return useOutletContext<ChapterContextType>()
}
