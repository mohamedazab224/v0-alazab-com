"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  ar: {
    // Navbar
    home: "الرئيسية",
    apps: "التطبيقات",
    about: "من نحن",
    contact: "اتصل بنا",
    services: "الخدمات",
    projects: "المشاريع",
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",

    // Hero
    welcomeTitle: "مرحباً بك في مركز تطبيقات العزب",
    welcomeSubtitle: "نظام تخطيط موارد المؤسسة المتكاملة",
    heroDescription:
      "الوصول السريع إلى جميع التطبيقات التي تستخدمها يومياً. إدارة المشاريع والصيانة وأدوات تتبع العمل والخدمات.",
    getStarted: "ابدأ الآن",

    // Apps Section
    allAppsTitle: "كل ما تحتاجه لإدارة أعمالك هنا، بنقرة واحدة فقط",
    allAppsSubtitle: "أخبرنا وسنضيفه!",

    // App Categories
    management: "الإدارة",
    employees: "الموظفين",
    clients: "العملاء",

    // App Names
    erp: "نظام تخطيط موارد المؤسسة",
    crm: "إدارة علاقات العملاء",
    helpdesk: "خدمة العملاء",
    hr: "الموارد البشرية",
    gameplan: "إدارة المشاريع",
    webshop: "المتجر الإلكتروني",
    payments: "المدفوعات",
    newsletter: "النشرات البريدية",
    studio: "الاستوديو",
    builder: "منشئ المواقع",
    insights: "التقارير والتحليلات",

    // Gallery/Portfolio
    portfolio: "معرض الأعمال",
    portfolioTitle: "معرض أعمالنا",
    portfolioSubtitle: "استكشف مشاريعنا المتميزة عبر مختلف القطاعات",
    allProjects: "جميع المشاريع",
    commercial: "تجاري",
    construction: "إنشاءات",
    cuate: "كيوت",
    liveEdge: "لايف إيدج",
    maintenance: "صيانة",
    residential: "سكني",
    shops: "محلات تجارية",
    viewProject: "عرض المشروع",
    loadingGallery: "جاري تحميل المعرض...",
    noImages: "لا توجد صور في هذه الفئة",
    errorLoading: "حدث خطأ أثناء تحميل الصور",

    // Projects Page
    projectsTitle: "المشاريع",
    projectsSubtitle: "استكشف مشاريعنا المتميزة عبر مختلف القطاعات",
    allCategories: "جميع الفئات",
    industrial: "صناعي",
    infrastructure: "بنية تحتية",
    renovation: "تجديد",
    months: "شهر",
    viewDetails: "عرض التفاصيل",
    featured: "مميز",

    // Project Details
    projectDetails: "تفاصيل المشروع",
    projectOverview: "نظرة عامة على المشروع",
    challengesAndSolutions: "التحديات والحلول",
    technicalSpecs: "المواصفات الفنية",
    duration: "المدة",
    budget: "الميزانية",
    client: "العميل",
    location: "الموقع",
    area: "المساحة",
    floorsCount: "عدد الطوابق",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    status: "الحالة",
    sqm: "متر مربع",
    planning: "التخطيط",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    onHold: "متوقف مؤقتاً",
    projectGallery: "معرض المشروع",
    backToProjects: "العودة للمشاريع",

    // Footer
    companyName: "العزب للخدمات المعمارية",
    companyDescription: "شريكك الموثوق للحلول الإنشائية المبتكرة. نبني التميز ونقدم الجودة منذ عام 2000.",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات الاتصال",
    allRightsReserved: "جميع الحقوق محفوظة",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    addressText: "القاهرة الجديدة، مصر",
  },
  en: {
    // Navbar
    home: "Home",
    apps: "Apps",
    about: "About",
    contact: "Contact",
    services: "Services",
    projects: "Projects",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",

    // Hero
    welcomeTitle: "Welcome to Al-Azab Apps Hub",
    welcomeSubtitle: "Professional ERP Solutions",
    heroDescription:
      "Quick access to what you use daily. Projects & Maintenance, Tools to track your work and services, Dashboards, Real-time reports and analytics.",
    getStarted: "Get Started",

    // Apps Section
    allAppsTitle: "Everything you need to manage your business is here, just one click away",
    allAppsSubtitle: "Let us know and we'll add it!",

    // App Categories
    management: "Management",
    employees: "Employees",
    clients: "Clients",

    // App Names
    erp: "Enterprise Resource Planning",
    crm: "Customer Relationship Management",
    helpdesk: "Help Desk & Support",
    hr: "Human Resources",
    gameplan: "Project Management",
    webshop: "Web Shop",
    payments: "Payments",
    newsletter: "Newsletter",
    studio: "Studio",
    builder: "Website Builder",
    insights: "Insights & Analytics",

    // Gallery/Portfolio
    portfolio: "Portfolio",
    portfolioTitle: "Our Portfolio",
    portfolioSubtitle: "Explore our distinguished projects across various sectors",
    allProjects: "All Projects",
    commercial: "Commercial",
    construction: "Construction",
    cuate: "Cuate",
    liveEdge: "Live Edge",
    maintenance: "Maintenance",
    residential: "Residential",
    shops: "Shops",
    viewProject: "View Project",
    loadingGallery: "Loading gallery...",
    noImages: "No images in this category",
    errorLoading: "Error loading images",

    // Projects Page
    projectsTitle: "Projects",
    projectsSubtitle: "Explore our distinguished projects across various sectors",
    allCategories: "All Categories",
    industrial: "Industrial",
    infrastructure: "Infrastructure",
    renovation: "Renovation",
    months: "months",
    viewDetails: "View Details",
    featured: "Featured",

    // Project Details
    projectDetails: "Project Details",
    projectOverview: "Project Overview",
    challengesAndSolutions: "Challenges and Solutions",
    technicalSpecs: "Technical Specifications",
    duration: "Duration",
    budget: "Budget",
    client: "Client",
    location: "Location",
    area: "Area",
    floorsCount: "Floors",
    startDate: "Start Date",
    endDate: "End Date",
    status: "Status",
    sqm: "sqm",
    planning: "Planning",
    inProgress: "In Progress",
    completed: "Completed",
    onHold: "On Hold",
    projectGallery: "Project Gallery",
    backToProjects: "Back to Projects",

    // Footer
    companyName: "Al-Azab Construction Services",
    companyDescription:
      "Your trusted partner for innovative construction solutions. Building excellence and delivering quality since 2000.",
    quickLinks: "Quick Links",
    contactInfo: "Contact Information",
    allRightsReserved: "All rights reserved",
    phone: "Phone",
    email: "Email",
    address: "Address",
    addressText: "New Cairo, Egypt",
  },
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    // Load saved language preference
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguage(savedLang)
    }
  }, [])

  useEffect(() => {
    // Save language preference and update document direction
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
