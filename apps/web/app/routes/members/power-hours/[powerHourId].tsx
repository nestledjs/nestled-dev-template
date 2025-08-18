import { cleanFormInput } from '@nestled-template/shared/utils'
import { useNavigate, useParams } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import {
  WebUiAvatar,
  WebUiConfirmationModal,
  WebUiContainer,
  WebUiLoading,
  WebUiSimpleListItem,
} from '@nestled-template/web-ui'
import {
  PowerHoursDocument,
  useDeletePowerHourMutation,
  usePowerHourQuery,
  useUpdatePowerHourMutation,
} from '@nestled-template/shared/sdk'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useGlobalCtx } from '@nestled-template/web'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { bizTheme } from '@nestled-template/shared/styles'

dayjs.extend(utc)

const isClient = typeof window !== 'undefined'

export default function PowerHourDetail() {
  const params = useParams()
  const navigate = useNavigate()
  const { user: activeUser } = useGlobalCtx()
  const [formLoading, setFormLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const [updatePowerHour] = useUpdatePowerHourMutation()
  const [deletePowerHour] = useDeletePowerHourMutation({
    refetchQueries: [{ query: PowerHoursDocument }],
  })

  const powerHourFields = [
    FormFieldClass.dateTimePicker('when', { label: 'Meeting Date & Time', required: true }),
    FormFieldClass.textArea('details', { label: 'Meeting Details' }),
    FormFieldClass.button('submit', { text: 'Update Power Hour', loading: formLoading }),
  ]

  const { data, loading } = usePowerHourQuery({
    skip: !params?.powerHourId,
    variables: {
      powerHourId: params?.powerHourId ?? 'NoId',
    },
  })

  if (!params?.powerHourId) return <div>No Id</div>

  function defaultValues() {
    if (data?.powerHour && !loading) {
      const base = dayjs.utc(data.powerHour.date)
      const dateStr = base.format('YYYY-MM-DD')
      const timeStr = (data.powerHour.time ?? '').slice(0, 5)
      const when = `${dateStr}T${timeStr || '00:00'}`
      return {
        when,
        details: data.powerHour.details,
      }
    } else {
      return undefined
    }
  }

  const submit = async (input: any) => {
    setFormLoading(true)
    const cleanedInput = cleanFormInput(input, powerHourFields)

    try {
      // Derive separate date and time from combined 'when'
      const whenVal = (cleanedInput as any).when ?? (input as any).when
      let dt: Date | null = null
      if (whenVal instanceof Date) dt = whenVal
      else if (typeof whenVal === 'string' || typeof whenVal === 'number') dt = new Date(whenVal)

      if (!dt || isNaN(dt.getTime())) {
        throw new Error('Please provide a valid meeting date and time')
      }

      const dateOut = dayjs(dt).format('YYYY-MM-DD') as unknown as any
      const timeOut = dayjs(dt).format('HH:mm')

      await updatePowerHour({
        variables: {
          powerHourId: params.powerHourId!,
          input: {
            details: (cleanedInput as any).details ?? undefined,
            date: dateOut,
            time: timeOut,
          },
        },
      })
      toast.success('Power Hour updated!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      toast.error(`Failed to update power hour: ${(error as Error).message}`)
    }
    setFormLoading(false)
  }

  async function deleteItem() {
    try {
      await deletePowerHour({
        variables: { powerHourId: params.powerHourId! },
      })
      toast.success('Power Hour deleted!')
      setDeleteModalOpen(false)
      navigate('/members/power-hours')
    } catch (error) {
      toast.error(`Failed to delete power hour: ${(error as Error).message}`)
    }
  }

  const powerHourPerson =
    data?.powerHour?.from?.id === activeUser?.id ? data?.powerHour?.to : data?.powerHour?.from

  const myPowerHour = data?.powerHour?.from?.id === activeUser?.id

  const powerHourDate = dayjs.utc(data?.powerHour?.date)
  const currentDate = dayjs.utc()

  const isPast = powerHourDate.isBefore(currentDate, 'day')
  const formattedDate = powerHourDate.format('dddd, MMMM D, YYYY')
  const formattedTime = data?.powerHour?.time

  const powerHourPersonName = powerHourPerson?.firstName
  const timeStatement = `on ${formattedDate} at ${formattedTime}`

  const powerHourMessage = `You ${
    isPast ? 'had' : 'have'
  } a Power Hour scheduled with ${powerHourPersonName} ${timeStatement}`

  return isClient && !data?.powerHour ? (
    <WebUiLoading />
  ) : (
    <WebUiContainer key={params?.powerHourId} width={'max-w-4xl'}>
      <div className={'space-y-4 mb-8'}>
        {powerHourPerson ? (
          <WebUiSimpleListItem
            type={'div'}
            avatar={<WebUiAvatar src={powerHourPerson?.avatarUrl || ''} />}
            lineOne={`PowerHour With ${powerHourPerson?.firstName} ${powerHourPerson?.lastName}`}
            lineTwo={`${powerHourPerson?.phone}, ${powerHourPerson?.email}`}
          />
        ) : (
          <WebUiLoading />
        )}
      </div>

      {myPowerHour ? (
        <>
          <Form
            theme={bizTheme}
            id="update-power-hour-form"
            fields={powerHourFields}
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
              Delete Power Hour
            </button>
          )}

          <WebUiConfirmationModal
            open={deleteModalOpen}
            setOpen={setDeleteModalOpen}
            title="Delete Power Hour"
            body="Are you sure you want to delete this power hour? This action cannot be undone."
            actionText="Delete"
            actionFunction={deleteItem}
          />
        </>
      ) : (
        <div className={'space-y-4'}>
          <p>{powerHourMessage}</p>
          <p className={'font-bold'}>Details:</p>
          <p>{data?.powerHour?.details}</p>
          <p className={'text-sm italic'}>
            Note: Power Hours can only be updated by the person who created them. If you need to
            change the day or time or wish to add something please contact{' '}
            {powerHourPerson?.firstName}
          </p>
        </div>
      )}
    </WebUiContainer>
  )
}
