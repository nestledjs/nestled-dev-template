import React, { useEffect, useRef, useState } from 'react'
import { MeetingPresence, useLeaderMeetingPresencesQuery } from '@nestled-template/shared/sdk'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { NetworkStatus } from '@apollo/client'
import { WebUiSvgIcon } from '@nestled-template/web-ui'
import { WebUiSimpleListItem } from '@nestled-template/web-ui'
import { classNames } from '@nestled-template/shared/utils'
import { WebUiLoading } from '@nestled-template/web-ui'
import { WebUiDateFilter } from '@nestled-template/web-ui'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface WebLeaderListMeetingPresencesProps {
  selectedId?: string
  setExpanded?: (val: boolean) => void
  fontColor?: string
  loggedInUserId: string
  memberId?: string
}

export function WebLeaderListMeetingAttendance({
  selectedId,
  memberId,
  setExpanded,
  fontColor,
  loggedInUserId,
}: WebLeaderListMeetingPresencesProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  // State to track whether fetchMore is Loading
  const [isLoading, setIsLoading] = useState(false)
  // State to track whether all items have been loaded
  const [allLoaded, setAllLoaded] = useState(false)
  // Ref to track the end of list position
  const loader = useRef<HTMLDivElement | null>(null)
  // State to track whether the component has been mounted on the client
  const [isClient, setIsClient] = useState(false)
  // Apollo Query
  const { data, fetchMore, networkStatus } = useLeaderMeetingPresencesQuery({
    variables: {
      input: {
        memberId,
        take: 20,
        skip: 0,
        startDate: startDate === '' ? null : new Date(startDate),
        endDate: endDate === '' ? null : new Date(endDate),
      },
    },
    notifyOnNetworkStatusChange: true,
  })
  const navigate = useNavigate()

  useEffect(() => {
    // Set isClient to true after the initial render on the client
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isLoading) return // Don't observe if item is loading
    if (allLoaded) return // Don't observe if all items have been loaded

    const currentLoader = loader.current // Copy ref value to variable

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true)
        fetchMore({
          variables: {
            input: {
              take: 20,
              skip: data?.meetingPresences?.length,
              startDate: startDate === '' ? null : new Date(startDate),
              endDate: endDate === '' ? null : new Date(endDate),
            },
          },
        }).then((fetchMoreResult) => {
          const newMeetingPresences = fetchMoreResult.data.meetingPresences
          if (newMeetingPresences && newMeetingPresences.length < 20) {
            setAllLoaded(true)
          }
          setIsLoading(false)
        })
      }
    })

    if (currentLoader) {
      observer.observe(currentLoader)
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader)
      }
    }
  }, [loader, data, allLoaded, fetchMore, isLoading])

  return (
    <div className={'flex-grow'}>
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 w-full">
        <h4 className={classNames('text-3xl font-semibold', fontColor === 'light' ? 'text-white' : '')}>
          Meetings Attended
        </h4>
        <WebUiDateFilter
          className={'mt-4 sm:mt-0'}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      </div>
      <div className={'space-x-2'}>
        {!startDate && !endDate ? (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            No Filters Applied
          </span>
        ) : null}
        {startDate ? (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Starting {dayjs.utc(startDate).format('MM.DD.YYYY')}
            <button
              type="button"
              className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
              onClick={() => setStartDate('')}
            >
              <span className="sr-only">Remove</span>
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
        ) : null}
        {endDate ? (
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            Until {dayjs.utc(endDate).format('MM.DD.YYYY')}
            <button
              type="button"
              className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
              onClick={() => setEndDate('')}
            >
              <span className="sr-only">Remove</span>
              <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 stroke-gray-700/50 group-hover:stroke-gray-700/75">
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </span>
        ) : null}
      </div>

      <ul className={'max-w-4xl mx-auto space-y-4 mt-6'}>
        {data?.meetingPresences?.map((meetingPresence: MeetingPresence) => (
          <WebUiSimpleListItem
            selected={selectedId === meetingPresence?.id}
            key={meetingPresence?.id}
            type={'div'}
            avatar={
              <div className={'bg-green-500 p-2 rounded-md aspect-square'}>
                <div className={'w-8 h-8 max-h-8 aspect-square'}>
                  <WebUiSvgIcon type={'attendance'} color={'white'} size={'100%'} />
                </div>
              </div>
            }
            lineOne={`${dayjs(meetingPresence?.meeting?.date).format('dddd, MMMM DD, YYYY')} - ${
              meetingPresence?.attendance
            }`}
          />
        ))}
      </ul>

      <div ref={loader} className="text-center py-4">
        {isClient && (networkStatus === NetworkStatus.loading || networkStatus === NetworkStatus.fetchMore) ? (
          <WebUiLoading />
        ) : null}
      </div>
    </div>
  )
}
