import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface LoadingAnimationProps {
  title?: string
  description?: string
  variant?: "blue" | "green" | "purple"
  className?: string
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  title = "Loading...",
  description = "Please wait",
  variant = "blue",
  className
}) => {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600", 
    purple: "text-purple-600"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className={cn("mx-auto mb-4 h-12 w-12 border-4 border-gray-200 border-t-current rounded-full", colors[variant])}
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  )
}

export { LoadingAnimation } 