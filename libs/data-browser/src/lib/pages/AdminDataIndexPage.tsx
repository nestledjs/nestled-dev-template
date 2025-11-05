import React from 'react'
import { Link } from 'react-router'
import { getPluralName } from '@nestledjs/helpers'
import { useAdminDataContext } from '../context/AdminDataContext'
import { kebabCase, spacedWords } from '../utils/string-utils'

/**
 * Landing page for admin data browser showing all available models
 */
export function AdminDataIndexPage() {
  const { databaseModels, basePath = '/admin/data' } = useAdminDataContext()

  return (
    <div className="text-center py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Database Administration</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Choose a data model from the sidebar to get started with managing your database records.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">Available Models</h2>
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            You can manage {databaseModels.length} different data models in your database:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {databaseModels.slice(0, 12).map(model => (
              <Link
                key={model.name}
                to={`${basePath}/${kebabCase(getPluralName(model.name))}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
              >
                {getPluralName(spacedWords(model.name))}
              </Link>
            ))}
            {databaseModels.length > 12 && (
              <span className="text-blue-600 dark:text-blue-400 italic">+{databaseModels.length - 12} more...</span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>
            This interface provides full CRUD (Create, Read, Update, Delete) operations for all your
            database models. Select a model from the sidebar to view and manage records.
          </p>
        </div>
      </div>
    </div>
  )
}
