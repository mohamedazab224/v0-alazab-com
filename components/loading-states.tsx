"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Loader2, Building, Hammer } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return <Loader2 className={cn("animate-spin text-yellow-600", sizeClasses[size], className)} />
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="mb-4"
        >
          <Building className="h-12 w-12 text-yellow-600 mx-auto" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
        >
          جاري التحميل...
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="h-1 bg-yellow-600 rounded-full max-w-xs mx-auto"
        />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn("h-4 bg-gray-200 dark:bg-gray-700 rounded", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function LoadingButton({ isLoading, children, className, disabled, onClick }: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200",
        "bg-yellow-600 hover:bg-yellow-700 text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

export function ConstructionLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Hammer className="h-8 w-8 text-yellow-600" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 1,
          }}
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
        />
      </div>
    </div>
  )
}
