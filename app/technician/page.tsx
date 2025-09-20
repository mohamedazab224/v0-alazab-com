"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GoogleMaps } from "@/components/google-maps"
import { MapPin, Phone, Clock, CheckCircle, AlertCircle, Navigation } from "lucide-react"

interface MaintenanceRequest {
  id: string
  request_number: string
  client_name: string
  client_phone: string
  service_type: string
  description: string
  status: string
  priority: string
  location_address: string
  location_lat: number
  location_lng: number
  created_at: string
  estimated_duration: string
}

export default function TechnicianApp() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [technicianLocation, setTechnicianLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    fetchAssignedRequests()
    getCurrentLocation()
  }, [])

  const fetchAssignedRequests = async () => {
    try {
      // محاكاة بيانات الطلبات المخصصة للفني
      const mockRequests: MaintenanceRequest[] = [
        {
          id: "1",
          request_number: "MR-756343",
          client_name: "أحمد محمد",
          client_phone: "01234567890",
          service_type: "إصلاح كهرباء",
          description: "مشكلة في الإضاءة الرئيسية",
          status: "assigned",
          priority: "high",
          location_address: "شارع التحرير، وسط البلد، القاهرة",
          location_lat: 30.0444,
          location_lng: 31.2357,
          created_at: new Date().toISOString(),
          estimated_duration: "2 ساعة",
        },
        {
          id: "2",
          request_number: "MR-756344",
          client_name: "فاطمة علي",
          client_phone: "01234567891",
          service_type: "صيانة تكييف",
          description: "تكييف لا يعمل بكفاءة",
          status: "in_progress",
          priority: "medium",
          location_address: "مدينة نصر، القاهرة",
          location_lat: 30.0626,
          location_lng: 31.3219,
          created_at: new Date().toISOString(),
          estimated_duration: "3 ساعات",
        },
      ]

      setRequests(mockRequests)
      setLoading(false)
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error)
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTechnicianLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error("خطأ في تحديد الموقع:", error),
      )
    }
  }

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      // محاكاة تحديث الحالة
      setRequests((prev) => prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req)))

      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (error) {
      console.error("خطأ في تحديث الحالة:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "assigned":
        return "مخصص"
      case "in_progress":
        return "قيد التنفيذ"
      case "completed":
        return "مكتمل"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const openInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, "_blank")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>جاري تحميل المهام...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">مهام الصيانة</h1>
          <p className="text-sm text-gray-600">{requests.length} مهمة مخصصة لك</p>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {!selectedRequest ? (
          /* قائمة المهام */
          <div className="p-4 space-y-4">
            {requests.map((request) => (
              <Card
                key={request.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedRequest(request)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{request.request_number}</CardTitle>
                    <Badge className={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getPriorityColor(request.priority)}>
                      {request.priority === "high" ? "عاجل" : request.priority === "medium" ? "متوسط" : "عادي"}
                    </Badge>
                    <span className="text-sm text-gray-500">{request.service_type}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{request.client_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 line-clamp-1">{request.location_address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{request.estimated_duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* تفاصيل المهمة */
          <div className="p-4 space-y-4">
            {/* زر العودة */}
            <Button variant="ghost" onClick={() => setSelectedRequest(null)} className="mb-4">
              ← العودة للقائمة
            </Button>

            {/* معلومات المهمة */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedRequest.request_number}</CardTitle>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusText(selectedRequest.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">معلومات العميل</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>الاسم:</strong> {selectedRequest.client_name}
                    </p>
                    <p>
                      <strong>الهاتف:</strong> {selectedRequest.client_phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">تفاصيل المهمة</h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>نوع الخدمة:</strong> {selectedRequest.service_type}
                    </p>
                    <p>
                      <strong>الوصف:</strong> {selectedRequest.description}
                    </p>
                    <p>
                      <strong>المدة المتوقعة:</strong> {selectedRequest.estimated_duration}
                    </p>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedRequest.client_phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    اتصال
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openInMaps(selectedRequest.location_lat, selectedRequest.location_lng)}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    التوجه
                  </Button>
                </div>

                {/* أزرار تحديث الحالة */}
                <div className="space-y-2">
                  {selectedRequest.status === "assigned" && (
                    <Button className="w-full" onClick={() => updateRequestStatus(selectedRequest.id, "in_progress")}>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      بدء العمل
                    </Button>
                  )}

                  {selectedRequest.status === "in_progress" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => updateRequestStatus(selectedRequest.id, "completed")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      إنهاء المهمة
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* الخريطة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الموقع</CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleMaps
                  initialLocation={{
                    lat: selectedRequest.location_lat,
                    lng: selectedRequest.location_lng,
                  }}
                  height="300px"
                  showSearch={false}
                  markers={[
                    {
                      lat: selectedRequest.location_lat,
                      lng: selectedRequest.location_lng,
                      title: selectedRequest.client_name,
                      info: selectedRequest.location_address,
                    },
                    ...(technicianLocation
                      ? [
                          {
                            lat: technicianLocation.lat,
                            lng: technicianLocation.lng,
                            title: "موقعك الحالي",
                            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          },
                        ]
                      : []),
                  ]}
                />
                <p className="text-sm text-gray-600 mt-2">{selectedRequest.location_address}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
