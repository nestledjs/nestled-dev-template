import React, { useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'
import { useUpdateUserMutation, useChangeEmailMutation, useResendVerificationEmailMutation, useChangePasswordMutation, MeDocument, MeQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery, useApolloClient } from '@apollo/client'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'
import { apolloLoader } from '@nestled-template/shared/apollo'

export const loader = apolloLoader()(({ preloadQuery }) => {
  // Ensure we have fresh user data for this route
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  return { meQueryRef }
})

export default function EditProfile() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery> }
  const { meQueryRef } = loaderData
  const { data } = useReadQuery(meQueryRef)
  const user = data?.me
  const client = useApolloClient()
  const navigate = useNavigate()
  const [updateUser] = useUpdateUserMutation()
  const [changeEmail] = useChangeEmailMutation()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [changePassword] = useChangePasswordMutation()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)

  // Handle loading state after hooks
  if (!user) {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  const primaryEmail = user.emails?.find(e => e.primary)

  const editProfileFields = [
    FormFieldClass.content('headerPersonal', {
      content: <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Personal Information</h2>,
    }),
    FormFieldClass.text('firstName', {
      label: 'First Name',
      required: false,
    }),
    FormFieldClass.text('lastName', {
      label: 'Last Name',
      required: false,
    }),
    FormFieldClass.text('displayName', {
      label: 'Username',
      required: false,
      description: 'Your unique username (lowercase, alphanumeric only)',
    }),
    FormFieldClass.email('email', {
      label: 'Email',
      required: true,
    }),
    FormFieldClass.content('emailVerificationStatus', {
      content: (
        <>
          {primaryEmail && !user.emailValidated && (
            <div className="-mt-2 mb-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                <span aria-hidden="true">⚠️</span> Email not verified
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await resendVerificationEmail({
                      variables: { email: primaryEmail.email }
                    })
                    setVerificationMessage('Verification email sent! Please check your inbox.')
                    setTimeout(() => setVerificationMessage(null), 5000)
                  } catch (error) {
                    setVerificationMessage('Failed to send verification email. Please try again.')
                    setTimeout(() => setVerificationMessage(null), 5000)
                  }
                }}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline mt-1"
              >
                Click here to resend verification email
              </button>
              {verificationMessage && (
                <p className="text-sm mt-1 text-zinc-600 dark:text-zinc-400">
                  {verificationMessage}
                </p>
              )}
            </div>
          )}
        </>
      ),
    }),
    FormFieldClass.content('headerPassword', {
      content: (
        <div className="border-t border-zinc-200 dark:border-white/10 pt-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Change Password</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Leave blank to keep your current password</p>
        </div>
      ),
    }),
    FormFieldClass.password('currentPassword', {
      label: 'Current Password',
      required: false,
    }),
    FormFieldClass.content('forgotPasswordLink', {
      content: (
        <div className="-mt-2 mb-2">
          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline"
          >
            Forgot your current password?
          </Link>
        </div>
      ),
    }),
    FormFieldClass.password('newPassword', {
      label: 'New Password',
      required: false,
    }),
    FormFieldClass.password('confirmPassword', {
      label: 'Confirm New Password',
      required: false,
    }),
    FormFieldClass.content('buttons', {
      content: (
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:outline-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/members/my-profile')}
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-700"
          >
            Cancel
          </button>
        </div>
      ),
    }),
  ]

  function defaultValues() {
    return {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      email: primaryEmail?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  }

  async function handleSubmit(values: any) {
    setLoading(true)
    setMessage(null)

    try {
      // Validate password fields
      if (values.newPassword || values.currentPassword) {
        if (!values.currentPassword) {
          setMessage({ type: 'error', text: 'Current password is required to change your password' })
          setLoading(false)
          return
        }
        if (!values.newPassword) {
          setMessage({ type: 'error', text: 'New password is required' })
          setLoading(false)
          return
        }
        if (values.newPassword !== values.confirmPassword) {
          setMessage({ type: 'error', text: 'New passwords do not match' })
          setLoading(false)
          return
        }
        if (values.newPassword.length < 8) {
          setMessage({ type: 'error', text: 'New password must be at least 8 characters' })
          setLoading(false)
          return
        }
      }

      let emailChanged = false

      // Validate and sanitize displayName if changed
      if (values.displayName && values.displayName !== user?.displayName) {
        const cleanedUsername = values.displayName.toLowerCase().replace(/[^a-z0-9.]/g, '')
        if (cleanedUsername !== values.displayName) {
          setMessage({ type: 'error', text: 'Username can only contain lowercase letters, numbers, and periods' })
          setLoading(false)
          return
        }
        if (cleanedUsername.length < 3) {
          setMessage({ type: 'error', text: 'Username must be at least 3 characters' })
          setLoading(false)
          return
        }
      }

      // Update user fields if changed (excluding password)
      const updates: any = {}
      if (values.firstName !== user?.firstName) updates.firstName = values.firstName
      if (values.lastName !== user?.lastName) updates.lastName = values.lastName
      if (values.displayName && values.displayName !== user?.displayName) {
        updates.displayName = values.displayName.toLowerCase().replace(/[^a-z0-9.]/g, '')
      }

      if (Object.keys(updates).length > 0 && user?.id) {
        await updateUser({
          variables: {
            userId: user.id,
            input: updates,
          },
        })
      }

      // Handle password change separately with current password verification
      if (values.newPassword && values.currentPassword) {
        await changePassword({
          variables: {
            input: {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            },
          },
        })
      }

      // Handle email change with verification
      if (values.email !== primaryEmail?.email) {
        await changeEmail({
          variables: {
            input: {
              newEmail: values.email,
            },
          },
        })
        emailChanged = true
      }

      await client.refetchQueries({ include: [MeDocument] })

      if (emailChanged) {
        setMessage({
          type: 'success',
          text: 'Profile updated! A verification email has been sent to your new address. Please verify to complete the email change.',
        })
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => {
          navigate('/members/my-profile')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      // Handle specific error cases
      if (error.message?.includes('Template email send failed')) {
        setMessage({
          type: 'error',
          text: 'Email service is not configured. Profile updates saved but verification email could not be sent.'
        })
      } else if (error.message?.includes('Template') && error.message?.includes('not found')) {
        setMessage({
          type: 'error',
          text: 'Email templates are not properly configured. Please contact support.'
        })
      } else if (error.message?.includes('Unique constraint') || error.message?.includes('displayName')) {
        setMessage({ type: 'error', text: 'This username is already taken. Please choose another.' })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Edit Profile</h1>

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          <Form
            theme={formTheme}
            id="edit-profile-form"
            fields={editProfileFields}
            submit={handleSubmit}
            defaultValues={defaultValues()}
            key={user.id}
          />
        </div>
      </div>
    </div>
  )
}