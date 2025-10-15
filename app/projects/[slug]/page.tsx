import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectDetailClient } from "./project-detail-client"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: project } = await supabase.from("projects").select("*").eq("slug", params.slug).single()

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title_ar} | Al-Azab Construction`,
    description: project.description_ar,
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: project, error } = await supabase.from("projects").select("*").eq("slug", params.slug).single()

  if (error || !project) {
    console.error("[v0] Error fetching project:", error)
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
