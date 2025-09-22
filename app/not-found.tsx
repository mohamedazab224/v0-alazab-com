"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Phone } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
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
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-8">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">404</h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {language === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                {language === "ar"
                  ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر."
                  : "Sorry, the page you're looking for doesn't exist or has been moved to another location."}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Home className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-8 py-3 text-lg font-semibold bg-transparent">
                  <Phone className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {language === "ar" ? "تواصل معنا" : "Contact Us"}
                </Button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {language === "ar" ? "أو جرب هذه الروابط المفيدة:" : "Or try these helpful links:"}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/services" className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors">
                  {language === "ar" ? "خدماتنا" : "Our Services"}
                </Link>
                <Link href="/projects" className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors">
                  {language === "ar" ? "مشاريعنا" : "Our Projects"}
                </Link>
                <Link href="/about" className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors">
                  {language === "ar" ? "من نحن" : "About Us"}
                </Link>
                <Link href="/admin" className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline transition-colors">
                  {language === "ar" ? "لوحة التحكم" : "Admin Panel"}
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="mt-8">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {language === "ar" ? "شركة العزب للإنشاءات" : "Al-Azab Construction Company"}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
