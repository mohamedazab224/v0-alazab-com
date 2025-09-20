"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Wrench,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

interface MaintenanceRequest {
  id: string
  reference_number: string
  client_name: string
  client_phone: string
  client_email: string
  client_address: string
  maintenance_type: string
  priority: string
  category: string
  description: string
  preferred_date: string
  preferred_time: string
  contact_person: string
  contact_phone: string
  access_notes: string
  status: string
  assigned_technician?: string
  estimated_cost?: number
  actual_cost?: number
  created_at: string
  updated_at: string
  scheduled_at?: string
  completed_at?: string
  maintenance_status_history: Array<{
    old_status: string
    new_status: string
    notes: string
    changed_by: string
    changed_at: string
  }>
}

export default function TrackRequestPage() {
  const { language, t } = useLanguage()
  const searchParams = useSearchParams()
  const [referenceNumber, setReferenceNumber] = useState(searchParams.get("ref") || "")
  const [request, setRequest] = useState<MaintenanceRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const ref = searchParams.get("ref")
    if (ref) {
      setReferenceNumber(ref)
      searchRequest(ref)
    }
  }, [searchParams])

  const searchRequest = async (ref?: string) => {
    const searchRef = ref || referenceNumber
    if (!searchRef.trim()) {
      setError(language === "ar" ? "يرجى إدخال رقم الطلب" : "Please enter reference number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/maintenance?ref=${encodeURIComponent(searchRef)}`)
      const data = await response.json()

      if (data.success) {
        setRequest(data.request)
      } else {
        setError(data.error || (language === "ar" ? "لم يتم العثور على الطلب" : "Request not found"))
        setRequest(null)
      }
    } catch (err) {
      setError(language === "ar" ? "حدث خطأ في البحث" : "Search error occurred")
      setRequest(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-purple-100 text-purple-800"
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getStatusArabic = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "قيد المراجعة",
      confirmed: "مؤكد",
      assigned: "تم التكليف",
      in_progress: "قيد التنفيذ",
      completed: "مكتمل",
      cancelled: "ملغي",
    }
    return statuses[status] || status
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Search className="h-4 w-4" />
            {language === "ar" ? "تتبع طلب الصيانة" : "Track Maintenance Request"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === "ar" ? "تتبع طلب الصيانة" : "Track Your Request"}
          </h1>
          <p className="text-gray-600">
            {language === "ar"
              ? "أدخل رقم الطلب لمتابعة حالة طلب الصيانة الخاص بك"
              : "Enter your reference number to track your maintenance request"}
          </p>
        </motion.div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder={language === "ar" ? "رقم الطلب (مثال: MR-123456)" : "Reference Number (e.g., MR-123456)"}
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchRequest()}
                />
              </div>
              <Button onClick={() => searchRequest()} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Search className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {language === "ar" ? "بحث" : "Search"}
              </Button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Request Details */}
        {request && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {language === "ar" ? "حالة الطلب" : "Request Status"}
                  </CardTitle>
                  <Badge className={getStatusColor(request.status)}>
                    {language === "ar" ? getStatusArabic(request.status) : request.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{request.reference_number}</div>
                    <div className="text-sm text-gray-600">{language === "ar" ? "رقم الطلب" : "Reference Number"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {new Date(request.created_at).toLocaleDateString("ar-EG")}
                    </div>
                    <div className="text-sm text-gray-600">{language === "ar" ? "تاريخ الطلب" : "Request Date"}</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getPriorityColor(request.priority)}>
                      {language === "ar"
                        ? { urgent: "عاجل", high: "عالي", medium: "متوسط", low: "منخفض" }[request.priority] ||
                          request.priority
                        : request.priority}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">{language === "ar" ? "الأولوية" : "Priority"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {language === "ar" ? "معلومات العميل" : "Client Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{request.client_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{request.client_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{request.client_email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span className="text-sm">{request.client_address}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    {language === "ar" ? "تفاصيل الصيانة" : "Maintenance Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{language === "ar" ? "النوع:" : "Type:"}</span>
                    <span className="ml-2 font-medium">
                      {language === "ar"
                        ? {
                            emergency: "طارئة",
                            routine: "دورية",
                            repair: "إصلاح",
                            renovation: "تجديد",
                            inspection: "فحص",
                          }[request.maintenance_type] || request.maintenance_type
                        : request.maintenance_type}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{language === "ar" ? "الفئة:" : "Category:"}</span>
                    <span className="ml-2 font-medium">
                      {language === "ar"
                        ? {
                            structural: "إنشائي",
                            electrical: "كهربائي",
                            plumbing: "سباكة",
                            hvac: "تكييف",
                            finishing: "تشطيبات",
                            other: "أخرى",
                          }[request.category] || request.category
                        : request.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {language === "ar" ? "التاريخ المفضل:" : "Preferred Date:"} {request.preferred_date}
                    </span>
                  </div>
                  {request.assigned_technician && (
                    <div>
                      <span className="text-sm text-gray-600">
                        {language === "ar" ? "الفني المكلف:" : "Assigned Technician:"}
                      </span>
                      <span className="ml-2 font-medium">{request.assigned_technician}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === "ar" ? "وصف المشكلة" : "Problem Description"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{request.description}</p>
              </CardContent>
            </Card>

            {/* Status History */}
            {request.maintenance_status_history && request.maintenance_status_history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {language === "ar" ? "تاريخ الحالة" : "Status History"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {request.maintenance_status_history.map((history, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getStatusColor(history.new_status)}>
                              {language === "ar" ? getStatusArabic(history.new_status) : history.new_status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(history.changed_at).toLocaleString("ar-EG")}
                            </span>
                          </div>
                          {history.notes && <p className="text-sm text-gray-600">{history.notes}</p>}
                          <p className="text-xs text-gray-500 mt-1">
                            {language === "ar" ? "بواسطة:" : "By:"} {history.changed_by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-800">
                    {language === "ar" ? "للحالات الطارئة" : "For Emergencies"}
                  </h3>
                </div>
                <p className="text-red-700 text-sm">
                  {language === "ar"
                    ? "في حالة الطوارئ، اتصل على: 201004006620+"
                    : "For emergencies, call: +201004006620"}
                </p>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="text-center">
              <Link href="/">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="h-4 w-4" />
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
