"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, User, ArrowLeft, Save, MessageSquare, ImageIcon, History } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import GoogleMaps from "@/components/google-maps"

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
  location_lat?: number
  location_lng?: number
  preferred_date: string
  preferred_time: string
  created_at: string
  updated_at: string
  admin_notes?: string
  estimated_cost?: number
  final_cost?: number
  technician_name?: string
  customer_rating?: number
  customer_feedback?: string
}

interface StatusHistory {
  id: string
  old_status: string
  new_status: string
  changed_by: string
  notes?: string
  created_at: string
}

interface MaintenanceImage {
  id: string
  image_url: string
  description?: string
  image_type: string
  uploaded_by: string
  created_at: string
}

export default function MaintenanceRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [request, setRequest] = useState<MaintenanceRequest | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [images, setImages] = useState<MaintenanceImage[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchRequestDetails()
    }
  }, [params.id])

  const fetchRequestDetails = async () => {
    try {
      const [requestRes, historyRes, imagesRes] = await Promise.all([
        fetch(`/api/maintenance/requests/${params.id}`),
        fetch(`/api/maintenance/requests/${params.id}/history`),
        fetch(`/api/maintenance/requests/${params.id}/images`),
      ])

      if (requestRes.ok) {
        const requestData = await requestRes.json()
        setRequest(requestData)
        setNewStatus(requestData.status)
        setAdminNotes(requestData.admin_notes || "")
        setEstimatedCost(requestData.estimated_cost?.toString() || "")
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json()
        setStatusHistory(historyData)
      }

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json()
        setImages(imagesData)
      }
    } catch (error) {
      console.error("Error fetching request details:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequest = async () => {
    if (!request) return

    setUpdating(true)
    try {
      const response = await fetch(`/api/maintenance/requests/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNotes,
          estimated_cost: estimatedCost ? Number.parseFloat(estimatedCost) : null,
        }),
      })

      if (response.ok) {
        await fetchRequestDetails()
        // Show success message
      }
    } catch (error) {
      console.error("Error updating request:", error)
    } finally {
      setUpdating(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === "ar" ? "طلب الصيانة غير موجود" : "Maintenance request not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === "ar" ? "العودة" : "Back"}
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{request.request_number}</h1>
          <p className="text-gray-600">{language === "ar" ? "تفاصيل طلب الصيانة" : "Maintenance Request Details"}</p>
        </div>
        <div className="ml-auto">
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
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">{language === "ar" ? "التفاصيل" : "Details"}</TabsTrigger>
          <TabsTrigger value="location">{language === "ar" ? "الموقع" : "Location"}</TabsTrigger>
          <TabsTrigger value="images">{language === "ar" ? "الصور" : "Images"}</TabsTrigger>
          <TabsTrigger value="history">{language === "ar" ? "التاريخ" : "History"}</TabsTrigger>
          <TabsTrigger value="management">{language === "ar" ? "الإدارة" : "Management"}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {language === "ar" ? "معلومات العميل" : "Customer Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">{language === "ar" ? "الاسم" : "Name"}</label>
                  <p className="text-lg font-semibold">{request.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === "ar" ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <p>{request.customer_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === "ar" ? "رقم الهاتف" : "Phone"}
                  </label>
                  <p>{request.customer_phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "معلومات الخدمة" : "Service Information"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === "ar" ? "نوع الخدمة" : "Service Type"}
                  </label>
                  <p className="font-semibold">{request.service_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === "ar" ? "الأولوية" : "Priority"}
                  </label>
                  <Badge
                    className={`${
                      request.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : request.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : request.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
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
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {language === "ar" ? "التاريخ المفضل" : "Preferred Date"}
                  </label>
                  <p>
                    {request.preferred_date} - {request.preferred_time}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "وصف المشكلة" : "Problem Description"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{request.description}</p>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === "ar" ? "العنوان" : "Address"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{request.address}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {language === "ar" ? "موقع الخدمة" : "Service Location"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.location_lat && request.location_lng ? (
                <GoogleMaps
                  center={{
                    lat: request.location_lat,
                    lng: request.location_lng,
                  }}
                  markers={[
                    {
                      lat: request.location_lat,
                      lng: request.location_lng,
                      title: request.customer_name,
                      description: request.address,
                    },
                  ]}
                  height="400px"
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {language === "ar" ? "لم يتم تحديد الموقع على الخريطة" : "Location not specified on map"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {language === "ar" ? "صور الطلب" : "Request Images"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="space-y-2">
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.description || "Maintenance image"}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      {image.description && <p className="text-sm text-gray-600">{image.description}</p>}
                      <p className="text-xs text-gray-500">
                        {language === "ar" ? "رفع بواسطة:" : "Uploaded by:"} {image.uploaded_by}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {language === "ar" ? "لا توجد صور مرفقة" : "No images attached"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {language === "ar" ? "تاريخ الحالات" : "Status History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statusHistory.length > 0 ? (
                <div className="space-y-4">
                  {statusHistory.map((history) => (
                    <div key={history.id} className="border-l-4 border-orange-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {language === "ar" ? "تغيير الحالة من" : "Status changed from"}
                            <Badge className={getStatusColor(history.old_status)} variant="outline">
                              {history.old_status}
                            </Badge>
                            {language === "ar" ? " إلى " : " to "}
                            <Badge className={getStatusColor(history.new_status)}>{history.new_status}</Badge>
                          </p>
                          <p className="text-sm text-gray-600">
                            {language === "ar" ? "بواسطة:" : "By:"} {history.changed_by}
                          </p>
                          {history.notes && <p className="text-sm text-gray-700 mt-1">{history.notes}</p>}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(history.created_at).toLocaleString(language === "ar" ? "ar-SA" : "en-US")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  {language === "ar" ? "لا يوجد تاريخ للحالات" : "No status history available"}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {language === "ar" ? "إدارة الطلب" : "Request Management"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {language === "ar" ? "تحديث الحالة" : "Update Status"}
                  </label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{language === "ar" ? "قيد الانتظار" : "Pending"}</SelectItem>
                      <SelectItem value="in_progress">{language === "ar" ? "قيد التنفيذ" : "In Progress"}</SelectItem>
                      <SelectItem value="completed">{language === "ar" ? "مكتمل" : "Completed"}</SelectItem>
                      <SelectItem value="cancelled">{language === "ar" ? "ملغي" : "Cancelled"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {language === "ar" ? "التكلفة المقدرة" : "Estimated Cost"}
                  </label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={language === "ar" ? "أدخل التكلفة المقدرة" : "Enter estimated cost"}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {language === "ar" ? "ملاحظات الإدارة" : "Admin Notes"}
                  </label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder={language === "ar" ? "أضف ملاحظات إدارية..." : "Add admin notes..."}
                    rows={4}
                  />
                </div>

                <Button
                  onClick={updateRequest}
                  disabled={updating}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updating
                    ? language === "ar"
                      ? "جاري الحفظ..."
                      : "Saving..."
                    : language === "ar"
                      ? "حفظ التغييرات"
                      : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
