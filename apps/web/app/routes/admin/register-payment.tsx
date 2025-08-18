import { useProcessPaymentMutation, User, UsersDocument } from '@nestled-template/shared/sdk'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { WebUserSelect } from '@nestled-template/web'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { bizTheme } from '@nestled-template/shared/styles'

export default function AdminRegisterPayment() {
  const [processPaymentMutation] = useProcessPaymentMutation()
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const formFields = [
    FormFieldClass.text('payment', {
      label: 'Payment Method',
      required: true,
      placeholder: 'e.g., Check, Cash, Credit Card',
    }),
    FormFieldClass.number('amount', {
      label: 'Amount',
      required: true,
      placeholder: 'Enter payment amount',
      min: 0,
      step: 0.01,
    }),
    FormFieldClass.checkbox('newMember', {
      label: 'New Member',
      defaultValue: false,
    }),
    FormFieldClass.button('submit', {
      label: 'Register Payment',
      type: 'submit',
      loading,
    }),
  ]

  async function processPayment(values: any) {
    if (!selectedUser) {
      toast.error('Please select a user to register payment for.')
      return
    }

    setLoading(true)
    const { payment, amount, newMember, submit, ...otherValues } = values
    const userId = selectedUser.id

    console.log('Register payment:', userId, payment, amount, newMember)

    let res
    try {
      res = await processPaymentMutation({
        variables: {
          userId,
          payment,
          amount: parseFloat(amount), // Ensure amount is a number
          newMember: newMember || false,
        },
      })
      toast.success(
        `Payment registered for ${res?.data?.adminReceivePayment?.firstName} ${res?.data?.adminReceivePayment?.lastName}`,
      )
      setSelectedUser(null)
      window.scrollTo(0, 0)
      // Note: Form reset is handled differently in @nestledjs/forms
    } catch (e) {
      console.error(e)
      toast.error('Failed to register payment. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Payment</h2>

      <div className="mb-6">
        <WebUserSelect
          selectedPerson={selectedUser}
          setSelectedPerson={setSelectedUser}
          document={UsersDocument}
          label="Select User to Register Payment For"
        />
      </div>

      <Form
        theme={bizTheme}
        id="register-payment-form"
        fields={formFields}
        submit={processPayment}
      />
    </div>
  )
}
