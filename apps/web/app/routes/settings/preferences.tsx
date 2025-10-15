import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { Cog6ToothIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import {
  MeDocument,
  MeQuery,
  UserPreferencesDocument,
  UserPreferencesQuery,
  useCreateUserPreferenceMutation,
  useUpdateUserPreferenceMutation,
  useDeleteUserPreferenceMutation
} from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

export const loader = apolloLoader()(({ preloadQuery }) => {
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  const preferencesQueryRef = preloadQuery<UserPreferencesQuery>(UserPreferencesDocument, {
    variables: {
      input: {
        orderBy: 'key',
        orderDirection: 'asc'
      }
    }
  })
  return { meQueryRef, preferencesQueryRef }
})

export default function PreferencesSettings() {
  const loaderData = useLoaderData() as {
    meQueryRef: QueryRef<MeQuery>
    preferencesQueryRef: QueryRef<UserPreferencesQuery>
  }
  const { data } = useReadQuery(loaderData.meQueryRef)
  const { data: preferencesData, refetch: refetchPreferences } = useReadQuery(loaderData.preferencesQueryRef)
  const user = data?.me
  const preferences = preferencesData?.userPreferences || []

  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const [createPreference] = useCreateUserPreferenceMutation()
  const [updatePreference] = useUpdateUserPreferenceMutation()
  const [deletePreference] = useDeleteUserPreferenceMutation()

  const showSuccess = (message: string) => {
    setFormSuccess(message)
    setFormError(null)
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const showError = (message: string) => {
    setFormError(message)
    setFormSuccess(null)
  }

  const handleAddPreference = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      showError('Key and value are required')
      return
    }

    try {
      await createPreference({
        variables: {
          input: {
            key: newKey.trim(),
            value: newValue.trim(),
          },
        },
        refetchQueries: [{ query: UserPreferencesDocument }],
      })

      setNewKey('')
      setNewValue('')
      setIsAddingNew(false)
      showSuccess('Preference added successfully!')
    } catch (error) {
      showError((error as Error)?.message ?? 'Failed to add preference')
    }
  }

  const handleDeletePreference = async (preferenceId: string, key: string) => {
    if (!confirm(`Delete preference "${key}"?`)) {
      return
    }

    try {
      await deletePreference({
        variables: { userPreferenceId: preferenceId },
        refetchQueries: [{ query: UserPreferencesDocument }],
      })
      showSuccess('Preference deleted!')
    } catch (error) {
      showError((error as Error)?.message ?? 'Failed to delete preference')
    }
  }

  const handleUpdatePreference = async (preferenceId: string, newValue: string) => {
    try {
      await updatePreference({
        variables: {
          userPreferenceId: preferenceId,
          input: { value: newValue },
        },
        refetchQueries: [{ query: UserPreferencesDocument }],
      })
      showSuccess('Preference updated!')
    } catch (error) {
      showError((error as Error)?.message ?? 'Failed to update preference')
    }
  }

  const handleExportPreferences = () => {
    const exportData = preferences.map(p => ({
      key: p.key,
      value: p.value,
    }))
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `preferences-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    showSuccess('Preferences exported!')
  }

  const handleImportPreferences = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const imported = JSON.parse(text)

        if (!Array.isArray(imported)) {
          showError('Invalid import file format')
          return
        }

        // Import each preference
        for (const item of imported) {
          if (!item.key || !item.value) continue

          try {
            await createPreference({
              variables: {
                input: {
                  key: item.key,
                  value: item.value,
                },
              },
            })
          } catch (error) {
            // Preference might already exist, try updating
            const existing = preferences.find(p => p.key === item.key)
            if (existing) {
              await updatePreference({
                variables: {
                  userPreferenceId: existing.id,
                  input: { value: item.value },
                },
              })
            }
          }
        }

        refetchPreferences()
        showSuccess(`Imported ${imported.length} preferences!`)
      } catch (error) {
        showError('Failed to import preferences: ' + (error as Error).message)
      }
    }
    input.click()
  }

  const handleResetPreferences = async () => {
    if (!confirm('Are you sure you want to delete all preferences? This action cannot be undone.')) {
      return
    }

    try {
      // Delete all preferences
      for (const pref of preferences) {
        await deletePreference({
          variables: { userPreferenceId: pref.id },
        })
      }

      refetchPreferences()
      showSuccess('All preferences deleted!')
    } catch (error) {
      showError('Failed to reset preferences')
    }
  }

  // Group preferences by a simple categorization
  const categorizeKey = (key: string): string => {
    if (key.startsWith('ui_') || ['theme', 'language', 'timezone', 'dateFormat'].includes(key)) {
      return 'UI'
    }
    if (key.startsWith('workflow_') || ['defaultView', 'itemsPerPage'].includes(key)) {
      return 'Workflow'
    }
    if (key.startsWith('integration_')) {
      return 'Integrations'
    }
    return 'General'
  }

  const categories = ['UI', 'Workflow', 'Integrations', 'General']
  const groupedPreferences = categories.map((category) => ({
    category,
    items: preferences.filter((p) => categorizeKey(p.key) === category),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 dark:bg-emerald-500/10 p-3">
              <Cog6ToothIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                User Preferences
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Customize your application experience
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Preference
          </button>
        </div>
      </div>

      {formSuccess && (
        <div className="rounded-lg text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-3">
          {formSuccess}
        </div>
      )}

      {formError && (
        <div className="rounded-lg text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 p-3">
          {formError}
        </div>
      )}

      {/* Add New Preference Form */}
      {isAddingNew && (
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Add New Preference
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., ui_sidebarCollapsed or theme"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Tip: Use prefixes like ui_, workflow_, or integration_ to organize preferences
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., true, dark, or 25"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddPreference}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save Preference
              </button>
              <button
                onClick={() => {
                  setIsAddingNew(false)
                  setNewKey('')
                  setNewValue('')
                }}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences by Category */}
      {groupedPreferences.map(
        ({ category, items }) =>
          items.length > 0 && (
            <div
              key={category}
              className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                {category} Preferences
              </h3>

              <div className="space-y-3">
                {items.map((pref) => (
                  <PreferenceItem
                    key={pref.id}
                    preference={pref}
                    onUpdate={handleUpdatePreference}
                    onDelete={handleDeletePreference}
                  />
                ))}
              </div>
            </div>
          )
      )}

      {preferences.length === 0 && !isAddingNew && (
        <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur text-center">
          <Cog6ToothIcon className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-600 dark:text-zinc-400">
            No preferences set yet. Click "Add Preference" to get started.
          </p>
        </div>
      )}

      {/* Import/Export */}
      <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Import / Export Preferences
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Export your preferences to back them up or transfer them to another device. You can also import preferences from a JSON file.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleExportPreferences}
            disabled={preferences.length === 0}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export Preferences
          </button>
          <button
            onClick={handleImportPreferences}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            Import Preferences
          </button>
        </div>
      </div>

      {/* Reset to Defaults */}
      {preferences.length > 0 && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-white dark:bg-white/5 p-6 backdrop-blur">
          <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">
            Delete All Preferences
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Delete all your preferences. This action cannot be undone.
          </p>
          <button
            onClick={handleResetPreferences}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Delete All Preferences
          </button>
        </div>
      )}
    </div>
  )
}

interface PreferenceItemProps {
  preference: {
    id: string
    key: string
    value: string
  }
  onUpdate: (id: string, value: string) => void
  onDelete: (id: string, key: string) => void
}

function PreferenceItem({ preference, onUpdate, onDelete }: PreferenceItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(preference.value)

  const handleSave = () => {
    onUpdate(preference.id, editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(preference.value)
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono font-medium text-zinc-900 dark:text-white">
            {preference.key}
          </code>
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') handleCancel()
            }}
            className="mt-2 w-full px-3 py-1.5 rounded border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            autoFocus
          />
        ) : (
          <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1 block">
            {preference.value}
          </code>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-2 py-1 rounded text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10"
              title="Save"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-2 py-1 rounded text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10"
              title="Cancel"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/10"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(preference.id, preference.key)}
              className="p-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/10"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
