import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { Cog6ToothIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { apolloLoader } from '@nestled-template/shared/apollo'
import { MeDocument, MeQuery } from '@nestled-template/shared/sdk'
import { QueryRef, useReadQuery } from '@apollo/client'

interface UserPreference {
  id: string
  key: string
  value: string
  category: string
}

export const loader = apolloLoader()(({ preloadQuery }) => {
  const meQueryRef = preloadQuery<MeQuery>(MeDocument)
  return { meQueryRef }
})

export default function PreferencesSettings() {
  const loaderData = useLoaderData() as { meQueryRef: QueryRef<MeQuery> }
  const { data } = useReadQuery(loaderData.meQueryRef)
  const user = data?.me
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newCategory, setNewCategory] = useState('general')

  // Sample preferences - in real app, fetch from backend using useGetUserPreferencesQuery
  const [preferences, setPreferences] = useState<UserPreference[]>([
    { id: '1', key: 'theme', value: 'dark', category: 'UI' },
    { id: '2', key: 'language', value: 'en', category: 'UI' },
    { id: '3', key: 'timezone', value: 'America/New_York', category: 'UI' },
    { id: '4', key: 'dateFormat', value: 'MM/DD/YYYY', category: 'UI' },
    { id: '5', key: 'defaultView', value: 'dashboard', category: 'Workflow' },
    { id: '6', key: 'itemsPerPage', value: '25', category: 'Workflow' },
  ])

  const categories = ['UI', 'Workflow', 'Integrations', 'General']

  const handleAddPreference = () => {
    if (!newKey.trim() || !newValue.trim()) {
      return
    }

    const newPref: UserPreference = {
      id: Date.now().toString(),
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
    }

    setPreferences([...preferences, newPref])
    setNewKey('')
    setNewValue('')
    setNewCategory('general')
    setIsAddingNew(false)
    setFormSuccess('Preference added successfully!')
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const handleDeletePreference = (id: string) => {
    setPreferences(preferences.filter((p) => p.id !== id))
    setFormSuccess('Preference deleted!')
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const handleUpdatePreference = (id: string, newValue: string) => {
    setPreferences(
      preferences.map((p) => (p.id === id ? { ...p, value: newValue } : p))
    )
    setFormSuccess('Preference updated!')
    setTimeout(() => setFormSuccess(null), 3000)
  }

  const groupedPreferences = categories.map((category) => ({
    category,
    items: preferences.filter((p) => p.category === category),
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
                placeholder="e.g., sidebarCollapsed"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., true"
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-white/10 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                  setNewCategory('general')
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
            onClick={() => {
              const dataStr = JSON.stringify(preferences, null, 2)
              const dataBlob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(dataBlob)
              const link = document.createElement('a')
              link.href = url
              link.download = 'preferences.json'
              link.click()
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export Preferences
          </button>
          <button
            onClick={() => {
              alert('Import functionality will allow you to upload a JSON file with preferences')
            }}
            className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
          >
            Import Preferences
          </button>
        </div>
      </div>

      {/* Reset to Defaults */}
      <div className="rounded-xl border border-rose-200 dark:border-rose-500/20 bg-white dark:bg-white/5 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold text-rose-600 dark:text-rose-400 mb-2">
          Reset to Defaults
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Reset all preferences to their default values. This action cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all preferences to defaults?')) {
              setPreferences([])
              setFormSuccess('All preferences reset to defaults!')
              setTimeout(() => setFormSuccess(null), 3000)
            }
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reset All Preferences
        </button>
      </div>
    </div>
  )
}

interface PreferenceItemProps {
  preference: UserPreference
  onUpdate: (id: string, value: string) => void
  onDelete: (id: string) => void
}

function PreferenceItem({ preference, onUpdate, onDelete }: PreferenceItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(preference.value)

  const handleSave = () => {
    onUpdate(preference.id, editValue)
    setIsEditing(false)
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
              if (e.key === 'Escape') {
                setIsEditing(false)
                setEditValue(preference.value)
              }
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
              className="p-1.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/10"
              title="Save"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditValue(preference.value)
              }}
              className="p-1.5 rounded text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10"
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
              onClick={() => {
                if (confirm(`Delete preference "${preference.key}"?`)) {
                  onDelete(preference.id)
                }
              }}
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
