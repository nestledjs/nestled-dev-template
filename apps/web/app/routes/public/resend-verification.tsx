import React, { useState } from 'react'
import { Link } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { WebUiContainer } from '@nestled-template/web-ui'
import { useResendVerificationEmailMutation } from '@nestled-template/shared/sdk'
import { formTheme } from '@nestled-template/shared/styles'

export default function ResendVerification() {
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [resendMutation, { loading }] = useResendVerificationEmailMutation()

  async function handleResend({ email }: { email: string }) {
    setFormMessage(null)
    try {
      const { data } = await resendMutation({ variables: { email } })
      if (data?.resendVerificationEmail) {
        setFormMessage({ type: 'success', text: 'Verification email sent. Please check your inbox.' })
      } else {
        setFormMessage({ type: 'error', text: 'Unable to send verification email. Please try again.' })
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: (error as Error).message ?? 'Something went wrong' })
    }
  }

  const fields = [
    FormFieldClass.email('email', { label: 'Email', required: true }),
    FormFieldClass.button('submit', { label: loading ? 'Sending...' : 'Resend Verification Email', loading }),
  ]

  return (
    <WebUiContainer>
      <div className="flex mt-16 ">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-md mx-auto">
          <h1 className="serif text-3xl text-center mb-2">Resend Verification Email</h1>
          <p className="text-center text-zinc-600 mb-8">Enter your email to receive a new verification link.</p>
          <p className="mt-2 text-center text-sm text-zinc-600 mb-6">
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Back to Login
            </Link>
          </p>
          {formMessage && (
            <div className={`mb-4 text-center rounded p-2 border ${formMessage.type === 'success' ? 'text-green-700 bg-green-100 border-green-300' : 'text-orange-700 bg-orange-100 border-orange-300'}`}>
              {formMessage.text}
            </div>
          )}
          <Form theme={formTheme} id="resend-verification-form" fields={fields} submit={handleResend as any} />
        </div>
      </div>
    </WebUiContainer>
  )
}


