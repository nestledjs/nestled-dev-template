import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { useChaptersQuery, Chapter } from '@nestled-template/shared/sdk'
import { clsx } from 'clsx'

interface WebChapterSelectProps {
  selectedChapter?: Chapter | null
  setSelectedChapter: (chapter: Chapter | null) => void
  label: string
  placeholder?: string
}

export function WebChapterSelect(props: Readonly<WebChapterSelectProps>) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Build search input using search and searchFields (like in WebListChapters)
  const searchInput = query.trim() ? {
    take: 50, // More chapters than the default 20
    search: query.trim(),
    searchFields: ['name', 'city', 'state'],
  } : { take: 50 }

  const { data, loading } = useChaptersQuery({
    variables: { input: searchInput },
    // Only fetch when we have a search term or want initial results
    skip: false
  })

  const chapters = data?.chapters || []

  // Handle input changes and keep dropdown open
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  // Handle clearing selection
  const handleClear = () => {
    setQuery('')
    props?.setSelectedChapter(null)
    setIsOpen(true) // Keep dropdown open after clearing
  }

  // Handle chapter selection
  const handleChapterSelect = (chapter: Chapter | null) => {
    props?.setSelectedChapter(chapter)
    setIsOpen(false) // Close dropdown when selection is made
  }

  return (
    <Combobox as="div" value={props?.selectedChapter} onChange={handleChapterSelect}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">{props.label}</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          displayValue={(chapter: Chapter) => chapter?.name || ''}
          placeholder={props.placeholder || 'Search chapters...'}
        />

        {props?.selectedChapter && (
          <button
            type="button"
            className="absolute inset-y-0 right-6 flex items-center rounded-r-md px-2 focus:outline-none"
            onClick={handleClear}
          >
            <span className="sr-only">Clear</span>
            <XMarkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>
        )}

        <Combobox.Button
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
        >
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {loading && (
            <div className="py-2 px-3 text-gray-500">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                Loading chapters...
              </div>
            </div>
          )}

          {!loading && chapters.length === 0 && query && (
            <div className="py-2 px-3 text-gray-500">No chapters found.</div>
          )}

          {!loading && chapters.length === 0 && !query && (
            <div className="py-2 px-3 text-gray-500">Start typing to search chapters...</div>
          )}

            {chapters.map((chapter) => (
              <Combobox.Option
                key={chapter.id}
                value={chapter}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex flex-col">
                      <span className={clsx('truncate', selected && 'font-semibold')}>
                        {chapter.name}
                      </span>
                      {(chapter.city || chapter.state) && (
                        <span className={clsx('text-sm truncate', active ? 'text-indigo-200' : 'text-gray-500')}>
                          {[chapter.city, chapter.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>

                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}
