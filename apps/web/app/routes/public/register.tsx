import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { AuthLayout } from '@nestled-template/web'
import { RegisterInput, useRegisterMutation } from '@nestled-template/shared/sdk'
import { formTheme } from '@nestled-template/shared/styles'

export default function Register() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [registerMutation, { loading }] = useRegisterMutation()

  async function processRegister(input: RegisterInput) {
    setFormError(null)
    try {
      const { data } = await registerMutation({ variables: { input } })
      const token = data?.register?.token
      if (token) {
        navigate('/members/dashboard')
      } else {
        setFormError('Unable to register. Please try again.')
      }
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Something went wrong')
    }
  }

  const fields = [
    FormFieldClass.text('firstName', { label: 'First Name' }),
    FormFieldClass.text('lastName', { label: 'Last Name' }),
    FormFieldClass.email('email', { label: 'Email', required: true }),
    FormFieldClass.password('password', { label: 'Password', required: true }),
    FormFieldClass.button('submit', { fullWidth: true, text: loading ? 'Creating Account...' : 'Create Account', type: 'submit' }),
  ]

  return (
    <AuthLayout title="Create your account" subtitle="Get started in minutes">
      <div className="space-y-6">
        <p className="text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Log in
          </Link>
        </p>
        {formError && (
          <div className="text-center text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm">
            {formError}
          </div>
        )}
        <Form id="register-form" theme={formTheme} fields={fields} submit={processRegister} />
      </div>
    </AuthLayout>
  )
}


