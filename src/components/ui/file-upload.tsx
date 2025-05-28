import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

export interface FileUploadProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label = "Upload file", onChange, ...props }, ref) => {
    const handleClick = () => {
      const input = ref as React.RefObject<HTMLInputElement>
      input.current?.click()
    }

    return (
      <div className="space-y-2">
        <input
          type="file"
          ref={ref}
          onChange={onChange}
          className="hidden"
          {...props}
        />
        <div
          onClick={handleClick}
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors",
            className
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{label}</span>
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
          </div>
        </div>
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload } 