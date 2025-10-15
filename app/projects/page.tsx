import { createClient } from "@/lib/supabase/server"
import { ProjectsClient } from "./projects-client"

export const metadata = {
  title: "المشاريع | Al-Azab Construction",
  description:
    "استكشف مشاريعنا المتميزة عبر مختلف القطاعات - Explore our distinguished projects across various sectors",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching projects:", error)
  }

  return <ProjectsClient projects={projects || []} />
}
