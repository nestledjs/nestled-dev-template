import { Link } from 'react-router'
import { EyeIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

interface RelationFieldWrapperProps {
  readonly children?: React.ReactNode
  readonly relationType?: string
  readonly initialValue?: string
  readonly fieldName?: string
}

// Convert PascalCase to kebab-case for URLs (CourseChapter -> course-chapter)
const toKebabCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert dash between lowercase and uppercase
    .toLowerCase() // Convert to lowercase
}

export function RelationFieldWrapper({ 
  children, 
  relationType, 
  initialValue,
  fieldName 
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
            to={`/admin/data/${toKebabCase(relationType)}/${currentValue}`}
            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
          >
            <EyeIcon className="h-3 w-3 mr-1" />
            View {relationType} record
          </Link>
        </div>
      )}
    </div>
  )
}