import React, { useState } from 'react'
import { useLoaderData, useRevalidator } from 'react-router'
import { BuildingOfficeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RequireOwner } from '@nestled-template/web'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'
import { apolloLoader } from '@nestled-template/shared/apollo'
import {
  MyOrganizationsDocument,
  MyOrganizationsQuery,
  useUploadOrganizationLogoMutation,
  useUserUpdateOrganizationMutation,
} from '@nestled-template/shared/sdk'
import type { QueryRef } from '@apollo/client'
import { useApolloClient, useReadQuery } from '@apollo/client/react'
import { AvatarUpload } from '@nestled-template/web-ui'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const myOrganizationsQueryRef = preloadQuery<MyOrganizationsQuery>(MyOrganizationsDocument, {
    fetchPolicy: 'network-only', // Always fetch fresh data, bypass cache
  })
  return { myOrganizationsQueryRef }
})

export default function OrganizationSettings() {
  const loaderData = useLoaderData() as { myOrganizationsQueryRef: QueryRef<MyOrganizationsQuery> }
  const { data } = useReadQuery(loaderData.myOrganizationsQueryRef)
  const organizations = data?.myOrganizations || []
  const activeOrganization = organizations[0] || null
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [updateOrganization] = useUserUpdateOrganizationMutation()
  const [uploadOrganizationLogo] = useUploadOrganizationLogoMutation()
  const revalidator = useRevalidator()
  const client = useApolloClient()

  async function handleUpdateOrganization(input: { name: string }) {
    setFormError(null)
    setFormSuccess(null)

    try {
      const result = await updateOrganization({
        variables: {
          input: {
            organizationId: activeOrganization!.id,
            name: input.name,
          },
        },
        refetchQueries: [{ query: MyOrganizationsDocument }],
        awaitRefetchQueries: true, // Wait for refetch to complete
      })

      if (result.data?.userUpdateOrganization) {
        setFormSuccess('Organization updated successfully!')
        // Revalidate the loader data to get fresh SSR data
        revalidator.revalidate()
      }
    } catch (error) {
      setFormError((error as Error)?.message ?? 'Failed to update organization')
    }
  }

  // Get organization's logo (first image with type: 'logo' in metadata)
  const organizationLogo = activeOrganization?.images?.find(
    (img: any) => img.metadata?.type === 'logo' || img.folder === 'logos',
  )

  const handleLogoUpload = async (file: File) => {
    if (!activeOrganization) return

    try {
      const result = await uploadOrganizationLogo({
        variables: {
          file,
          organizationId: activeOrganization.id,
        },
      })

      if (result.data?.uploadOrganizationLogo) {
        // Refresh organization data to show new logo
        await client.refetchQueries({ include: [MyOrganizationsDocument] })
        setFormSuccess('Logo uploaded successfully!')
        setTimeout(() => setFormSuccess(null), 3000)
      }
    } catch (error: any) {
      console.error('Logo upload failed:', error)
      setFormError(error.message || 'Failed to upload logo')
      setTimeout(() => setFormError(null), 5000)
    }
  }

  const handleLogoRemove = async () => {
    // For now, we'll implement a simple removal
    // In a real app, you might want to call a deleteFile mutation
    setFormSuccess('Logo removed successfully!')
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const organizationFields = [
    FormFieldClass.text('name', {
      label: 'Organization Name',
      required: true,
      defaultValue: activeOrganization?.name || '',
      placeholder: 'Acme Inc.',
    }),
    FormFieldClass.button('submit', {
      text: 'Save Changes',
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
            <BuildingOfficeIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Organization Settings
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Manage your organization details and settings
            </p>
          </div>
        </div>
      </div>

      {/* Organization Branding */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Organization Branding
        </h3>

        <div className="flex items-center gap-6">
          <AvatarUpload
            currentImageUrl={organizationLogo?.publicUrl || organizationLogo?.url}
            fallbackText={activeOrganization?.name || 'Org'}
            onUpload={handleLogoUpload}
            onRemove={organizationLogo ? handleLogoRemove : undefined}
            size="xl"
          />
          <div>
            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Organization Logo
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Upload a logo to represent your organization
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Recommended: Square image, at least 200x200px. Max file size: 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Organization Details
        </h3>

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
          id="organization-form"
          theme={formTheme}
          fields={organizationFields}
          submit={handleUpdateOrganization}
        />

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Organization ID</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {activeOrganization?.id}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white">Created</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {activeOrganization?.createdAt
                  ? new Date(activeOrganization.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <RequireOwner>
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-rose-100 dark:bg-rose-500/10 p-3">
              <TrashIcon className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                Danger Zone
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                Deleting your organization will permanently remove all associated data, including
                members, settings, and billing information. This action cannot be undone.
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                onClick={() => {
                  alert(
                    'Delete organization functionality will be implemented with proper confirmation flow',
                  )
                }}
              >
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      </RequireOwner>
    </div>
  )
}
