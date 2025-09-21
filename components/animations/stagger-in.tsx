"use client"

import React from "react"

import { motion } from "framer-motion"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StaggerInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  distance?: number
  once?: boolean
  threshold?: number
}

export function StaggerIn({
  children,
  className,
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.5,
  direction = "up",
  distance = 20,
  once = true,
  threshold = 0.1,
}: StaggerInProps) {
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

  const containerVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: prefersReducedMotion ? 0 : delay,
      },
    },
  }

  const itemVariants = {
    hidden: getDirectionOffset(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
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
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
