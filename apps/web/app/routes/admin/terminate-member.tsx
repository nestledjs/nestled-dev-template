import { User, UsersDocument, useTerminateMemberMutation } from '@nestled-template/shared/sdk'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { useGlobalCtx, WebUserSelect } from '@nestled-template/web'
import { useState } from 'react'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { bizTheme } from '@nestled-template/shared/styles'

export default function AdminUserTermination() {
  const { user } = useGlobalCtx()
  const [terminateMemberMutation] = useTerminateMemberMutation()
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const terminationReasonOptions = [
    { label: 'Closed Business', value: 'Closed Business' },
    { label: 'Attendance', value: 'Attendance' },
    { label: 'Member Conflict', value: 'Member Conflict' },
    { label: 'Moved out of Area', value: 'Moved out of Area' },
    { label: 'New Job/Company', value: 'New Job/Company' },
    { label: 'Non Renewal', value: 'Non Renewal' },
    { label: 'Time Commitment', value: 'Time Commitment' },
    { label: 'Unhappy with membership', value: 'Unhappy with membership' },
    { label: 'Other (enter reason)', value: 'Other (Enter Reason)' },
  ]

  const formFields = [
    FormFieldClass.datePicker('terminationDate', {
      label: 'Termination Date',
      required: true,
      defaultValue: dayjs(new Date()).format('YYYY-MM-DD'),
    }),
    FormFieldClass.select('terminationReason', {
      label: 'Termination Reason',
      required: true,
      options: terminationReasonOptions,
      defaultValue: 'Closed Business',
    }),
    FormFieldClass.textArea('terminationComments', {
      label: 'Other Termination Reason',
      required: true,
      showWhen: values => values.terminationReason === 'Other (Enter Reason)',
    }),
    FormFieldClass.textArea('terminationNotes', {
      label: 'Termination Notes',
    }),
    FormFieldClass.text('terminationRequestedBy', {
      label: 'Termination Requested By',
    }),
    FormFieldClass.button('submit', {
      text: 'Terminate Member',
      type: 'submit',
      loading,
    }),
  ]

  async function processTermination(values: any) {
    if (!selectedUser) {
      toast.error('Please select a user to terminate.')
      return
    }

    setLoading(true)
    const userId = selectedUser.id
    // Remove submit button field from input
    const formData = { ...values }
    delete formData.submit

    // Prepare the input for the admin mutation
    const input = {
      terminationDate: new Date(formData.terminationDate),
      terminationReason: formData.terminationReason,
      terminationComments:
        formData.terminationReason === 'Other (Enter Reason)'
          ? formData.terminationComments
          : undefined,
      terminationNotes: formData.terminationNotes,
      terminationRequestedBy: formData.terminationRequestedBy,
    }

    // Use the logged-in admin's name for terminatedByName
    const terminatedByName = user ? `${user.firstName} ${user.lastName}` : 'Admin'

    try {
      const res = await terminateMemberMutation({
        variables: {
          userId,
          terminatedByName,
          input,
        },
      })
      toast.success(
        `Terminated ${res?.data?.adminTerminateUser?.firstName} ${res?.data?.adminTerminateUser?.lastName}`,
      )
      setSelectedUser(null)
      window.scrollTo(0, 0)
      // Note: Form reset is handled differently in @nestledjs/forms
    } catch (e) {
      console.error(e)
      toast.error('Failed to terminate user. Please try again.')
    }
    setLoading(false)
  }

  const defaultValues = {
    terminationDate: dayjs(new Date()).format('YYYY-MM-DD'),
    terminationReason: 'Closed Business',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Terminate a Member</h2>

      <div className="mb-6">
        <WebUserSelect
          selectedPerson={selectedUser}
          setSelectedPerson={setSelectedUser}
          document={UsersDocument}
          label="Select User to Terminate"
        />
      </div>

      <Form
        theme={bizTheme}
        id="terminate-member-form"
        fields={formFields}
        submit={processTermination}
        defaultValues={defaultValues}
      />
    </div>
  )
}
