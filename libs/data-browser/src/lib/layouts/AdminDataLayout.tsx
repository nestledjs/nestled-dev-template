import React, { useMemo, useState, useRef } from 'react'
import { getPluralName } from '../utils/get-plural-names'
import { Outlet, useNavigate, useParams } from 'react-router'
import { AdminLocalStorage } from '../utils/secure-storage'
import { kebabCase, spacedWords } from '../utils/string-utils'
import { useAdminDataContext } from '../context/AdminDataContext'

/**
 * Main layout component for admin data browser
 * Provides model selector, fullscreen toggle, and preferences import/export
 */
export function AdminDataLayout() {
  const navigate = useNavigate()
  const params = useParams()
  const { databaseModels, basePath = '/admin/data' } = useAdminDataContext()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sort models alphabetically by plural display name
  const sortedModels = useMemo(
    () =>
      [...databaseModels].sort((a, b) =>
        getPluralName(spacedWords(a.name)).localeCompare(getPluralName(spacedWords(b.name))),
      ),
    [databaseModels],
  )

  // Find the current model based on route params
  const currentModel = useMemo(() => {
    const pluralParam = params.dataTypePlural
    if (!pluralParam) return null

    return sortedModels.find(m => {
      const modelUrlName = kebabCase(getPluralName(m.name))
      return modelUrlName.toLowerCase() === pluralParam.toLowerCase()
    })
  }, [params.dataTypePlural, sortedModels])

  // Handle model selection
  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModelName = event.target.value
    if (selectedModelName) {
      const selectedModel = sortedModels.find(m => m.name === selectedModelName)
      if (selectedModel) {
        navigate(`${basePath}/${kebabCase(getPluralName(selectedModel.name))}`)
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Show notification with auto-dismiss
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Export preferences
  const handleExport = () => {
    const configJson = AdminLocalStorage.exportConfig()
    if (!configJson) {
      showNotification('error', 'Failed to export preferences')
      return
    }

    // Create download
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `admin-data-preferences-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)

    showNotification('success', 'Preferences exported successfully')
  }

  // Import preferences
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      if (!content) {
        showNotification('error', 'Failed to read file')
        return
      }

      const success = AdminLocalStorage.importConfig(content)
      if (success) {
        showNotification('success', 'Preferences imported successfully. Refreshing...')
        // Refresh the page to apply new preferences
        setTimeout(() => globalThis.location.reload(), 1500)
      } else {
        showNotification('error', 'Invalid preferences file')
      }
    } catch {
      showNotification('error', 'Failed to read file')
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerImport = () => {
    fileInputRef.current?.click()
  }

  const content = (
    <div className="max-w-full mx-auto flex flex-col p-0.5">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`mb-4 px-4 py-3 rounded-md border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
              : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Model Selector and Controls */}
      <div className="mb-6 space-y-3">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="model-selector"
              className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
            >
              Select Model
            </label>
            <div className="relative">
              <select
                id="model-selector"
                value={currentModel?.name || ''}
                onChange={handleModelChange}
                className="w-full h-[50px] pl-4 pr-10 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web text-base appearance-none cursor-pointer"
              >
                <option value="">Choose a model...</option>
                {sortedModels.map(model => (
                  <option key={model.name} value={model.name}>
                    {getPluralName(spacedWords(model.name))}
                  </option>
                ))}
              </select>
              {/* Custom chevron icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="h-[50px] px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-web focus:border-green-web transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Import/Export Preferences */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Preferences:</span>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-green-web dark:hover:text-green-web transition-colors"
            title="Export your preferences to a file"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={triggerImport}
            className="inline-flex items-center px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-green-web dark:hover:text-green-web transition-colors"
            title="Import preferences from a file"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* Page Content */}
      <div>
        <Outlet />
      </div>
    </div>
  )

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col overflow-auto">
        <div className="w-full p-6 md:p-8 lg:p-12">{content}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <main className="w-full p-6 md:p-8 lg:p-12">{content}</main>
    </div>
  )
}
