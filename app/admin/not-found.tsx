"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminNotFound() {
  const { language } = useLanguage()
  const isRTL = language === "ar"

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-12">
            {/* Admin Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "ar" ? "صفحة الإدارة غير موجودة" : "Admin Page Not Found"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {language === "ar"
                  ? "عذراً، صفحة الإدارة التي تبحث عنها غير موجودة أو قد تحتاج إلى صلاحيات خاصة للوصول إليها."
                  : "Sorry, the admin page you're looking for doesn't exist or you may need special permissions to access it."}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/admin">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Shield className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}
                </Button>
              </Link>

              <Link href="/">
                <Button
                  variant="outline"
                  className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-8 py-3 text-lg font-semibold bg-transparent"
                >
                  <Home className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "الرئيسية" : "Home"}
                </Button>
              </Link>
            </motion.div>

            {/* Admin Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {language === "ar" ? "أقسام الإدارة المتاحة:" : "Available admin sections:"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/admin/projects"
                  className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors"
                >
                  {language === "ar" ? "إدارة المشاريع" : "Projects"}
                </Link>
                <Link
                  href="/admin/maintenance"
                  className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors"
                >
                  {language === "ar" ? "إدارة الصيانة" : "Maintenance"}
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors"
                >
                  {language === "ar" ? "الإعدادات" : "Settings"}
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
