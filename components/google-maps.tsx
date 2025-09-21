"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Search } from "lucide-react"
import { google } from "google-maps"

interface GoogleMapsProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number }
  height?: string
  showSearch?: boolean
  markers?: Array<{
    lat: number
    lng: number
    title: string
    info?: string
    icon?: string
  }>
}

function GoogleMaps({
  onLocationSelect,
  initialLocation = { lat: 30.0444, lng: 31.2357 }, // القاهرة
  height = "400px",
  showSearch = true,
  markers = [],
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // تحميل Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=ar`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: initialLocation,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(mapInstance)

      // إضافة العلامات
      markers.forEach((marker) => {
        new google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstance,
          title: marker.title,
          icon: marker.icon || undefined,
        })
      })

      // إضافة مستمع للنقر على الخريطة
      if (onLocationSelect) {
        mapInstance.addListener("click", async (event: google.maps.MapMouseEvent) => {
          const lat = event.latLng?.lat()
          const lng = event.latLng?.lng()

          if (lat && lng) {
            const geocoder = new google.maps.Geocoder()
            try {
              const response = await geocoder.geocode({
                location: { lat, lng },
              })

              const address = response.results[0]?.formatted_address || `${lat}, ${lng}`
              const location = { lat, lng, address }

              setSelectedLocation(location)
              onLocationSelect(location)

              // إضافة علامة في الموقع المحدد
              new google.maps.Marker({
                position: { lat, lng },
                map: mapInstance,
                title: "الموقع المحدد",
                icon: {
                  url:
                    "data:image/svg+xml;charset=UTF-8," +
                    encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                  `),
                  scaledSize: new google.maps.Size(24, 24),
                },
              })
            } catch (error) {
              console.error("خطأ في الحصول على العنوان:", error)
            }
          }
        })
      }
    }

    loadGoogleMaps()
  }, [initialLocation, markers, onLocationSelect])

  const searchLocation = async () => {
    if (!map || !searchQuery.trim()) return

    const geocoder = new google.maps.Geocoder()
    try {
      const response = await geocoder.geocode({
        address: searchQuery,
        region: "EG", // مصر
      })

      if (response.results.length > 0) {
        const location = response.results[0].geometry.location
        const lat = location.lat()
        const lng = location.lng()

        map.setCenter({ lat, lng })
        map.setZoom(15)

        if (onLocationSelect) {
          const locationData = {
            lat,
            lng,
            address: response.results[0].formatted_address,
          }
          setSelectedLocation(locationData)
          onLocationSelect(locationData)
        }
      }
    } catch (error) {
      console.error("خطأ في البحث:", error)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        if (map) {
          map.setCenter({ lat, lng })
          map.setZoom(15)
        }

        if (onLocationSelect) {
          onLocationSelect({
            lat,
            lng,
            address: `${lat}, ${lng}`,
          })
        }
      },
      (error) => {
        console.error("خطأ في تحديد الموقع:", error)
        alert("لا يمكن تحديد موقعك الحالي")
      },
    )
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="ابحث عن موقع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchLocation()}
              className="pr-10"
            />
          </div>
          <Button onClick={searchLocation} variant="outline">
            <Search className="w-4 h-4" />
          </Button>
          <Button onClick={getCurrentLocation} variant="outline">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg border" />

      {selectedLocation && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">الموقع المحدد:</p>
              <p className="text-sm text-gray-600">{selectedLocation.address}</p>
              <p className="text-xs text-gray-500">
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { GoogleMaps }
export default GoogleMaps
