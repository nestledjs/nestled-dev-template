import React, { useState } from 'react'
import { useLoaderData, useRevalidator } from 'react-router'
import { BuildingOfficeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { RequireOwner } from '@nestled-template/web'
import { Form, FormFieldClass } from '@nestledjs/forms'
import { formTheme } from '@nestled-template/shared/styles'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MyOrganizationsDocument, MyOrganizationsQuery, useUserUpdateOrganizationMutation } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const myOrganizationsQueryRef = preloadQuery<MyOrganizationsQuery>(MyOrganizationsDocument, {
    fetchPolicy: 'network-only' // Always fetch fresh data, bypass cache
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
  const revalidator = useRevalidator()

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
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                Organization ID
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {activeOrganization?.id}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-white">
                Created
              </h4>
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
                  alert('Delete organization functionality will be implemented with proper confirmation flow')
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
