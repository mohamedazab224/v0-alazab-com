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

export const dynamic = "force-dynamic"

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
            {t('Maintenance Requests Management')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('View and manage all maintenance requests')}
          </p>
        </div>
        <Link href="/admin/maintenance/requests/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            {t('New Request')}
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
                placeholder={t('Search...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('Status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Status')}</SelectItem>
                <SelectItem value="pending">{t('Pending')}</SelectItem>
                <SelectItem value="in_progress">{t('In Progress')}</SelectItem>
                <SelectItem value="completed">{t('Completed')}</SelectItem>
                <SelectItem value="cancelled">{t('Cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('Priority')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('All Priorities')}</SelectItem>
                <SelectItem value="urgent">{t('Urgent')}</SelectItem>
                <SelectItem value="high">{t('High')}</SelectItem>
                <SelectItem value="medium">{t('Medium')}</SelectItem>
                <SelectItem value="low">{t('Low')}</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {filteredRequests.length} {t('requests')}
            </div>
          </div>
        </CardContent>
      </Card>

            {/* ... باقي الكود مع استبدال النصوص بـ t() */}

      {filteredRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {t('No maintenance requests found')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
