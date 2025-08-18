import React, { useState } from 'react'
import { Link, LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { WebUiContainer } from '@nestled-template/web-ui'
import { getCookie, getJsonCookie } from '@nestled-template/shared/utils'
import { LoginInput, useLoginMutation } from '@nestled-template/shared/sdk'
import { bizTheme } from '@nestled-template/shared/styles'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session_biz')
  if (token) {
    throw redirect('/members/dashboard')
  }
  const isRemembered = getJsonCookie<{ email: string }>(request.headers, '_biz_remember')
  return isRemembered ?? {}
}

export const ForgotPasswordWrapper = (children: React.ReactNode) => (
  <div key={'remember'} className="flex items-center justify-between">
    {children}
    <div className="text-sm">
      <Link to="/forgot-password" className="font-medium text-orange-600 hover:text-orange-500">
        Forgot your password?
      </Link>
    </div>
  </div>
)

export default function Login() {
  const isRemembered = useLoaderData()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const [loginMutation] = useLoginMutation()

  async function processLogin(input: LoginInput) {
    console.log('Login Clicked')
    setFormError(null)
    try {
      const { data } = await loginMutation({ variables: { input } })
      const loginInfo = data?.login
      if (loginInfo?.user?.id) {
        // The backend already sets the __session_biz cookie via the GraphQL mutation
        // We should not set our own cookies here, just navigate
        navigate('/members/dashboard')
      } else {
        setFormError('Invalid login credentials')
      }
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Something went wrong')
    }
  }

  const fields = [
    FormFieldClass.email('email', {
      label: 'Email',
      required: true,
      defaultValue: isRemembered?.email ?? '',
    }),
    FormFieldClass.password('password', { label: 'Password', required: true }),
    FormFieldClass.checkbox('remember', {
      label: 'Remember me',
      defaultValue: !!isRemembered?.email,
      customWrapper: ForgotPasswordWrapper,
    }),
    FormFieldClass.button('submit', { fullWidth: true, text: 'Log In', type: 'submit' }),
  ]

  return (
    <WebUiContainer>
      <div className="flex mt-16 ">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-md mx-auto">
          <h1 className="serif text-3xl text-center mb-2">Biz Member Center</h1>
          <p className="text-center text-zinc-600 mb-8">Sign In to Your Account</p>
          <p className="mt-2 text-center text-sm text-zinc-600 mb-6">
            Not a Member?{'    '}
            <Link
              to="/directory/chapters"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Find a Chapter
            </Link>
          </p>
          {formError && (
            <div className="mb-4 text-center text-orange-700 bg-orange-100 border border-orange-300 rounded p-2">
              {formError}
            </div>
          )}
          <Form id="login-form" theme={bizTheme} fields={fields} submit={processLogin} />
        </div>
      </div>
    </WebUiContainer>
  )
}
