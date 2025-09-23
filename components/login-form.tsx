"use client"

import { useActionState, useEffect } from "react"
import { signIn } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, TestTube } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(signIn, null)

  useEffect(() => {
    if (state?.success) {
      router.push("/admin")
    }
  }, [state, router])

  const handleDemoLogin = () => {
    const form = document.createElement("form")
    form.style.display = "none"

    const emailInput = document.createElement("input")
    emailInput.name = "email"
    emailInput.value = "demo@al-azab.co"

    const passwordInput = document.createElement("input")
    passwordInput.name = "password"
    passwordInput.value = "demo123456"

    form.appendChild(emailInput)
    form.appendChild(passwordInput)
    document.body.appendChild(form)

    const formData = new FormData(form)

    // استخدام formAction مباشرة
    formAction(formData)

    document.body.removeChild(form)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-center">تسجيل الدخول</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400">{state.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="admin@al-azab.co"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>

          <Button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            disabled={isPending}
          >
            <TestTube className="mr-2 h-4 w-4" />
            دخول بحساب تجريبي
          </Button>

          <div className="text-center">
            <Link href="/auth/sign-up" className="text-yellow-400 hover:text-yellow-300 text-sm">
              ليس لديك حساب؟ إنشاء حساب جديد
            </Link>
          </div>

          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm font-medium mb-2">بيانات الحساب التجريبي:</p>
            <div className="text-xs text-blue-200 space-y-1">
              <p>البريد الإلكتروني: demo@al-azab.co</p>
              <p>كلمة المرور: demo123456</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
