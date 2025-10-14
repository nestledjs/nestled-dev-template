import React, { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { ShieldCheckIcon, KeyIcon, DeviceTabletIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MeDocument, MeQuery, useChangePasswordMutation, SecurityEventsDocument, SecurityEventsQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  const securityEventsQueryRef = preloadQuery<SecurityEventsQuery>(SecurityEventsDocument, {
    variables: {
      input: {
        take: 3,
        orderBy: 'createdAt',
        orderDirection: 'desc'
      }
    }
  })
  return { meQueryRef, securityEventsQueryRef }
})

export default function SecuritySettings() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery>; securityEventsQueryRef: QueryRef<SecurityEventsQuery> }
  const { data } = useReadQuery(loaderData.meQueryRef)
  const { data: securityEventsData } = useReadQuery(loaderData.securityEventsQueryRef)
  const user = data?.me
  const securityEvents = securityEventsData?.securityEvents || []
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [changePassword] = useChangePasswordMutation()

  async function handleChangePassword(input: { currentPassword: string; newPassword: string; confirmPassword: string }) {
    setFormError(null)
    setFormSuccess(null)

    if (input.newPassword !== input.confirmPassword) {
      setFormError('New passwords do not match')
      return
    }

    if (input.newPassword.length < 8) {
      setFormError('Password must be at least 8 characters')
      return
    }

    try {
      const { data } = await changePassword({
        variables: {
          input: {
            currentPassword: input.currentPassword,
            newPassword: input.newPassword,
          },
        },
      })

      if (data?.changePassword) {
        setFormSuccess('Password changed successfully!')
      } else {
        setFormError('Failed to change password')
      }
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Failed to change password')
    }
  }

  const passwordFields = [
    FormFieldClass.password('currentPassword', {
      label: 'Current Password',
      required: true,
    }),
    FormFieldClass.password('newPassword', {
      label: 'New Password',
      required: true,
      minLength: 8,
      helperText: 'Must be at least 8 characters',
    }),
    FormFieldClass.password('confirmPassword', {
      label: 'Confirm New Password',
      required: true,
      minLength: 8,
    }),
    FormFieldClass.button('submit', {
      text: 'Change Password',
      type: 'submit',
      fullWidth: false,
    }),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-3">
            <ShieldCheckIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Security Settings
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage your account security and authentication
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-sky-100 dark:bg-sky-500/10 p-2">
            <KeyIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Change Password
          </h3>
        </div>

        {formError && (
          <div className="mb-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="mb-4 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
            {formSuccess}
          </div>
        )}

        <Form
          id="change-password-form"
          theme={formTheme}
          fields={passwordFields}
          submit={handleChangePassword}
        />
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-violet-100 dark:bg-violet-500/10 p-2">
            <DeviceTabletIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Two-Factor Authentication
          </h3>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </p>

        <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${user?.twoFactorEnabled ? 'bg-emerald-500' : 'bg-zinc-400'}`}></div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {user?.twoFactorEnabled
                  ? 'Two-factor authentication is active'
                  : 'Two-factor authentication is not enabled'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
            onClick={() => {
              alert('2FA setup will be implemented with QR code generation and verification')
            }}
          >
            {user?.twoFactorEnabled ? 'Manage' : 'Enable'} 2FA
          </button>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Active Sessions
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Manage your active sessions across all devices. You can log out of any session you don't recognize.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                Current Device
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Your current session
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
              Active
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-4 text-sm text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium"
          onClick={() => {
            alert('Session management will be implemented to show and revoke active sessions')
          }}
        >
          Log out of all other sessions
        </button>
      </div>

      {/* Security Events */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-amber-100 dark:bg-amber-500/10 p-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Recent Security Events
          </h3>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          View recent security-related activities on your account.
        </p>

        <div className="space-y-3">
          {securityEvents.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400 p-3">
              No recent security events
            </div>
          ) : (
            securityEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-zinc-50 dark:bg-white/5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {event.metadata?.eventType || 'Security event'}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {new Date(event.createdAt).toLocaleString()}
                    {event.ipAddress && (
                      <span className="ml-2">• IP: {event.ipAddress}</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <Link
          to="/settings/security/events"
          className="mt-4 inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
        >
          View all security events →
        </Link>
      </div>
    </div>
  )
}
