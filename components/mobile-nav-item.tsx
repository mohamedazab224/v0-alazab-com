"use client"

import Link from "next/link"
import { motion } from "framer-motion"

// Mobile Nav Item
export function MobileNavItem({
  href,
  label,
  isActive,
  onClick,
  delay = 0,
}: {
  href: string
  label: string
  isActive: boolean
  onClick: () => void
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay,
      }}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(245, 158, 11, 0.05)" }}
      className="overflow-hidden rounded-lg"
    >
      <Link
        href={href}
        className={`text-base sm:text-lg font-medium block text-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 ${
          isActive ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : ""
        }`}
        onClick={onClick}
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="inline-block"
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  )
}

// Mobile Sub Nav Item
export function MobileSubNavItem({
  href,
  label,
  isActive,
  onClick,
}: {
  href: string
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{
        scale: 1.02,
        backgroundColor: "rgba(245, 158, 11, 0.05)",
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      className="overflow-hidden rounded-lg"
    >
      <Link
        href={href}
        className={`block text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg transition-all duration-300 text-center ${
          isActive ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : ""
        }`}
        onClick={onClick}
      >
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="inline-block"
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  )
}
