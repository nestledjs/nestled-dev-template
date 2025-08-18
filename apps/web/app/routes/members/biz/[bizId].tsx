import { cleanFormInput } from '@nestled-template/shared/utils'
import { useNavigate, useParams } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import {
  WebUiAvatar,
  WebUiConfirmationModal,
  WebUiContainer,
  WebUiLoading,
  WebUiSimpleListItem,
  WebUiSvgIcon,
} from '@nestled-template/web-ui'
import {
  useDeleteTransactionMutation,
  UserTransactionsDocument,
  useTransactionQuery,
  useUpdateTransactionMutation,
} from '@nestled-template/shared/sdk'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'
// dayjs removed for date normalization; keep utils in shared
import { formatUtcForDateInput, toUtcMidnightIso } from '@nestled-template/shared/utils'
import { bizTheme } from '@nestled-template/shared/styles'

export default function BizDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const isClient = typeof window !== 'undefined'
  const [formLoading, setFormLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [updateTransaction] = useUpdateTransactionMutation()
  const [deleteTransaction] = useDeleteTransactionMutation({
    refetchQueries: [{ query: UserTransactionsDocument }],
  })

  const transactionFields = [
    FormFieldClass.number('amount', { label: 'Amount', required: true }),
    FormFieldClass.datePicker('date', { label: 'Sale Date', required: true }),
    FormFieldClass.button('submit', {
      label: 'Update',
      text: 'Update $ in Biz',
      loading: formLoading,
      type: 'submit',
    }),
  ]

  const { data, loading } = useTransactionQuery({
    skip: !params?.bizId,
    variables: {
      transactionId: params?.bizId ?? 'NoId',
    },
    fetchPolicy: 'network-only',
  })

  if (!params?.bizId) return <div>No Id</div>

  function defaultValues() {
    if (data?.transaction && !loading) {
      return {
        amount: data.transaction.amount,
        // Keep date in UTC so it doesn't shift by local timezone
        date: formatUtcForDateInput(data.transaction.date),
      }
    } else {
      return undefined
    }
  }

  const submit = async (input: Record<string, unknown>) => {
    setFormLoading(true)
    const cleanedInput = cleanFormInput(input, transactionFields)

    try {
      // Normalize date to midnight UTC to avoid TZ shifting
      if (typeof cleanedInput.date === 'string' || cleanedInput.date instanceof Date) {
        cleanedInput.date = toUtcMidnightIso(cleanedInput.date as string | Date)
      }

      await updateTransaction({
        variables: {
          transactionId: params.bizId ?? '',
          input: { ...cleanedInput },
        },
      })
      toast.success('Transaction updated!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      toast.error(`Failed to update transaction: ${(error as Error).message}`)
    }
    setFormLoading(false)
  }

  async function deleteItem() {
    try {
      await deleteTransaction({
        variables: { transactionId: params.bizId ?? '' },
      })
      toast.success('Transaction deleted!')
      setDeleteModalOpen(false)
      navigate('/members/biz')
    } catch (error) {
      toast.error(`Failed to delete transaction: ${(error as Error).message}`)
    }
  }

  const referral = data?.transaction?.referral ?? null
  const referralFrom = referral?.from

  return isClient && !data?.transaction ? (
    <WebUiLoading />
  ) : (
    <WebUiContainer key={params?.bizId} width={'max-w-4xl'}>
      <div className={'space-y-4 mb-8'}>
        {referralFrom?.firstName ? (
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={referralFrom?.avatarUrl || ''} />}
            lineOne={`Referred by ${referralFrom?.firstName} ${referralFrom?.lastName}`}
            lineTwo={`${referralFrom?.phone}, ${referralFrom?.email}`}
          />
        ) : null}

        {referral?.firstName ? (
          <WebUiSimpleListItem
            type={'div'}
            avatar={
              <div className={'bg-rose-500 p-2 rounded-md'}>
                <div className={'w-8 h-8'}>
                  <WebUiSvgIcon type={'referrals-in'} color={'white'} size={'100%'} />
                </div>
              </div>
            }
            lineOne={`Referral: ${referral?.firstName} ${referral?.lastName}, ${referral?.phone}, ${referral?.email}`}
            lineTwo={`${referral?.notes}`}
          />
        ) : null}
      </div>

      <Form
        theme={bizTheme}
        id="update-transaction-form"
        fields={transactionFields}
        submit={submit}
        defaultValues={defaultValues()}
      />

      {!loading && (
        <button
          type="button"
          onClick={() => setDeleteModalOpen(true)}
          className="mt-8 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Delete Transaction
        </button>
      )}

      <WebUiConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title="Delete Transaction"
        body="Are you sure you want to delete this transaction? This action cannot be undone."
        actionText="Delete"
        actionFunction={deleteItem}
      />
    </WebUiContainer>
  )
}
