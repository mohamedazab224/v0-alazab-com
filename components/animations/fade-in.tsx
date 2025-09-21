"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
  threshold?: number
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 20,
  once = true,
  threshold = 0.1,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion()

  const getDirectionOffset = () => {
    if (prefersReducedMotion) return { opacity: 1, x: 0, y: 0 }

    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0 }
      case "down":
        return { opacity: 0, y: -distance, x: 0 }
      case "left":
        return { opacity: 0, x: distance, y: 0 }
      case "right":
        return { opacity: 0, x: -distance, y: 0 }
      default:
        return { opacity: 0, x: 0, y: 0 }
    }
  }

  const variants = {
    hidden: getDirectionOffset(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: "easeOut",
      },
    },
  }

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, threshold }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
