import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { WebUiContainer } from '@nestled-template/web-ui'
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
    <WebUiContainer>
      <div className="flex mt-16 ">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-md mx-auto">
          <h1 className="serif text-3xl text-center mb-2">Create your account</h1>
          <p className="text-center text-zinc-600 mb-8">Get started in minutes.</p>
          <p className="mt-2 text-center text-sm text-zinc-600 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              Log in
            </Link>
          </p>
          {formError && (
            <div className="mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded p-2">
              {formError}
            </div>
          )}
          <Form id="register-form" theme={formTheme} fields={fields} submit={processRegister} />
        </div>
      </div>
    </WebUiContainer>
  )
}


