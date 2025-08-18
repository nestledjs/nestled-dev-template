import { Link } from 'react-router'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this section.
          </p>
        </div>
        <div className="text-center space-y-3">
          <Link
            to="/members/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </Link>
          <div>
            <Link
              to="/public"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Or return to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 