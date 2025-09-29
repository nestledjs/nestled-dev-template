import React, { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { PencilIcon, EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MeDocument, MeQuery, useResendVerificationEmailMutation } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  // Ensure we have fresh user data for this route
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  return { meQueryRef }
})

export default function ViewMyProfile() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery> }
  const { meQueryRef } = loaderData
  const { data } = useReadQuery(meQueryRef)
  const user = data?.me
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="flex-1 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  // Handle case where user exists but emails/phoneNumbers might not be loaded yet
  const primaryEmail = user.emails?.find?.(e => e.primary) || null
  const primaryPhone = user.phoneNumbers?.find?.(p => p.primary) || null

  return (
    <div className="flex-1 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h1>
              {user.displayName && (
                <p className="mt-1 text-lg text-zinc-600 dark:text-zinc-400">@{user.displayName}</p>
              )}
              {user.bio && (
                <p className="mt-4 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{user.bio}</p>
              )}
            </div>
            <Link
              to="/members/my-profile/edit"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-white/10"
            >
              <PencilIcon className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Contact Information</h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-2">
                <EnvelopeIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Email</p>
                {primaryEmail ? (
                  <p className="text-zinc-900 dark:text-white">{primaryEmail.email}</p>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400 italic">No email set</p>
                )}
                {primaryEmail && !user.emailValidated && (
                  <div className="mt-1">
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      <span aria-hidden="true">⚠️</span> Email not verified
                    </p>
                    <button
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
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline mt-1"
                    >
                      Click here to resend verification email
                    </button>
                    {verificationMessage && (
                      <p className="text-xs mt-1 text-zinc-600 dark:text-zinc-400">
                        {verificationMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}
            {primaryPhone && (
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-sky-100 dark:bg-sky-500/10 p-2">
                  <PhoneIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Phone</p>
                  <p className="text-zinc-900 dark:text-white">{primaryPhone.phone}</p>
                </div>
              </div>
            )}

            {/* All Emails */}
            {user.emails && Array.isArray(user.emails) && user.emails.length > 1 && (
              <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-3">All Emails</p>
                <div className="space-y-2">
                  {user.emails.map(email => (
                    <div
                      key={email.id}
                      className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <span>{email.email}</span>
                      {email.primary && (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-400">
                          Primary
                        </span>
                      )}
                      {email.verified ? (
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs">✓ Verified</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 text-xs">⚠ Unverified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Account Information</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-violet-100 dark:bg-violet-500/10 p-2">
                <CalendarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Member Since</p>
                <p className="text-zinc-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {user.isSuperAdmin && (
              <div className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                  <span aria-hidden="true">🔐</span> Super Administrator
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-500">
                  You have full administrative access to this application
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}