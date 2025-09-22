"use client"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Phone, Mail, User, Search, Filter, Eye, Edit } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

interface MaintenanceRequest {
  id: string
  request_number?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  service_type?: string
  priority?: string
  status?: string
  description?: string
  address?: string
  preferred_date?: string
  preferred_time?: string
  created_at?: string
  technician_name?: string
  estimated_cost?: number
}

const ar = {
  title: "إدارة طلبات الصيانة",
  subtitle: "عرض وإدارة جميع طلبات الصيانة",
  newRequest: "طلب جديد",
  search: "ابحث...",
  status: "الحالة",
  allStatus: "كل الحالات",
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
  priority: "الأولوية",
  allPriorities: "كل الأولويات",
  urgent: "عاجلة",
  high: "مرتفعة",
  medium: "متوسطة",
  low: "منخفضة",
  requests: "طلبات",
  noData: "لا توجد طلبات صيانة.",
  number: "رقم الطلب",
  customer: "العميل",
  service: "الخدمة",
  created: "تاريخ الإنشاء",
  actions: "إجراءات",
  view: "عرض",
  edit: "تعديل",
}
const en = {
  title: "Maintenance Requests Management",
  subtitle: "View and manage all maintenance requests",
  newRequest: "New Request",
  search: "Search...",
  status: "Status",
  allStatus: "All Status",
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  priority: "Priority",
  allPriorities: "All Priorities",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  requests: "requests",
  noData: "No maintenance requests found.",
  number: "Request No.",
  customer: "Customer",
  service: "Service",
  created: "Created",
  actions: "Actions",
  view: "View",
  edit: "Edit",
}

export default function MaintenanceRequestsPage() {
  const { language } = useLanguage()
  const t = useMemo(() => (language === "ar" ? ar : en), [language])
  const dir = language === "ar" ? "rtl" : "ltr"

  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all")
  const [priorityFilter, setPriorityFilter] = useState<"all" | string>("all")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/maintenance/requests?limit=100", { cache: "no-store" })
        const json = await res.json()
        setRequests(Array.isArray(json?.items) ? json.items : [])
      } catch (e) {
        console.error("Error fetching requests:", e)
        setRequests([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-green-100 text-green-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filtered = requests.filter((r) => {
    const q = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !q ||
      (r.customer_name || "").toLowerCase().includes(q) ||
      (r.request_number || "").toLowerCase().includes(q) ||
      (r.customer_phone || "").includes(q)
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>
        <Link href="/admin/maintenance/requests/new">
          <Button className="bg-yellow-500 hover:bg-yellow-600">{t.newRequest}</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute h-4 w-4 top-1/2 -translate-y-1/2 ltr:left-3 rtl:right-3 text-gray-400" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ltr:pl-10 rtl:pr-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatus}</SelectItem>
                <SelectItem value="pending">{t.pending}</SelectItem>
                <SelectItem value="in_progress">{t.in_progress}</SelectItem>
                <SelectItem value="completed">{t.completed}</SelectItem>
                <SelectItem value="cancelled">{t.cancelled}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v)}>
              <SelectTrigger>
                <SelectValue placeholder={t.priority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allPriorities}</SelectItem>
                <SelectItem value="urgent">{t.urgent}</SelectItem>
                <SelectItem value="high">{t.high}</SelectItem>
                <SelectItem value="medium">{t.medium}</SelectItem>
                <SelectItem value="low">{t.low}</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {filtered.length} {t.requests}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">{t.noData}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  {t.number}: {r.request_number || r.id}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(r.status)}>{(t as any)[r.status as keyof typeof t] || r.status || "-"}</Badge>
                  <Badge className={getPriorityColor(r.priority)}>{(t as any)[r.priority as keyof typeof t] || r.priority || "-"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{r.customer_name || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{r.customer_email || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span dir="ltr">{r.customer_phone || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="truncate">{r.address || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {r.preferred_date ? r.preferred_date : r.created_at?.slice(0, 10) || "-"}{" "}
                    {r.preferred_time ? `• ${r.preferred_time}` : ""}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Link href={`/admin/maintenance/requests/${r.id}`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {t.view}
                    </Button>
                  </Link>
                  <Link href={`/admin/maintenance/requests/${r.id}/edit`}>
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      {t.edit}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
