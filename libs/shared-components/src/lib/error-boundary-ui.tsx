import React, { useEffect, useState } from 'react'
import JSON5 from 'json5'

function findJsonBounds(str: string, braceStart: number): number {
  let braceCount = 0
  for (let i = braceStart; i < str.length; i++) {
    if (str[i] === '{') braceCount++
    if (str[i] === '}') braceCount--
    if (braceCount === 0) return i
  }
  return -1
}

function renderInvocationJson(str: string): React.ReactNode | null {
  const invocationIdx = str.indexOf('invocation:')
  if (invocationIdx === -1) return null

  const braceStart = str.indexOf('{', invocationIdx)
  if (braceStart === -1) return null

  const endIdx = findJsonBounds(str, braceStart)
  if (endIdx === -1) return null

  const before = str.slice(0, braceStart)
  const objStr = str.slice(braceStart, endIdx + 1)
  const after = str.slice(endIdx + 1)

  let parsedObj = null
  try {
    parsedObj = JSON5.parse(objStr)
  } catch {
    // ignore
  }

  return (
    <>
      <span className="font-mono text-xs text-gray-700">{before}</span>
      {parsedObj ? (
        <pre className="bg-gray-50 rounded border border-gray-200 p-3 overflow-x-auto text-left text-xs font-mono mt-2 max-h-64 whitespace-pre-wrap">
          {JSON5.stringify(parsedObj, null, 2)}
        </pre>
      ) : (
        <span className="font-mono text-xs text-gray-700">{objStr}</span>
      )}
      <span className="font-mono text-xs text-gray-700">{after}</span>
    </>
  )
}

// Helper: extract and pretty-print JSON-like substrings from a string
function renderStringWithEmbeddedJson(str: string) {
  const invocationResult = renderInvocationJson(str)
  if (invocationResult !== null) return invocationResult

  // Fallback: generic JSON block detection
  // Limit string length to prevent ReDoS attacks
  const MAX_STRING_LENGTH = 10000
  const safeStr = str.length > MAX_STRING_LENGTH ? str.slice(0, MAX_STRING_LENGTH) + '...' : str

  // Use safer regex with possessive quantifier simulation (limit backtracking)
  // Match opening bracket/brace, then up to 5000 chars (reasonable for error messages), then closing
  const jsonRegex = /([[{][\s\S]{0,5000}?[}\]])/g
  const parts: (string | object)[] = []
  let lastIndex = 0
  let match
  let iterations = 0
  const MAX_ITERATIONS = 100 // Prevent infinite loops

  while ((match = jsonRegex.exec(safeStr)) !== null && iterations < MAX_ITERATIONS) {
    iterations++
    if (match.index > lastIndex) {
      parts.push(safeStr.slice(lastIndex, match.index))
    }
    try {
      const parsed = JSON5.parse(match[0])
      parts.push(parsed)
    } catch {
      parts.push(match[0])
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < safeStr.length) {
    parts.push(safeStr.slice(lastIndex))
  }
  return (
    <>
      {parts.map(part => {
        const partKey =
          typeof part === 'string'
            ? `s-${part.slice(0, 30)}`
            : `o-${JSON.stringify(part).slice(0, 30)}`
        return typeof part === 'object' && part !== null ? (
          <pre
            key={partKey}
            className="bg-gray-50 rounded border border-gray-200 p-3 overflow-x-auto text-left text-xs font-mono mt-2 max-h-64 whitespace-pre-wrap"
          >
            {JSON5.stringify(part, null, 2)}
          </pre>
        ) : (
          <span key={partKey} className="font-mono text-xs text-gray-700">
            {String(part)}
          </span>
        )
      })}
    </>
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function renderPretty(obj: unknown): React.ReactNode {
  if (typeof obj === 'object' && obj !== null) {
    return (
      <pre className="bg-gray-50 rounded border border-gray-200 p-3 overflow-x-auto text-left text-xs font-mono mt-2 max-h-64 whitespace-pre-wrap">
        {JSON5.stringify(obj, null, 2)}
      </pre>
    )
  }
  if (typeof obj === 'string') {
    try {
      const parsed = JSON5.parse(obj)
      if (typeof parsed === 'object' && parsed !== null) {
        return (
          <pre className="bg-gray-50 rounded border border-gray-200 p-3 overflow-x-auto text-left text-xs font-mono mt-2 max-h-64 whitespace-pre-wrap">
            {JSON5.stringify(parsed, null, 2)}
          </pre>
        )
      }
    } catch {
      return renderStringWithEmbeddedJson(obj)
    }
    return <span className="font-mono text-xs text-gray-700">{obj}</span>
  }
  return <span className="font-mono text-xs text-gray-700">{String(obj)}</span>
}

function aggregateErrors(error: Error): unknown[] {
  const errorRecord: Record<string, unknown> = isRecord(error) ? error : {}
  return Array.isArray(errorRecord.errors) ? errorRecord.errors : [error]
}

function errorMessage(error: unknown): string {
  return isRecord(error) && typeof error.message === 'string' ? error.message : String(error)
}

function errorStack(error: unknown): string {
  return isRecord(error) && typeof error.stack === 'string' ? error.stack : ''
}

function errorDetailKey(error: unknown): string {
  if (!isRecord(error)) {
    return String(error)
  }

  const message = typeof error.message === 'string' ? error.message.slice(0, 40) : undefined
  const name = typeof error.name === 'string' ? error.name : undefined
  if (message ?? name) {
    return message ?? name ?? 'Error'
  }

  try {
    return JSON.stringify(error) ?? 'Error'
  } catch {
    return 'Unserializable error'
  }
}

function extraErrorEntries(error: unknown): [string, unknown][] {
  if (!isRecord(error)) {
    return []
  }

  return Object.entries(error).filter(([key]) => !['message', 'stack', 'name'].includes(key))
}

export function ErrorBoundaryUi({ error }: { readonly error: Error }) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setShowDetails(true)
  }, [])

  // Log the full error object for debugging
  console.error('Route ErrorBoundary caught:', error)

  const errors = aggregateErrors(error)

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="flex items-center mb-4">
          <svg
            className="w-7 h-7 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        </div>
        <p className="mt-2 text-gray-700 text-base">{renderPretty(error.message)}</p>
        {showDetails && (
          <div className="mt-6">
            <h2 className="font-semibold text-gray-800 mb-2">Details:</h2>
            <ul className="list-disc list-inside space-y-4">
              {errors.map(err => {
                const errKey = errorDetailKey(err)
                const stack = errorStack(err)
                return (
                  <li key={errKey} className="mb-2">
                    <div className="font-medium text-gray-900">
                      {renderPretty(errorMessage(err))}
                    </div>
                    {/* Show stack if available - always render to prevent hydration mismatch */}
                    <details className="mt-2" style={{ display: stack ? 'block' : 'none' }}>
                      <summary className="cursor-pointer text-xs text-gray-500">
                        Stack trace
                      </summary>
                      <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-left text-xs font-mono max-h-40 whitespace-pre-wrap">
                        {stack}
                      </pre>
                    </details>
                    {/* Show extra fields prettily if present */}
                    {extraErrorEntries(err).map(([key, value]) => (
                      <div key={key} className="mt-1">
                        <span className="font-mono text-xs text-gray-600">{key}:</span>
                        {renderPretty(value)}
                      </div>
                    ))}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
