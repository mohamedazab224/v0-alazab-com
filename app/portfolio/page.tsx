"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n-context"
import { X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface GalleryImage {
  name: string
  url: string
  category: string
}

const categories = [
  { id: "all", labelAr: "جميع المشاريع", labelEn: "All Projects" },
  { id: "commercial", labelAr: "تجاري", labelEn: "Commercial" },
  { id: "construction", labelAr: "إنشاءات", labelEn: "Construction" },
  { id: "cuate", labelAr: "كيوت", labelEn: "Cuate" },
  { id: "live_edge", labelAr: "لايف إيدج", labelEn: "Live Edge" },
  { id: "maintenance", labelAr: "صيانة", labelEn: "Maintenance" },
  { id: "residential", labelAr: "سكني", labelEn: "Residential" },
  { id: "shops", labelAr: "محلات تجارية", labelEn: "Shops" },
]

export default function PortfolioPage() {
  const { language, t } = useI18n()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory))
    }
  }, [selectedCategory, images])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching gallery images from API")
      const response = await fetch("/api/gallery")

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] API error:", errorData)
        throw new Error(errorData.details || "Failed to load images")
      }

      const data = await response.json()
      console.log("[v0] Received images:", data.images?.length || 0)

      if (data.success && data.images && data.images.length > 0) {
        setImages(data.images)
        setFilteredImages(data.images)
      } else {
        // Use demo images as fallback
        const demoImages: GalleryImage[] = [
          // Commercial
          { name: "commercial-1", url: "/modern-apartment-building.png", category: "commercial" },
          { name: "commercial-2", url: "/modern-commercial-building.png", category: "commercial" },
          { name: "commercial-3", url: "/construction-site.png", category: "commercial" },
          // Construction
          { name: "construction-1", url: "/construction-site.png", category: "construction" },
          { name: "construction-2", url: "/modern-commercial-building.png", category: "construction" },
          { name: "construction-3", url: "/modern-apartment-building.png", category: "construction" },
          // Residential
          { name: "residential-1", url: "/modern-villa-exterior.png", category: "residential" },
          { name: "residential-2", url: "/modern-apartment-building.png", category: "residential" },
          { name: "residential-3", url: "/modern-commercial-building.png", category: "residential" },
          // Cuate
          { name: "cuate-1", url: "/modern-villa-exterior.png", category: "cuate" },
          { name: "cuate-2", url: "/construction-site.png", category: "cuate" },
          // Live Edge
          { name: "live-edge-1", url: "/modern-commercial-building.png", category: "live_edge" },
          { name: "live-edge-2", url: "/modern-villa-exterior.png", category: "live_edge" },
          // Maintenance
          { name: "maintenance-1", url: "/construction-site.png", category: "maintenance" },
          { name: "maintenance-2", url: "/modern-apartment-building.png", category: "maintenance" },
          // Shops
          { name: "shops-1", url: "/modern-commercial-building.png", category: "shops" },
          { name: "shops-2", url: "/modern-apartment-building.png", category: "shops" },
        ]
        console.log("[v0] Using demo images as fallback")
        setImages(demoImages)
        setFilteredImages(demoImages)
      }
    } catch (err) {
      console.error("[v0] Error loading gallery:", err)
      const demoImages: GalleryImage[] = [
        { name: "commercial-1", url: "/modern-apartment-building.png", category: "commercial" },
        { name: "commercial-2", url: "/modern-commercial-building.png", category: "commercial" },
        { name: "construction-1", url: "/construction-site.png", category: "construction" },
        { name: "residential-1", url: "/modern-villa-exterior.png", category: "residential" },
        { name: "residential-2", url: "/modern-apartment-building.png", category: "residential" },
        { name: "shops-1", url: "/modern-commercial-building.png", category: "shops" },
      ]
      console.log("[v0] Using demo images due to error")
      setImages(demoImages)
      setFilteredImages(demoImages)
      setError(null) // Clear error since we have fallback data
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">{t("portfolioTitle")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              {t("portfolioSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {language === "ar" ? category.labelAr : category.labelEn}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">{error}</p>
              <Button onClick={loadImages} className="mt-4">
                {language === "ar" ? "إعادة المحاولة" : "Retry"}
              </Button>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t("noImages")}</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={`${image.category}-${image.name}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
