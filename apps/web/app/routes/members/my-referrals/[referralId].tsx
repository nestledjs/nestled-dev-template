import { cleanFormInput, formatUtcForDateInput } from '@nestled-template/shared/utils'
import { useNavigate, useParams } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import {
  WebUiAvatar,
  WebUiButton,
  WebUiConfirmationModal,
  WebUiContainer,
  WebUiLoading,
  WebUiSimpleListItem,
} from '@nestled-template/web-ui'
import {
  ReferralRating,
  ReferralsDocument,
  useDeleteReferralMutation,
  useReferralQuery,
  useUpdateReferralMutation,
} from '@nestled-template/shared/sdk'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'
import { bizTheme } from '@nestled-template/shared/styles'

const isClient = typeof window !== 'undefined'

export default function ReferralDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const [formLoading, setFormLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [updateReferral] = useUpdateReferralMutation()
  const [deleteReferral] = useDeleteReferralMutation({
    refetchQueries: [{ query: ReferralsDocument }],
  })

  const referralFields = [
    FormFieldClass.datePicker('referralDate', { label: 'Date', required: true }),
    FormFieldClass.text('firstName', { label: 'First Name', required: true }),
    FormFieldClass.text('lastName', { label: 'Last Name', required: true }),
    FormFieldClass.email('email', { label: 'Email' }),
    FormFieldClass.phone('phone', { label: 'Phone' }),
    FormFieldClass.text('notes', { label: 'Notes' }),
    FormFieldClass.enumSelect('rating', {
      label: 'Rating',
      required: true,
      enum: ReferralRating,
    }),
    FormFieldClass.button('submit', {
      label: 'Update Referral',
      loading: formLoading,
      text: 'Update Referral',
    }),
  ]

  const { data, loading } = useReferralQuery({
    skip: !params?.referralId,
    variables: {
      referralId: params?.referralId ?? 'NoId',
    },
  })

  if (!params?.referralId) return <div>No Id</div>

  function defaultValues() {
    if (data?.referral && !loading) {
      return {
        referralDate: formatUtcForDateInput(data.referral.referralDate),
        firstName: data.referral.firstName,
        lastName: data.referral.lastName,
        email: data.referral.email,
        phone: data.referral.phone,
        notes: data.referral.notes,
        rating: data.referral.rating,
      }
    } else {
      return undefined
    }
  }

  const submit = async (input: any) => {
    setFormLoading(true)
    const cleanedInput = cleanFormInput(input, referralFields)

    try {
      await updateReferral({
        variables: {
          referralId: params.referralId!,
          input: { ...cleanedInput },
        },
      })
      toast.success('Referral updated!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      toast.error(`Failed to update referral: ${(error as Error).message}`)
    }
    setFormLoading(false)
  }

  async function deleteItem() {
    try {
      await deleteReferral({
        variables: { referralId: params.referralId! },
      })
      toast.success('Referral deleted!')
      setDeleteModalOpen(false)
      navigate('/members/my-referrals')
    } catch (error) {
      toast.error(`Failed to delete referral: ${(error as Error).message}`)
    }
  }

  const referralFrom = data?.referral?.from

  return isClient && !data?.referral ? (
    <WebUiLoading />
  ) : (
    <WebUiContainer key={params?.referralId} width={'max-w-4xl'}>
      <div className={'space-y-4 mb-8'}>
        {referralFrom ? (
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={referralFrom?.avatarUrl || ''} />}
            lineOne={`Referral From ${referralFrom?.firstName} ${referralFrom?.lastName}`}
            lineTwo={`${referralFrom?.phone}, ${referralFrom?.email}`}
          />
        ) : (
          <WebUiLoading />
        )}
      </div>
      <div className={'mb-3'}>
        <WebUiButton linkTo={`/members/dashboard/new-biz/${params?.referralId}`}>
          Add $ in Biz
        </WebUiButton>
      </div>

      <Form
        theme={bizTheme}
        id="update-referral-form"
        fields={referralFields}
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
          Delete Referral
        </button>
      )}

      <WebUiConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title="Delete Referral"
        body="Are you sure you want to delete this referral? This action cannot be undone."
        actionText="Delete"
        actionFunction={deleteItem}
      />
    </WebUiContainer>
  )
}
