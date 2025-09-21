"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.projects": "مشاريعنا",
    "nav.contact": "اتصل بنا",
    "nav.maintenance": "طلب صيانة",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "تم بنجاح",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.view": "عرض",
    "common.back": "العودة",
    "common.next": "التالي",
    "common.previous": "السابق",
    "common.submit": "إرسال",
    "common.search": "بحث",
    "common.filter": "تصفية",

    // Maintenance
    "maintenance.title": "طلب صيانة",
    "maintenance.description": "وصف المشكلة",
    "maintenance.address": "العنوان",
    "maintenance.phone": "رقم الهاتف",
    "maintenance.email": "البريد الإلكتروني",
    "maintenance.name": "الاسم",
    "maintenance.service_type": "نوع الخدمة",
    "maintenance.priority": "الأولوية",
    "maintenance.preferred_date": "التاريخ المفضل",
    "maintenance.preferred_time": "الوقت المفضل",
    "maintenance.status": "الحالة",
    "maintenance.request_number": "رقم الطلب",
    "maintenance.created_at": "تاريخ الإنشاء",
    "maintenance.updated_at": "تاريخ التحديث",

    // Status
    "status.pending": "قيد الانتظار",
    "status.in_progress": "قيد التنفيذ",
    "status.completed": "مكتمل",
    "status.cancelled": "ملغي",

    // Priority
    "priority.urgent": "عاجل",
    "priority.high": "عالي",
    "priority.medium": "متوسط",
    "priority.low": "منخفض",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.maintenance": "Maintenance Request",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error occurred",
    "common.success": "Success",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.view": "View",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.search": "Search",
    "common.filter": "Filter",

    // Maintenance
    "maintenance.title": "Maintenance Request",
    "maintenance.description": "Problem Description",
    "maintenance.address": "Address",
    "maintenance.phone": "Phone Number",
    "maintenance.email": "Email",
    "maintenance.name": "Name",
    "maintenance.service_type": "Service Type",
    "maintenance.priority": "Priority",
    "maintenance.preferred_date": "Preferred Date",
    "maintenance.preferred_time": "Preferred Time",
    "maintenance.status": "Status",
    "maintenance.request_number": "Request Number",
    "maintenance.created_at": "Created At",
    "maintenance.updated_at": "Updated At",

    // Status
    "status.pending": "Pending",
    "status.in_progress": "In Progress",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",

    // Priority
    "priority.urgent": "Urgent",
    "priority.high": "High",
    "priority.medium": "Medium",
    "priority.low": "Low",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)

    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
