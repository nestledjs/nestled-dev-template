import { WebUiContainer, WebUiLoading } from '@nestled-template/web-ui'
import React from 'react'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { MeetingAttendance } from '@nestled-template/shared/sdk'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router'
import { useChapterContext } from './_layout'
import { bizTheme } from '@nestled-template/shared/styles'

export default function ChapterAttendance() {
  const params = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const { chapterMembers } = useChapterContext()

  const members = chapterMembers?.sort((a: any, b: any) => {
    const firstNameA = a?.member?.firstName ?? ''
    const firstNameB = b?.member?.firstName ?? ''

    if (firstNameA < firstNameB) return -1
    if (firstNameA > firstNameB) return 1
    return 0
  })

  const attendanceOptions = [
    { value: MeetingAttendance.Present, label: 'Present' },
    { value: MeetingAttendance.Absent, label: 'Absent' },
    { value: MeetingAttendance.ApprovedLoa, label: 'Approved LOA' },
    { value: MeetingAttendance.Substitute, label: 'Substitute' },
    { value: MeetingAttendance.Other, label: 'Other' },
  ]

  const fields = [
    FormFieldClass.datePicker('meetingDate', {
      label: 'Meeting Date',
      defaultValue: dayjs(new Date()).format('YYYY-MM-DD'),
    }),
    ...(members?.map((member: any) =>
      FormFieldClass.select(`${member?.member?.id}`, {
        label: `${member?.member?.firstName} ${member?.member?.lastName}`,
        options: attendanceOptions,
        defaultValue: MeetingAttendance.Present,
      }),
    ) || []),
    FormFieldClass.button('submit', { text: 'Take Attendance', loading }),
  ]

  async function handleSubmit(values: Record<string, unknown>) {
    if (!params?.chapterId) return

    setLoading(true)

    // For now, just simulate the attendance submission
    console.log('Taking attendance:', values)

    // TODO: Implement actual attendance mutation when available
    setTimeout(() => {
      setLoading(false)
      navigate(`/members/chapter/${params?.chapterId}`)
    }, 1000)
  }

  return (
    <WebUiContainer width={'w-full'} className={'flex-grow min-h-screen'}>
      {members && !loading ? (
        <Form theme={bizTheme} id="attendance-form" fields={fields} submit={handleSubmit} />
      ) : (
        <WebUiLoading />
      )}
    </WebUiContainer>
  )
}
