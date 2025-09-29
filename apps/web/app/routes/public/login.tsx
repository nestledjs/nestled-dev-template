import React, { useState } from 'react'
import { Link, LoaderFunctionArgs, redirect, useLoaderData, useNavigate } from 'react-router'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { AuthLayout } from '@nestled-template/web'
import { getCookie, getJsonCookie } from '@nestled-template/shared/utils'
import { LoginInput, useLoginMutation } from '@nestled-template/shared/sdk'
import { formTheme } from '@nestled-template/shared/styles'

export async function loader({ request }: LoaderFunctionArgs) {
  const token = getCookie(request.headers, '__session')
  if (token) {
    throw redirect('/members/dashboard')
  }
  const isRemembered = getJsonCookie<{ email: string }>(request.headers, '_nestled_remember')
  return isRemembered ?? {}
}

export const ForgotPasswordWrapper = (children: React.ReactNode) => (
  <div key={'remember'} className="flex items-center justify-between">
    {children}
    <div className="text-sm">
      <Link to="/forgot-password" className="font-medium text-emerald-400 hover:text-emerald-300">
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
        // The backend already sets the __session cookie via the GraphQL mutation
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
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <div className="space-y-6">
        <p className="text-center text-sm text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
        {formError && (
          <div className="text-center text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm">
            {formError}
          </div>
        )}
        <Form id="login-form" theme={formTheme} fields={fields} submit={processLogin} />
      </div>
    </AuthLayout>
  )
}
