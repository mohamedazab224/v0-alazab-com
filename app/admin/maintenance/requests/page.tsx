"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Phone, Mail, User, Search, Filter, Eye, Edit } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import Link from "next/link"

interface MaintenanceRequest {
  id: string
  request_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_type: string
  priority: string
  status: string
  description: string
  address: string
  preferred_date: string
  preferred_time: string
  created_at: string
  technician_name?: string
  estimated_cost?: number
}

export default function MaintenanceRequestsPage() {
  const { language, t } = useLanguage()
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/maintenance/requests")
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.customer_phone.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === "ar" ? "إدارة طلبات الصيانة" : "Maintenance Requests Management"}
          </h1>
          <p className="text-gray-600 mt-2">
            {language === "ar" ? "عرض وإدارة جميع طلبات الصيانة" : "View and manage all maintenance requests"}
          </p>
        </div>
        <Link href="/admin/maintenance/requests/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            {language === "ar" ? "طلب جديد" : "New Request"}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={language === "ar" ? "البحث..." : "Search..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "الحالة" : "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
                <SelectItem value="pending">{language === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
                <SelectItem value="in_progress">{language === "ar" ? "قيد التنفيذ" : "In Progress"}</SelectItem>
                <SelectItem value="completed">{language === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                <SelectItem value="cancelled">{language === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={language === "ar" ? "الأولوية" : "Priority"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "ar" ? "جميع الأولويات" : "All Priorities"}</SelectItem>
                <SelectItem value="urgent">{language === "ar" ? "عاجل" : "Urgent"}</SelectItem>
                <SelectItem value="high">{language === "ar" ? "عالي" : "High"}</SelectItem>
                <SelectItem value="medium">{language === "ar" ? "متوسط" : "Medium"}</SelectItem>
                <SelectItem value="low">{language === "ar" ? "منخفض" : "Low"}</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {filteredRequests.length} {language === "ar" ? "طلب" : "requests"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{request.request_number}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(request.created_at).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(request.status)}>
                    {language === "ar"
                      ? request.status === "pending"
                        ? "قيد الانتظار"
                        : request.status === "in_progress"
                          ? "قيد التنفيذ"
                          : request.status === "completed"
                            ? "مكتمل"
                            : "ملغي"
                      : request.status.replace("_", " ")}
                  </Badge>
                  <Badge className={getPriorityColor(request.priority)}>
                    {language === "ar"
                      ? request.priority === "urgent"
                        ? "عاجل"
                        : request.priority === "high"
                          ? "عالي"
                          : request.priority === "medium"
                            ? "متوسط"
                            : "منخفض"
                      : request.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{request.customer_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{request.customer_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{request.customer_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm line-clamp-1">{request.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {request.preferred_date} - {request.preferred_time}
                </span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
              </div>
              {request.technician_name && (
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">{language === "ar" ? "الفني المخصص:" : "Assigned Technician:"}</span>{" "}
                    {request.technician_name}
                  </p>
                </div>
              )}
              {request.estimated_cost && (
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">{language === "ar" ? "التكلفة المقدرة:" : "Estimated Cost:"}</span> $
                    {request.estimated_cost}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Link href={`/admin/maintenance/requests/${request.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    {language === "ar" ? "عرض" : "View"}
                  </Button>
                </Link>
                <Link href={`/admin/maintenance/requests/${request.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    {language === "ar" ? "تعديل" : "Edit"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === "ar" ? "لا توجد طلبات صيانة" : "No maintenance requests found"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
