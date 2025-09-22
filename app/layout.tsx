import type React from "react"
import ClientLayout from "./client-layout"
import { LanguageProvider } from '@/components/language-context'
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
