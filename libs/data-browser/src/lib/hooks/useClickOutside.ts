import React, { useEffect } from 'react'

// Custom hook for click outside detection
export function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void,
  isActive = true,
) {
  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handler, isActive]) // Removed 'ref' from dependency array as refs are stable
}
