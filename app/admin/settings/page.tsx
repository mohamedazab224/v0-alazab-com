"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { User, Bell, Shield, Palette, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SettingsPage() {
  const { t, language } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          router.push("/auth/login")
          return
        }

        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [router, supabase.auth])

  const handleSave = async () => {
    setSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            {language === "ar" ? "العودة للوحة التحكم" : "Back to Dashboard"}
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {language === "ar" ? "الإعدادات" : "Settings"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {language === "ar" ? "إدارة إعدادات حسابك" : "Manage your account settings"}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">{language === "ar" ? "الملف الشخصي" : "Profile"}</TabsTrigger>
          <TabsTrigger value="notifications">{language === "ar" ? "الإشعارات" : "Notifications"}</TabsTrigger>
          <TabsTrigger value="security">{language === "ar" ? "الأمان" : "Security"}</TabsTrigger>
          <TabsTrigger value="preferences">{language === "ar" ? "التفضيلات" : "Preferences"}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {language === "ar" ? "معلومات الملف الشخصي" : "Profile Information"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "تحديث معلومات ملفك الشخصي" : "Update your profile information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-yellow-500 text-white text-2xl">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    {language === "ar" ? "تغيير الصورة" : "Change Photo"}
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    {language === "ar" ? "JPG, GIF أو PNG. حد أقصى 1MB" : "JPG, GIF or PNG. Max size 1MB"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{language === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
                  <Input
                    id="fullName"
                    defaultValue={user?.user_metadata?.full_name || ""}
                    placeholder={language === "ar" ? "أدخل الاسم الكامل" : "Enter full name"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={language === "ar" ? "أدخل رقم الهاتف" : "Enter phone number"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">{language === "ar" ? "المنصب" : "Position"}</Label>
                  <Input id="position" placeholder={language === "ar" ? "أدخل المنصب" : "Enter position"} />
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="bg-yellow-500 hover:bg-yellow-600">
                {saving
                  ? language === "ar"
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : language === "ar"
                    ? "حفظ التغييرات"
                    : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {language === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "إدارة تفضيلات الإشعارات" : "Manage your notification preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "ar" ? "إشعارات البريد الإلكتروني" : "Email Notifications"}</Label>
                    <p className="text-sm text-gray-500">
                      {language === "ar" ? "تلقي تحديثات عبر البريد الإلكتروني" : "Receive email updates"}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "ar" ? "تحديثات المشاريع" : "Project Updates"}</Label>
                    <p className="text-sm text-gray-500">
                      {language === "ar" ? "إشعار بتغييرات المشاريع" : "Notify about project changes"}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "ar" ? "تنبيهات الصيانة" : "Maintenance Alerts"}</Label>
                    <p className="text-sm text-gray-500">
                      {language === "ar" ? "إشعارات الصيانة العاجلة" : "Urgent maintenance notifications"}
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {language === "ar" ? "إعدادات الأمان" : "Security Settings"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "إدارة أمان حسابك" : "Manage your account security"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>{language === "ar" ? "تغيير كلمة المرور" : "Change Password"}</Label>
                  <Button variant="outline" className="mt-2 bg-transparent">
                    {language === "ar" ? "تحديث كلمة المرور" : "Update Password"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}</Label>
                    <p className="text-sm text-gray-500">
                      {language === "ar" ? "تفعيل المصادقة الثنائية" : "Enable two-factor authentication"}
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {language === "ar" ? "التفضيلات" : "Preferences"}
              </CardTitle>
              <CardDescription>{language === "ar" ? "تخصيص تجربتك" : "Customize your experience"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>{language === "ar" ? "اللغة" : "Language"}</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    {language === "ar" ? "اللغة الحالية: العربية" : "Current language: English"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "ar" ? "الوضع الليلي" : "Dark Mode"}</Label>
                    <p className="text-sm text-gray-500">
                      {language === "ar" ? "تفعيل المظهر الليلي" : "Enable dark theme"}
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
