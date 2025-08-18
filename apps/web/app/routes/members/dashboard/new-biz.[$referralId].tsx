import React, { useState } from 'react'
import {
  CreateTransactionInput,
  MyReferralsDocument,
  MyReferralsQuery,
  useReferralQuery,
  useUserCreateTransactionMutation,
} from '@nestled-template/shared/sdk'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { isRouteErrorResponse, useParams, useRouteError } from 'react-router'
import { useDashboardContext } from './_layout'
import { cleanFormInput } from '@nestled-template/shared/utils'
import { WebUiLoading } from '@nestled-template/web-ui'
import { bizTheme } from '@nestled-template/shared/styles'

export default function NewBiz() {
  const [loading, setLoading] = useState(false)
  const { refetchCounts } = useDashboardContext()
  const [userCreateTransaction] = useUserCreateTransactionMutation()
  const params = useParams()
  const { data: preselectReferral } = useReferralQuery({
    skip: !params?.referralId,
    variables: { referralId: params?.referralId ?? 'NoId' },
  })

  async function addTransaction(val: Record<string, unknown>) {
    setLoading(true)
    const transaction = cleanFormInput(val, fields)
    if (params?.referralId) {
      transaction.referralId = params.referralId
    }

    try {
      const t: Record<string, unknown> = { ...transaction }
      // Normalize date to ISO string if provided as YYYY-MM-DD or Date
      if (t.date instanceof Date) {
        t.date = t.date.toISOString()
      } else if (typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
        t.date = new Date(`${t.date}T00:00:00Z`).toISOString()
      }

      const { data } = await userCreateTransaction({
        variables: {
          input: t as CreateTransactionInput,
        },
      })

      const createdId = data?.userCreateTransaction?.id
      if (!createdId) throw new Error('Transaction not created')

      toast.success(`Added $${transaction.amount} in Biz`)
      window.scrollTo(0, 0)
      refetchCounts()
    } catch (e) {
      toast.error(`An error occurred: ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    FormFieldClass.number('amount', { label: 'Amount', required: true }),
    FormFieldClass.datePicker('date', {
      label: 'Sale Date',
      required: true,
      defaultValue: dayjs(new Date()).format('YYYY-MM-DD'),
    }),
    FormFieldClass.searchSelectApollo('referralId', {
      label: 'Referral',
      document: MyReferralsDocument,
      dataType: 'myReferrals',
      searchFields: ['firstName', 'lastName', 'email'],
      selectOptionsFunction: (items: NonNullable<MyReferralsQuery['myReferrals']>) =>
        items.map(r => ({
          value: r.id,
          label:
            `${(r.firstName ?? '').trim()} ${(r.lastName ?? '').trim()}`.trim() || r.email || r.id,
        })),
    }),
    FormFieldClass.button('submit', { text: 'Add $ in Biz', loading, type: 'submit' }),
  ]

  return (
    <div className={'mx-auto  w-full max-w-3xl'}>
      <h4 className={'pb-6 mt-4'}>
        Add New $ in Biz {params?.referralId ? 'to Existing Referral' : ''}
      </h4>
      {loading ? (
        <WebUiLoading />
      ) : (
        <Form
          theme={bizTheme}
          id="new-biz-form"
          submit={addTransaction}
          fields={fields}
          defaultValues={
            params?.referralId && preselectReferral?.referral
              ? {
                  referralId: {
                    value: preselectReferral.referral.id,
                    label:
                      `${(preselectReferral.referral.firstName ?? '').trim()} ${(preselectReferral.referral.lastName ?? '').trim()}`.trim() ||
                      preselectReferral.referral.email ||
                      preselectReferral.referral.id,
                  },
                }
              : undefined
          }
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
