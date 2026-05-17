import { Link } from 'react-router'
import { useEffect, useState, type ReactNode } from 'react'

interface RelationFieldWrapperProps {
  readonly children?: ReactNode
  readonly relationType?: string
  readonly initialValue?: string
  readonly fieldName?: string
  readonly basePath?: string
}

// Convert PascalCase to kebab-case for URLs (CourseChapter -> course-chapter)
const toKebabCase = (str: string): string => {
  return str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between lowercase and uppercase
    .toLowerCase() // Convert to lowercase
}

export function RelationFieldWrapper({
  children,
  relationType,
  initialValue,
  fieldName,
  basePath = '/admin/data',
}: RelationFieldWrapperProps) {
  const [currentValue, setCurrentValue] = useState(initialValue || '')

  // Monitor the select field for changes
  useEffect(() => {
    // Set initial value if it exists and currentValue is empty
    if (initialValue && !currentValue) {
      setCurrentValue(initialValue)
    }

    if (fieldName) {
      // Find the select element and attach event listener
      const selectElement = document.querySelector<HTMLSelectElement>(`[name="${fieldName}"]`)

      // Set initial value if needed
      if (selectElement?.value && selectElement.value !== currentValue) {
        setCurrentValue(selectElement.value)
      }

      if (selectElement) {
        const handleChange = (event: Event) => {
          const target = event.target as HTMLSelectElement
          if (target.value !== currentValue) {
            setCurrentValue(target.value)
          }
        }

        selectElement.addEventListener('change', handleChange)
        return () => {
          selectElement.removeEventListener('change', handleChange)
        }
      }
    }
  }, [fieldName, currentValue, initialValue])

  // Only show the view link if we have a relation type and value
  const showViewLink = !!(relationType && currentValue && currentValue !== '')

  return (
    <div className="relative">
      {children}
      {showViewLink && (
        <div className="mt-1">
          <Link
            to={`${basePath}/${toKebabCase(relationType)}/${currentValue}`}
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
          >
            <svg
              className="h-3 w-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View {relationType} record
          </Link>
        </div>
      )}
    </div>
  )
}
