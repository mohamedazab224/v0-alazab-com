"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, DollarSign, User, Ruler, Building2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n-context"

interface Project {
  id: string
  slug: string
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: string
  location_ar: string
  location_en: string
  duration_months: number
  budget?: number
  client_ar?: string
  client_en?: string
  featured: boolean
  status: string
  start_date?: string
  end_date?: string
  area_sqm?: number
  floors?: number
  specifications?: any
  challenges?: any
  solutions?: any
  main_image?: string
  gallery_images?: string[]
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const { language, t } = useI18n()
  const [selectedImage, setSelectedImage] = useState(0)

  const title = language === "ar" ? project.title_ar : project.title_en
  const description = language === "ar" ? project.description_ar : project.description_en
  const location = language === "ar" ? project.location_ar : project.location_en
  const client = language === "ar" ? project.client_ar : project.client_en

  const images =
    project.gallery_images && project.gallery_images.length > 0
      ? project.gallery_images
      : project.main_image
        ? [project.main_image]
        : ["/placeholder.svg?height=600&width=800"]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section with Image Gallery */}
      <section className="relative bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/projects">
            <Button variant="ghost" className="mb-6 hover:text-orange-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProjects")}
            </Button>
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={images[selectedImage] || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {project.featured && (
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-white">{t("featured")}</Badge>
                )}
              </motion.div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-orange-500 scale-105"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${title} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div>
              <Badge variant="outline" className="border-orange-500 text-orange-500 mb-4">
                {t(project.category)}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

              <p className="text-lg text-muted-foreground mb-6">{description}</p>

              {/* Key Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("location")}</p>
                      <p className="font-semibold">{location}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("duration")}</p>
                      <p className="font-semibold">
                        {project.duration_months} {t("months")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {project.budget && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("budget")}</p>
                        <p className="font-semibold">${project.budget.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {client && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <User className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("client")}</p>
                        <p className="font-semibold">{client}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {project.area_sqm && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Ruler className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("area")}</p>
                        <p className="font-semibold">
                          {project.area_sqm.toLocaleString()} {t("sqm")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {project.floors && (
                  <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("floorsCount")}</p>
                        <p className="font-semibold">{project.floors}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">{t("status")}:</span>
                <Badge variant="outline" className="border-green-500 text-green-500">
                  {t(project.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      {(project.specifications || project.challenges) && (
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {project.specifications && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("technicalSpecs")}</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        {typeof project.specifications === "string" ? (
                          <p>{project.specifications}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(project.specifications, null, 2)}</pre>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {project.challenges && (
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">{t("challengesAndSolutions")}</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="prose dark:prose-invert max-w-none">
                        {typeof project.challenges === "string" ? (
                          <p>{project.challenges}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap">{JSON.stringify(project.challenges, null, 2)}</pre>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
