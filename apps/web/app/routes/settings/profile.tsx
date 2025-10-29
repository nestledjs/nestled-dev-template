import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import {
  MeDocument,
  MeQuery,
  useChangeEmailMutation,
  useDeleteFileMutation,
  useDeleteUserAccountMutation,
  useExportUserDataLazyQuery,
  useResendVerificationEmailMutation,
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
} from '@nestled-template/shared/sdk'
import { QueryRef, useApolloClient, useReadQuery } from '@apollo/client/react'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'
import { AvatarUpload } from '@nestled-template/web-ui'
import TransferOwnershipModal from '../../components/TransferOwnershipModal'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  return { meQueryRef }
})

export default function ProfileSettings() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery> }
  const { data } = useReadQuery(loaderData.meQueryRef)
  const user = data?.me
  const client = useApolloClient()

  const [updateUser] = useUpdateUserMutation()
  const [changeEmail] = useChangeEmailMutation()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [deleteAccountMutation] = useDeleteUserAccountMutation()
  const [exportUserData] = useExportUserDataLazyQuery()
  const [uploadUserAvatar] = useUploadUserAvatarMutation()
  const [deleteFile] = useDeleteFileMutation()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [emailResendSuccess, setEmailResendSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)

  if (!user) {
    return <div>Loading...</div>
  }

  const primaryEmail = user.emails?.find(e => e.primary)

  // Get user's avatar (first image with type: 'avatar' in metadata)
  const userAvatar = user.images?.find(
    (img: any) => img.metadata?.type === 'avatar' || img.folder === 'avatars',
  )

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadUserAvatar({
        variables: { file },
      })

      if (result.data?.uploadUserAvatar) {
        // Refresh user data to show new avatar
        await client.refetchQueries({ include: [MeDocument] })
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error: any) {
      console.error('Avatar upload failed:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to upload avatar' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleAvatarRemove = async () => {
    if (!userAvatar?.id) {
      setMessage({ type: 'error', text: 'No avatar to remove' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    try {
      await deleteFile({
        variables: { uploadId: userAvatar.id },
      })

      // Refresh user data to remove avatar from UI
      await client.refetchQueries({ include: [MeDocument] })
      setMessage({ type: 'success', text: 'Avatar removed successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      console.error('Avatar removal failed:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to remove avatar' })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const AvatarSection = () => (
    <div className="flex items-center gap-6">
      <AvatarUpload
        currentImageUrl={userAvatar?.publicUrl || userAvatar?.url}
        fallbackText={
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.displayName || 'User'
        }
        onUpload={handleAvatarUpload}
        onRemove={userAvatar ? handleAvatarRemove : undefined}
        size="xl"
      />
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Profile Picture</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
          Upload a photo to personalize your account
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Recommended: Square image, at least 200x200px. Max file size: 5MB.
        </p>
      </div>
    </div>
  )

  const editProfileFields = [
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
      helpText: 'Your unique username (lowercase, alphanumeric only)',
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
                      variables: { email: primaryEmail.email },
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
    }
  }

  async function handleSubmit(values: any) {
    setLoading(true)
    setMessage(null)

    try {
      let emailChanged = false

      // Validate and sanitize displayName if changed
      if (values.displayName && values.displayName !== user?.displayName) {
        const cleanedUsername = values.displayName.toLowerCase().replace(/[^a-z0-9.]/g, '')
        if (cleanedUsername !== values.displayName) {
          setMessage({
            type: 'error',
            text: 'Username can only contain lowercase letters, numbers, and periods',
          })
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
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      if (error.message?.includes('Template email send failed')) {
        setMessage({
          type: 'error',
          text: 'Email service is not configured. Profile updates saved but verification email could not be sent.',
        })
      } else if (error.message?.includes('Template') && error.message?.includes('not found')) {
        setMessage({
          type: 'error',
          text: 'Email templates are not properly configured. Please contact support.',
        })
      } else if (
        error.message?.includes('Unique constraint') ||
        error.message?.includes('displayName')
      ) {
        setMessage({
          type: 'error',
          text: 'This username is already taken. Please choose another.',
        })
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    if (isExporting) return

    setIsExporting(true)
    setExportError(null)
    setExportSuccess(false)

    try {
      const result = await exportUserData()

      if (result.error) {
        throw new Error(result.error.message || 'Failed to export data')
      }

      const exportData = result.data?.exportUserData

      if (!exportData) {
        throw new Error('No export data returned')
      }

      // Download as JSON file
      const dataStr = JSON.stringify(exportData.userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `user-data-export-${new Date().toISOString().split('T')[0]}.json`
      link.click()

      // Show success feedback
      setExportSuccess(true)
      // Hide success message after 5 seconds
      setTimeout(() => setExportSuccess(false), 5000)
    } catch (error) {
      setExportError((error as Error).message)
      // Hide error message after 8 seconds
      setTimeout(() => setExportError(null), 8000)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion')
      return
    }

    try {
      await deleteAccountMutation()

      alert('Your account has been deleted. You will be logged out now.')
      // Redirect to login page
      window.location.href = '/login'
    } catch (error) {
      alert('Failed to delete account: ' + (error as Error).message)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  const handleTransferOwnership = () => {
    setShowTransferModal(true)
  }

  const handleTransferSuccess = () => {
    // Optionally refresh data or show success message
    // The modal will handle the success alert
  }

  const handleResendVerificationEmail = async () => {
    const primaryEmail = user.emails?.find(e => e.primary)?.email
    if (!primaryEmail) {
      alert('No primary email found')
      return
    }

    setIsResendingEmail(true)
    setEmailResendSuccess(false)

    try {
      await resendVerificationEmail({
        variables: { email: primaryEmail },
      })

      setEmailResendSuccess(true)
      // Hide success message after 5 seconds
      setTimeout(() => setEmailResendSuccess(false), 5000)
    } catch (error) {
      alert('Failed to resend verification email: ' + (error as Error).message)
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 dark:bg-sky-500/10 p-3">
            <UserCircleIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Settings</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage your personal information, avatar, and account details
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <AvatarSection />
      </div>

      {/* Personal Information Form */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Personal Information
        </h3>

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

      {/* Account Information */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-violet-100 dark:bg-violet-500/10 p-2">
            <CalendarIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Account Information
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-white/5">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Account Created</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-white/5">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Email Verified</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {user.emailValidated ? 'Yes' : 'No'}
              </p>
            </div>
            {!user.emailValidated && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleResendVerificationEmail}
                  disabled={isResendingEmail}
                  className="px-3 py-1.5 text-sm bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {isResendingEmail ? 'Sending...' : 'Verify Email'}
                </button>
                {emailResendSuccess && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircleIcon className="h-3 w-3" />
                    <span>Verification email sent! Check your inbox.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {user.isSuperAdmin && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Super Admin Status
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Yes - You have super admin privileges
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Export (GDPR) */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-blue-100 dark:bg-blue-500/10 p-2">
            <ArrowDownTrayIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Export Your Data</h3>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Download a copy of all your personal data in JSON format. This includes your profile
          information, security events, preferences, and organization memberships.
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export Personal Data'}
          </button>

          {exportSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircleIcon className="h-4 w-4" />
              <span>Your data has been exported successfully!</span>
            </div>
          )}

          {exportError && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <XCircleIcon className="h-4 w-4" />
              <span>Failed to export data: {exportError}</span>
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            GDPR Compliance: You have the right to access and export your personal data at any time.
          </p>
        </div>
      </div>

      {/* Organization Ownership Transfer */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-amber-100 dark:bg-amber-500/10 p-2">
            <ArrowsRightLeftIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Transfer Organization Ownership
          </h3>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          If you are the owner of an organization, you can transfer ownership to another member.
          This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={handleTransferOwnership}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Transfer Ownership
        </button>
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5 p-6 backdrop-blur">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-rose-100 dark:bg-rose-500/10 p-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-400">Danger Zone</h3>
        </div>

        <p className="text-sm text-rose-700 dark:text-rose-300 mb-4">
          <strong>Delete your account:</strong> Once you delete your account, there is no going
          back. This will permanently delete your account and all associated data. You will be
          removed from all organizations.
        </p>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Delete My Account
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-4 border-2 border-rose-300 dark:border-rose-500/30 rounded-lg bg-white dark:bg-rose-500/5">
              <p className="text-sm font-medium text-rose-900 dark:text-rose-300 mb-2">
                Are you absolutely sure?
              </p>
              <p className="text-sm text-rose-700 dark:text-rose-400 mb-3">
                This action <strong>cannot be undone</strong>. Please type <strong>DELETE</strong>{' '}
                to confirm.
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2 border border-rose-300 dark:border-rose-500/30 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                I understand, delete my account
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteConfirmText('')
                }}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Ownership Modal */}
      <TransferOwnershipModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSuccess={handleTransferSuccess}
      />
    </div>
  )
}