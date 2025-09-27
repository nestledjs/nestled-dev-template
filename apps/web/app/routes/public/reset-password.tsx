import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { WebUiContainer } from '@nestled-template/web-ui'
import { ResetPasswordInput, useResetPasswordMutation } from '@nestled-template/shared/sdk'
import { formTheme } from '@nestled-template/shared/styles'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [resetPasswordMutation, { loading }] = useResetPasswordMutation()
  const token = params.get('token') || ''

  async function handleReset(input: Omit<ResetPasswordInput, 'token'>) {
    setFormMessage(null)
    try {
      const { data } = await resetPasswordMutation({ variables: { input: { ...input, token } } })
      if (data?.resetPassword?.id) {
        setFormMessage({ type: 'success', text: 'Your password has been reset. You can now log in.' })
      } else {
        setFormMessage({ type: 'error', text: 'Unable to reset password. Please try again.' })
      }
    } catch (error) {
      setFormMessage({ type: 'error', text: (error as Error).message ?? 'Something went wrong' })
    }
  }

  const fields = [
    FormFieldClass.password('password', { label: 'New Password', required: true }),
    FormFieldClass.button('submit', { label: loading ? 'Resetting...' : 'Reset Password', loading }),
  ]

  return (
    <WebUiContainer>
      <div className="flex mt-16 ">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-md mx-auto">
          <h1 className="serif text-3xl text-center mb-2">Reset Password</h1>
          <p className="text-center text-zinc-600 mb-8">Enter your new password.</p>
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
          <Form theme={formTheme} id="reset-password-form" fields={fields} submit={handleReset as any} />
        </div>
      </div>
    </WebUiContainer>
  )
}


