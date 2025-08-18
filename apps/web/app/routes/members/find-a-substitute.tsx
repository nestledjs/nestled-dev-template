import { DayOfWeek, useMeQuery, useUserCreateSubstituteMutation, useMembersInSubstituteGroupQuery } from '@nestled-template/shared/sdk'
import { WebUiContainer, WebUiAlert, WebUiLoading } from '@nestled-template/web-ui'
import { ChangeEvent, useMemo, useState } from 'react'
import clsx from 'clsx'
import dayjs from 'dayjs'

export default function FindASubstitute() {
  const { data: meData } = useMeQuery()
  const [userCreateSubstitute] = useUserCreateSubstituteMutation()
  const [selectedDate, setSelectedDate] = useState('')
  const [dateError, setDateError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [skipped, setSkipped] = useState<string[]>([])

  // Best-effort meeting day from the user's chapter (if available)
  const meetingDay: DayOfWeek | undefined = (meData?.me as any)?.chapter?.chapter?.meetingDay

  const dates = useMemo(() => {
    const targetDay: DayOfWeek = meetingDay ?? DayOfWeek.Unknown
    const daysOfWeek = [
      DayOfWeek.Sunday,
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
    ]

    // Fallback: if meeting day is unknown, use the current weekday instead of returning no options
    const effectiveDayIndex = targetDay === DayOfWeek.Unknown ? new Date().getDay() : daysOfWeek.indexOf(targetDay)
    if (effectiveDayIndex === -1) return []

    const result: Date[] = []
    const currentDate = new Date()
    // Advance to the next occurrence of the target weekday
    while (currentDate.getDay() !== effectiveDayIndex) currentDate.setDate(currentDate.getDate() + 1)
    for (let i = 0; i < 10; i++) {
      result.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 7)
    }
    // Return label/value pairs: label is friendly; value is YYYY-MM-DD for robust parsing
    return result.map(date => ({
      label: dayjs(date).format('ddd MMM D YYYY'),
      value: dayjs(date).format('YYYY-MM-DD'),
    }))
  }, [meetingDay])

  async function inviteSub(id: string) {
    setSuccess(false)
    setDateError(false)
    setLoading(true)
    setSkipped([])
    if (!selectedDate) {
      setDateError(true)
      setLoading(false)
      return
    }
    setDateError(false)
    const iso = new Date(selectedDate).toISOString()
    const { data: resp } = await userCreateSubstitute({
      variables: { input: { meetingDate: iso as any, invited: [id] } },
    })
    setLoading(false)
    setSuccess(true)
    const skippedFromResp = resp?.userCreateSubstitute?.skipped ?? []
    if (skippedFromResp.length) {
      setSkipped(skippedFromResp as string[])
    }
  }

  async function handleSendRequestToAll() {
    setSuccess(false)
    setDateError(false)
    setLoading(true)
    setSkipped([])
    if (!selectedDate) {
      setDateError(true)
      setLoading(false)
      return
    }
    const iso = new Date(selectedDate).toISOString()
    const invitedIds = members.map(m => m.id).filter(Boolean)
    try {
      const { data: resp } = await userCreateSubstitute({
        variables: { input: { meetingDate: iso as any, invited: invitedIds } },
      })
      setSuccess(true)
      const skippedFromResp = resp?.userCreateSubstitute?.skipped ?? []
      if (skippedFromResp.length) setSkipped(skippedFromResp as string[])
    } finally {
      setLoading(false)
    }
  }

  const { data: membersData, loading: membersLoading } = useMembersInSubstituteGroupQuery()
  const members = (membersData?.membersInSubstituteGroup ?? []).map((u) => ({
    id: u?.id ?? '',
    name: `${u?.firstName ?? ''} ${u?.lastName ?? ''}`.trim(),
    email: u?.email ?? '',
    phone: (u as any)?.phone ?? '',
  }))

  const handleDateChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value)
  }

  return (
    <WebUiContainer className={'w-full pt-8'}>
      <h1>Find a Substitute</h1>
      <div className={clsx('flex justify-between items-start space-x-4 w-full', dateError ? 'mt-6 mb-0' : 'my-6')}>
        <div className="flex flex-col">
          <label className={'sr-only'} htmlFor="date-select">
            What meeting do you need a substitute for?
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
            className="mb-4 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
          >
            <option key={0} value={''}>
              Select a date
            </option>
            {dates.map((d, index) => (
              <option key={index} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSendRequestToAll}
            disabled={loading || members.length === 0}
          >
            Send Request to All Substitutes
          </button>
        </div>
      </div>
      {dateError ? <WebUiAlert title="Please choose a date to send the request." alertType="error" /> : null}
      {success ? <WebUiAlert title="Your request has been sent." alertType="success" /> : null}
      {skipped.length > 0 && (
        <div className="mt-2">
          <WebUiAlert
            title={`Some users were not invited because they have already been invited for this date.`}
            alertType="warning"
          />
          <p className="text-sm text-gray-600">{`${skipped.length} user(s) skipped.`}</p>
        </div>
      )}

      {loading || membersLoading ? (
        <div className="flex flex-col items-center">
          <WebUiLoading />
          <div className="mt-4 text-orange-600 font-semibold text-center">
            This can take some time. Please be patient and do not close this window or click again.
          </div>
        </div>
      ) : (
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Substitute Name
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone Number
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th scope="col" className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="border-b">
                <td className="px-4 py-2">{member.name}</td>
                <td className="px-4 py-2">{member.phone ?? ''}</td>
                <td className="px-4 py-2">{member.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="w-full bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => inviteSub(member.id)}
                    disabled={loading}
                  >
                    Send Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {members.length === 0 && (
        <div className="mt-4">
          <WebUiAlert
            alertType="warning"
            title="Substitute list not available yet"
          />
        </div>
      )}
    </WebUiContainer>
  )
}
