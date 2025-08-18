import React from 'react'
import { DATABASE_MODELS } from '@nestled-template/shared/sdk'
import { getPluralName } from '@nestledjs/helpers'
import { Link } from 'react-router' // Helper to convert PascalCase or camelCase to spaced words

// Helper to convert PascalCase or camelCase to spaced words
function spacedWords(name: string) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
}

// Helper to convert PascalCase or camelCase to kebab-case
function kebabCase(name: string) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export default function AdminDataIndex() {
  return (
    <div className="text-center py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Database Administration</h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose a data model from the sidebar to get started with managing your database records.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Available Models</h2>
          <p className="text-blue-700 mb-4">
            You can manage {DATABASE_MODELS.length} different data models in your database:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {DATABASE_MODELS.slice(0, 12).map(model => (
              <Link
                key={model.name}
                to={`/admin/data/${kebabCase(getPluralName(model.name))}`}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {getPluralName(spacedWords(model.name))}
              </Link>
            ))}
            {DATABASE_MODELS.length > 12 && (
              <span className="text-blue-600 italic">+{DATABASE_MODELS.length - 12} more...</span>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            This interface provides full CRUD (Create, Read, Update, Delete) operations for all your
            database models. Select a model from the sidebar to view and manage records.
          </p>
        </div>
      </div>
    </div>
  )
}
