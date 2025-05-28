import * as React from "react"
import { cn } from "@/lib/utils"

export interface PopoverProps {
  children: React.ReactNode
}

export interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export interface PopoverContentProps {
  className?: string
  align?: "start" | "center" | "end"
  children: React.ReactNode
}

const PopoverContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

const Popover: React.FC<PopoverProps> = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative">{children}</div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({ asChild, children }) => {
  const { open, setOpen } = React.useContext(PopoverContext)

  const handleClick = () => {
    setOpen(!open)
  }

  if (asChild) {
    return (
      <div onClick={handleClick}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  )
}

const PopoverContent: React.FC<PopoverContentProps> = ({ 
  className, 
  align = "center", 
  children 
}) => {
  const { open, setOpen } = React.useContext(PopoverContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 transform -translate-x-1/2",
    end: "right-0"
  }

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute top-full mt-2 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        alignmentClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent } 