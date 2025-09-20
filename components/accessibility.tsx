"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-yellow-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
    >
      {children}
    </a>
  )
}

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
}

export function FocusTrap({ children, isActive }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener("keydown", handleTabKey)
    }
  }, [isActive])

  return <div ref={containerRef}>{children}</div>
}

interface AnnouncementProps {
  message: string
  priority?: "polite" | "assertive"
}

export function LiveAnnouncement({ message, priority = "polite" }: AnnouncementProps) {
  return (
    <div aria-live={priority} aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  className?: string
}

export function AccessibleProgressBar({ value, max = 100, label, className }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progress: ${percentage}%`}
        className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
      >
        <div
          className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onEscape?.()
          break
        case "Enter":
          onEnter?.()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onEscape, onEnter])
}

interface VisuallyHiddenProps {
  children: React.ReactNode
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="sr-only">{children}</span>
}
