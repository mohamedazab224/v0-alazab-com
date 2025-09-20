"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Clock, CheckCircle, AlertTriangle, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { MaintenanceDashboard } from "@/components/maintenance-dashboard"

interface MaintenanceRequest {
  id: string
  referenceNumber: string
  clientName: string
  phone: string
  email: string
  address: string
  type: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  description: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  createdAt: string
  scheduledDate: string
  assignedTo?: string
}

export default function AdminMaintenancePage() {
  const { language, t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  // Mock data - في التطبيق الحقيقي سيتم جلب البيانات من قاعدة البيانات
  const [requests] = useState<MaintenanceRequest[]>([
    {
      id: "1",
      referenceNumber: "MR-123456",
      clientName: "أحمد محمد علي",
      phone: "+20 100 123 4567",
      email: "ahmed@example.com",
      address: "شارع النيل، المعادي، القاهرة",
      type: "emergency",
      priority: "urgent",
      category: "electrical",
      description: "انقطاع في التيار الكهربائي في الطابق الثاني",
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      scheduledDate: "2024-01-16T09:00:00Z",
    },
    {
      id: "2",
      referenceNumber: "MR-123457",
      clientName: "فاطمة حسن",
      phone: "+20 101 234 5678",
      email: "fatima@example.com",
      address: "شارع التحرير، وسط البلد، القاهرة",
      type: "routine",
      priority: "medium",
      category: "plumbing",
      description: "تسريب في أنابيب المياه في المطبخ",
      status: "in-progress",
      createdAt: "2024-01-14T14:20:00Z",
      scheduledDate: "2024-01-17T11:00:00Z",
      assignedTo: "محمد أحمد - فني السباكة",
    },
    {
      id: "3",
      referenceNumber: "MR-123458",
      clientName: "خالد عبدالله",
      phone: "+20 102 345 6789",
      email: "khaled@example.com",
      address: "شارع الهرم، الجيزة",
      type: "repair",
      priority: "high",
      category: "structural",
      description: "شقوق في الجدار الخارجي للمبنى",
      status: "completed",
      createdAt: "2024-01-12T09:15:00Z",
      scheduledDate: "2024-01-15T08:00:00Z",
      assignedTo: "علي محمود - مهندس إنشائي",
    },
  ])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <Settings className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "ar" ? "إدارة الصيانات" : "Maintenance Management"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {language === "ar" ? "إدارة ومتابعة طلبات الصيانة" : "Manage and track maintenance requests"}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                {language === "ar" ? "تصدير" : "Export"}
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2">
                <Plus className="h-4 w-4" />
                {language === "ar" ? "طلب جديد" : "New Request"}
              </Button>
            </div>
          </div>
        </motion.div>

        <MaintenanceDashboard />
      </div>
    </div>
  )
}
