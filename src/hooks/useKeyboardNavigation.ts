import { useEffect } from 'react'

export const useKeyboardNavigation = (
  onNext: () => void,
  dependencies: any[] = [],
  excludeTextareas: boolean = false
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement
        
        // Skip if the target is a textarea and excludeTextareas is true
        if (excludeTextareas && target.tagName === 'TEXTAREA') {
          return
        }
        
        // Skip if the target is a button (to avoid double-triggering)
        if (target.tagName === 'BUTTON') {
          return
        }
        
        // Skip if user is in a select dropdown
        if (target.tagName === 'SELECT') {
          return
        }
        
        event.preventDefault()
        onNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onNext, ...dependencies, excludeTextareas])
} 