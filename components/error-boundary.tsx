"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Error caught:", error, errorInfo)
    this.setState({ error, errorInfo })

    // Log error to monitoring service
    if (typeof window !== "undefined") {
      // You can integrate with error monitoring services like Sentry here
      console.error("Error logged:", { error, errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">حدث خطأ غير متوقع</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                نعتذر، حدث خطأ أثناء تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة تحميل الصفحة
              </Button>

              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  العودة للرئيسية
                </Button>
              </Link>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple error fallback component
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">حدث خطأ</h3>
      </div>
      <p className="text-red-700 dark:text-red-300 mb-4">{error.message || "حدث خطأ غير متوقع"}</p>
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCw className="h-4 w-4 mr-2" />
        المحاولة مرة أخرى
      </Button>
    </div>
  )
}
