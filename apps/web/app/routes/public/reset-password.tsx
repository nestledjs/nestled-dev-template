import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { AuthLayout } from '@nestled-template/web'
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
    FormFieldClass.button('submit', { text: loading ? 'Resetting...' : 'Reset Password', type: 'submit', loading }),
  ]

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <div className="space-y-6">
        <p className="text-center text-sm text-zinc-400">
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Back to Login
          </Link>
        </p>
        {formMessage && (
          <div className={`text-center rounded-lg p-3 text-sm border ${formMessage.type === 'success' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-300 bg-rose-500/10 border-rose-500/20'}`}>
            {formMessage.text}
          </div>
        )}
        <Form theme={formTheme} id="reset-password-form" fields={fields} submit={handleReset as any} />
      </div>
    </AuthLayout>
  )
}


