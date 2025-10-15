import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "../styles/globals.css"
import ClientLayout from "./client-layout"

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Al-Azab Construction - نظام تخطيط موارد المؤسسة",
  description: "Al-Azab Construction ERP System - نظام تخطيط موارد المؤسسة المتكاملة",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
