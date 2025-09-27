import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { WebUiContainer } from '@nestled-template/web-ui'
import { useVerifyEmailMutation } from '@nestled-template/shared/sdk'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('Verifying your email...')
  const [verifyEmailMutation] = useVerifyEmailMutation()

  useEffect(() => {
    const token = params.get('token') || ''
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token.')
      return
    }
    verifyEmailMutation({ variables: { input: { token } } })
      .then(({ data }) => {
        if (data?.verifyEmail?.id) {
          setStatus('success')
          setMessage('Your email has been verified. You can now continue.')
        } else {
          setStatus('error')
          setMessage('Invalid or expired verification token.')
        }
      })
      .catch(err => {
        setStatus('error')
        setMessage(err?.message ?? 'Something went wrong')
      })
  }, [params, verifyEmailMutation])

  return (
    <WebUiContainer>
      <div className="flex mt-16 ">
        <div className="bg-white rounded shadow-lg p-8 w-full max-w-md mx-auto text-center">
          <h1 className="serif text-3xl text-center mb-2">Verify Email</h1>
          <p className={`${status === 'success' ? 'text-green-700' : status === 'error' ? 'text-orange-700' : 'text-zinc-600'} mb-6`}>
            {message}
          </p>
          <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
            Go to Login
          </Link>
        </div>
      </div>
    </WebUiContainer>
  )
}


