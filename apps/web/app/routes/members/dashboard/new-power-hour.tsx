import React, { useState } from 'react'
import {
  CreatePowerHourInput,
  useCreatePowerHourMutation,
  useMeQuery,
  UserChapterUsersDocument,
} from '@nestled-template/shared/sdk'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import toast from 'react-hot-toast'
import { cleanFormInput } from '@nestled-template/shared/utils'
import { useDashboardContext } from './_layout'
import { WebUiLoading } from '@nestled-template/web-ui'
import { bizTheme } from '@nestled-template/shared/styles'

export default function NewPowerHour() {
  const { data: meData } = useMeQuery()
  const [loading, setLoading] = useState(false)
  const { refetchCounts } = useDashboardContext()
  const [createPowerHour] = useCreatePowerHourMutation()

  const fields = [
    FormFieldClass.searchSelectApollo('toId', {
      label: 'Record Power Hour with:',
      dataType: 'users',
      document: UserChapterUsersDocument,
      searchFields: ['firstName', 'lastName', 'email'],
      selectOptionsFunction: (items: any[]) =>
        items.map((u: any) => ({
          value: u.id,
          label: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email || u.id,
        })),
      required: true,
    }),
    FormFieldClass.dateTimePicker('when', {
      label: 'When',
      required: true,
      // datetime-local expects 'YYYY-MM-DDTHH:mm'
      defaultValue: new Date().toISOString().slice(0, 16),
    }),
    FormFieldClass.text('details', { label: 'Details' }),
    FormFieldClass.button('submit', { text: 'Add PowerHour', loading, type: 'submit' }),
  ]

  const addPowerHour = async (val: Record<string, unknown>) => {
    setLoading(true)
    const powerHour = cleanFormInput(val, fields)
    // Debug: inspect cleaned form values

    try {
      const effectiveUserId = meData?.me?.id
      if (!effectiveUserId) throw new Error('No active user found. Please log in again.')

      // Extract date and time from combined field
      const whenVal = (powerHour as any).when ?? (val as any).when
      let dt: Date | null = null
      if (whenVal instanceof Date) dt = whenVal
      else if (typeof whenVal === 'string' || typeof whenVal === 'number') dt = new Date(whenVal)
      if (!dt || isNaN(dt.getTime())) throw new Error('Please provide a valid date and time')
      const dateStr = dt.toISOString().split('T')[0]
      const timeStr = dt.toTimeString().slice(0, 5)

      const input: CreatePowerHourInput = {
        details: (powerHour as any).details ?? undefined,
        fromId: effectiveUserId,
        toId: (powerHour as any).toId,
        date: dateStr as unknown as any,
        time: timeStr,
      }

      const result = await createPowerHour({
        variables: {
          input,
        },
      })

      window.scrollTo(0, 0)
      refetchCounts()
      toast.success('PowerHour Sent')
      setLoading(false)
    } catch (e) {
      const err = e as any

      const message = err?.message || err?.toString?.() || 'Unknown error'
      toast.error(`An error occurred: ${message}`)
      setLoading(false)
    }
  }

  return (
    <div className={'mx-auto w-full max-w-3xl'}>
      <h4 className={'pb-6 mt-4'}>Add New PowerHour</h4>
      {loading ? (
        <WebUiLoading />
      ) : (
        <Form theme={bizTheme} id="new-power-hour-form" submit={addPowerHour} fields={fields} />
      )}
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    )
  }

  function isDefinitelyAnError(error: unknown): error is Error {
    return typeof error === 'object' && error !== null && 'message' in error
  }

  let errorMessage = 'Unknown error'
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  )
}
