"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/loading-states"
import { AlertTriangle } from "lucide-react"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fadeIn?: boolean
  lazyOffset?: number
  placeholderColor?: string
  lowQualityPlaceholder?: boolean
  showLoadingSpinner?: boolean
  errorFallback?: React.ReactNode
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  className,
  fadeIn = true,
  lazyOffset = 200,
  placeholderColor = "#f3f4f6",
  lowQualityPlaceholder = false,
  showLoadingSpinner = true,
  errorFallback,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imageRef = useRef<HTMLDivElement>(null)

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (!imageRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: `${lazyOffset}px`,
      },
    )

    observer.observe(imageRef.current)

    return () => {
      observer.disconnect()
    }
  }, [lazyOffset])

  // Generate a low-quality placeholder URL if needed
  const placeholderUrl = lowQualityPlaceholder ? (typeof src === "string" ? `${src}?w=20&q=10` : undefined) : undefined

  const handleLoad = () => {
    setIsLoaded(true)
    setIsLoading(false)
    setHasError(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    setIsLoaded(false)
    onError?.()
  }

  const renderErrorFallback = () => {
    if (errorFallback) {
      return errorFallback
    }

    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="text-sm text-center">فشل في تحميل الصورة</p>
      </div>
    )
  }

  return (
    <div
      ref={imageRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundColor: placeholderColor,
      }}
    >
      {isLoading && showLoadingSpinner && (isVisible || props.priority) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <LoadingSpinner size="md" />
        </div>
      )}

      {hasError
        ? renderErrorFallback()
        : (isVisible || props.priority) && (
            <Image
              src={src || "/placeholder.svg"}
              alt={alt}
              className={cn(fadeIn && "transition-opacity duration-500", isLoaded ? "opacity-100" : "opacity-0")}
              onLoad={handleLoad}
              onError={handleError}
              placeholder={lowQualityPlaceholder ? "blur" : "empty"}
              blurDataURL={placeholderUrl}
              {...props}
            />
          )}
    </div>
  )
}
