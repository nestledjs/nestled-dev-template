import React, { useState } from 'react'
import { CreateReferralInput, useCreateReferralMutation } from '@nestled-template/shared/sdk'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import toast from 'react-hot-toast'
import { cleanFormInput } from '@nestled-template/shared/utils'
import { useDashboardContext } from './_layout'
import dayjs from 'dayjs'
import { WebUiLoading } from '@nestled-template/web-ui'
import { bizTheme } from '@nestled-template/shared/styles'

export default function NewReferral() {
  const [loading, setLoading] = useState(false)
  const { refetchCounts } = useDashboardContext()
  const [shouldReset, setShouldReset] = useState(false)
  const [createReferral] = useCreateReferralMutation()

  const fields = [
    // ❌ MISSING: relationSelect method not available in FormFieldClass
    FormFieldClass.select('toMemberId', {
      label: 'Send Referral To',
      options: [], // ❌ TODO: Replace with actual user options from UserChapterUsersDocument
    }),
    FormFieldClass.datePicker('referralDate', {
      label: 'Referral Date',
      required: true,
      defaultValue: dayjs(new Date()).format('YYYY-MM-DD'),
    }),
    FormFieldClass.text('firstName', { label: 'First Name', required: true }),
    FormFieldClass.text('lastName', { label: 'Last Name', required: true }),
    FormFieldClass.email('email', { label: 'Email' }),
    FormFieldClass.phone('phone', { label: 'Phone Number' }),
    FormFieldClass.textArea('notes', { label: 'Notes', rows: 4, required: true }),
    FormFieldClass.select('rating', {
      label: 'Referral Rating',
      options: [
        { label: 'Hot', value: 'Hot' },
        { label: 'Warm', value: 'Warm' },
        { label: 'Cold', value: 'Cold' },
      ],
      required: true,
    }),
    FormFieldClass.button('submit', { text: 'Add Referral', loading }),
  ]

  const addReferral = async (val: Record<string, unknown>) => {
    setLoading(true)
    const referral = cleanFormInput(val, fields)
    try {
      await createReferral({
        variables: {
          input: {
            ...(referral as CreateReferralInput),
          },
        },
      })
      setShouldReset(true)
      window.scrollTo(0, 0)
      refetchCounts()
      toast.success('Referral Sent')
      setLoading(false)
    } catch (e) {
      toast.error(`An error occurred: ${(e as Error).message}`)
      setLoading(false)
    }
  }

  return (
    <div className={'mx-auto w-full max-w-3xl'}>
      <h4 className={'pb-6 mt-4'}>Add New Referral</h4>
      {loading ? (
        <WebUiLoading />
      ) : (
        <Form
          theme={bizTheme}
          id="new-referral-form"
          submit={addReferral}
          fields={fields}
          // ❌ MISSING: shouldReset and onReset not available in new Form API
          // shouldReset={shouldReset}
          // onReset={() => setShouldReset(false)}
        />
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
