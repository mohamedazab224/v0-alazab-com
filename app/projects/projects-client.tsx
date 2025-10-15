"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  featured: boolean
  main_image?: string
  status: string
}

interface ProjectsClientProps {
  projects: Project[]
}

const categories = ["all", "residential", "commercial", "industrial", "infrastructure", "renovation"]

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const { language, t } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  const getCategoryLabel = (category: string) => {
    if (category === "all") return t("allCategories")
    return t(category)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
        <div className="absolute inset-0 bg-[url('/construction-site.png')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">{t("projectsTitle")}</h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-xl sm:max-w-2xl">
              {t("projectsSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
                }
              >
                {getCategoryLabel(category)}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">{t("noImages")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} language={language} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ProjectCard({
  project,
  index,
  language,
  t,
}: {
  project: Project
  index: number
  language: string
  t: (key: string) => string
}) {
  const title = language === "ar" ? project.title_ar : project.title_en
  const description = language === "ar" ? project.description_ar : project.description_en
  const location = language === "ar" ? project.location_ar : project.location_en

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={project.main_image || "/placeholder.svg?height=400&width=600"}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {project.featured && <Badge className="absolute top-4 right-4 bg-orange-500 text-white">{t("featured")}</Badge>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="border-orange-500 text-orange-500">
            {t(project.category)}
          </Badge>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">{title}</h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>
              {project.duration_months} {t("months")}
            </span>
          </div>
        </div>

        <Link href={`/projects/${project.slug}`}>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {t("viewDetails")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
