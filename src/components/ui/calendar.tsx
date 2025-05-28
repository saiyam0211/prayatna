import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

export interface CalendarProps {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
  captionLayout?: "dropdown-buttons"
  fromYear?: number
  toYear?: number
  className?: string
}

const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  selected,
  onSelect,
  disabled,
  initialFocus,
  captionLayout,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
  className
}) => {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date())
  const [viewDate, setViewDate] = React.useState(selected || new Date())

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (disabled && disabled(newDate)) return
    setCurrentDate(newDate)
    onSelect?.(newDate)
  }

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(newDate.getMonth() + increment)
    setViewDate(newDate)
  }

  const handleYearChange = (year: number) => {
    const newDate = new Date(viewDate)
    newDate.setFullYear(year)
    setViewDate(newDate)
  }

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(monthIndex)
    setViewDate(newDate)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate)
    const firstDay = getFirstDayOfMonth(viewDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      const isSelected = selected && 
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      const isDisabled = disabled && disabled(date)

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isDisabled}
          className={cn(
            "h-9 w-9 text-sm font-normal rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
            isSelected && "bg-blue-600 text-white hover:bg-blue-700",
            isDisabled && "text-gray-300 cursor-not-allowed hover:bg-transparent"
          )}
        >
          {day}
        </button>
      )
    }

    // Force 42 cells (6 weeks) to ensure all days are visible
    while (days.length < 42) {
      days.push(<div key={`trailing-${days.length}`} className="h-9 w-9" />)
    }

    return days
  }

  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i)

  return (
    <div className={cn("p-3 bg-white border rounded-lg shadow-lg w-[280px]", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleMonthChange(-1)}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          {captionLayout === "dropdown-buttons" ? (
            <>
              <select
                value={viewDate.getMonth()}
                onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              
              <select
                value={viewDate.getFullYear()}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <h2 className="text-sm font-semibold">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h2>
          )}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleMonthChange(1)}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-9 w-9 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  )
}

export { Calendar } 