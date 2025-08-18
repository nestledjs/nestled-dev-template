import { Form, useSearchParams } from 'react-router'
import { useState } from 'react'
import { WebUiContainer } from '@nestled-template/web-ui'
import {
  type AdminTopChaptersByBizQueryVariables,
  useAdminTopChaptersByBizQuery,
} from '@nestled-template/shared/sdk'

// Interface remains useful for type casting data
interface ChapterBizData {
  chapterId: string
  chapterName: string
  memberCount: number
  totalBiz: number
}

// Helper function to safely parse integer search parameters
const parseOptionalInt = (param: string | null): number | undefined => {
  if (param === null || param?.trim() === '') {
    return undefined // Treat null or empty string as undefined
  }
  const num = parseInt(param, 10)
  return isNaN(num) || num === 0 ? undefined : num // Return undefined if parsing fails (NaN) or if the value is 0
}

export default function AdminBizReport() {
  // Use search params to get filter values from the URL
  const [searchParams] = useSearchParams()
  const startDate = searchParams.get('startDate') || undefined
  const endDate = searchParams.get('endDate') || undefined
  // Use the helper function for safe parsing
  const minMembers = parseOptionalInt(searchParams.get('minMembers'))
  const maxMembers = parseOptionalInt(searchParams.get('maxMembers'))

  // Prepare variables for the query hook
  const filters: AdminTopChaptersByBizQueryVariables['input'] = {
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    minMembers,
    maxMembers,
    limit: 10, // Show top 10 by default
  }

  // Call the query hook
  const { data, loading, error } = useAdminTopChaptersByBizQuery({
    variables: { input: filters },
  })

  const [showFilters, setShowFilters] = useState(
    !!startDate || !!endDate || minMembers !== undefined || maxMembers !== undefined,
  )

  // Extract chapters safely from the hook's data
  const chapters = data?.adminTopChaptersByBiz || []
  const chapterList = Array.isArray(chapters) ? (chapters as ChapterBizData[]) : []

  // Handle loading state
  if (loading) {
    return (
      <WebUiContainer>
        <div className="px-4 sm:px-6 lg:px-8 text-center py-10">Loading report data...</div>
      </WebUiContainer>
    )
  }

  // Handle error state
  if (error) {
    console.error('GraphQL Error:', error)
    return (
      <WebUiContainer>
        <div className="px-4 sm:px-6 lg:px-8 text-center py-10 text-red-600">
          Error loading report data.
        </div>
      </WebUiContainer>
    )
  }

  return (
    <WebUiContainer>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Top 5 Chapters by $ in Biz</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of the top 5 chapters ranked by total $ in Biz, filterable by date range and
              chapter size.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <Form method="get" className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  defaultValue={startDate ?? ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  defaultValue={endDate ?? ''}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="minMembers" className="block text-sm font-medium text-gray-700">
                  Min Members
                </label>
                <input
                  type="number"
                  name="minMembers"
                  id="minMembers"
                  defaultValue={minMembers ?? ''}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700">
                  Max Members
                </label>
                <input
                  type="number"
                  name="maxMembers"
                  id="maxMembers"
                  defaultValue={maxMembers ?? ''}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </Form>
        )}

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Chapter Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Member Count
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total $ in Biz
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Average $ per Member
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {chapterList.map((chapter, index) => (
                      <tr key={chapter.chapterId}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {chapter.chapterName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {chapter.memberCount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {/* Ensure totalBiz is treated as a number */}$
                          {Number(chapter.totalBiz || 0).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {/* Avoid division by zero and ensure numbers */}$
                          {chapter.memberCount > 0
                            ? Math.round(
                                Number(chapter.totalBiz || 0) / chapter.memberCount,
                              ).toLocaleString()
                            : '0'}
                        </td>
                      </tr>
                    ))}
                    {chapterList.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={5}
                          className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500"
                        >
                          No data available for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebUiContainer>
  )
}
