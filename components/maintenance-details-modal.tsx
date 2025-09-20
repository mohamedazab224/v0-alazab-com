"use client"

import { useState } from "react"
import { User, Phone, Mail, MapPin, Calendar, Settings, MessageSquare, DollarSign, UserCheck, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"

interface MaintenanceRequest {
  id: string
  reference_number: string
  client_name: string
  client_phone: string
  client_email: string
  client_address: string
  maintenance_type: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  description: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  created_at: string
  scheduled_at: string
  assigned_technician?: string
  estimated_cost?: number
  actual_cost?: number
}

interface MaintenanceDetailsModalProps {
  request: MaintenanceRequest
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedRequest: MaintenanceRequest) => void
}

export function MaintenanceDetailsModal({ request, isOpen, onClose, onUpdate }: MaintenanceDetailsModalProps) {
  const { language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedRequest, setEditedRequest] = useState(request)
  const [notes, setNotes] = useState("")

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/maintenance/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedRequest,
          notes: notes.trim() || undefined,
        }),
      })

      if (response.ok) {
        const updatedRequest = await response.json()
        onUpdate(updatedRequest)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to update request:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    const updatedRequest = { ...editedRequest, status: newStatus as any }
    setEditedRequest(updatedRequest)

    // Auto-save status changes
    try {
      const response = await fetch(`/api/maintenance/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: `Status changed to ${newStatus}`,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onUpdate(result)
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {language === "ar" ? "تفاصيل طلب الصيانة" : "Maintenance Request Details"}
            <Badge variant="outline" className="ml-2">
              {request.reference_number}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>{language === "ar" ? "الحالة:" : "Status:"}</Label>
              <Select value={editedRequest.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{language === "ar" ? "في الانتظار" : "Pending"}</SelectItem>
                  <SelectItem value="in-progress">{language === "ar" ? "قيد التنفيذ" : "In Progress"}</SelectItem>
                  <SelectItem value="completed">{language === "ar" ? "مكتملة" : "Completed"}</SelectItem>
                  <SelectItem value="cancelled">{language === "ar" ? "ملغية" : "Cancelled"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge className={getPriorityColor(request.priority)}>
              {language === "ar"
                ? request.priority === "urgent"
                  ? "عاجل"
                  : request.priority === "high"
                    ? "عالي"
                    : request.priority === "medium"
                      ? "متوسط"
                      : "منخفض"
                : request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
            </Badge>

            <div className="ml-auto">
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                {isEditing ? (language === "ar" ? "إلغاء" : "Cancel") : language === "ar" ? "تعديل" : "Edit"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {language === "ar" ? "معلومات العميل" : "Client Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{request.client_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{request.client_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{request.client_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>{new Date(request.created_at).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <span>{request.client_address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {language === "ar" ? "تفاصيل الطلب" : "Request Details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">{language === "ar" ? "النوع" : "Type"}</Label>
                  <p className="font-medium">{request.maintenance_type}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">{language === "ar" ? "الفئة" : "Category"}</Label>
                  <p className="font-medium">{request.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">
                    {language === "ar" ? "الموعد المجدول" : "Scheduled Date"}
                  </Label>
                  <p className="font-medium">{new Date(request.scheduled_at).toLocaleDateString("ar-EG")}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">{language === "ar" ? "الوصف" : "Description"}</Label>
                <p className="mt-1 p-3 bg-gray-50 rounded-lg">{request.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Assignment and Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                {language === "ar" ? "التكليف والتكاليف" : "Assignment & Costs"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="technician">{language === "ar" ? "الفني المكلف" : "Assigned Technician"}</Label>
                    <Input
                      id="technician"
                      value={editedRequest.assigned_technician || ""}
                      onChange={(e) => setEditedRequest((prev) => ({ ...prev, assigned_technician: e.target.value }))}
                      placeholder={language === "ar" ? "اسم الفني" : "Technician name"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimated">{language === "ar" ? "التكلفة المقدرة" : "Estimated Cost"}</Label>
                    <Input
                      id="estimated"
                      type="number"
                      value={editedRequest.estimated_cost || ""}
                      onChange={(e) =>
                        setEditedRequest((prev) => ({
                          ...prev,
                          estimated_cost: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="actual">{language === "ar" ? "التكلفة الفعلية" : "Actual Cost"}</Label>
                    <Input
                      id="actual"
                      type="number"
                      value={editedRequest.actual_cost || ""}
                      onChange={(e) =>
                        setEditedRequest((prev) => ({ ...prev, actual_cost: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">
                      {language === "ar" ? "الفني المكلف" : "Assigned Technician"}
                    </Label>
                    <p className="font-medium">
                      {request.assigned_technician || (language === "ar" ? "غير محدد" : "Not assigned")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      {language === "ar" ? "التكلفة المقدرة" : "Estimated Cost"}
                    </Label>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {request.estimated_cost || (language === "ar" ? "غير محدد" : "Not set")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">
                      {language === "ar" ? "التكلفة الفعلية" : "Actual Cost"}
                    </Label>
                    <p className="font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {request.actual_cost || (language === "ar" ? "غير محدد" : "Not set")}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {language === "ar" ? "ملاحظات" : "Notes"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === "ar" ? "إضافة ملاحظات..." : "Add notes..."}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              {language === "ar" ? "إغلاق" : "Close"}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? (language === "ar" ? "جاري الحفظ..." : "Saving...") : language === "ar" ? "حفظ" : "Save"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
