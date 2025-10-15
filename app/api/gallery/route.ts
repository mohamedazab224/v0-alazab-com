import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const categories = ["commercial", "construction", "cuate", "live_edge", "maintenance", "residential", "shops"]

export async function GET() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const allImages: Array<{ name: string; url: string; category: string }> = []

    console.log("[v0] Attempting to list from az_gallery root")
    const { data: rootData, error: rootError } = await supabase.storage.from("az_gallery").list("", {
      limit: 10,
    })

    if (rootError) {
      console.error("[v0] Error listing root:", rootError)
    } else {
      console.log(
        "[v0] Root folders/files:",
        rootData?.map((f) => f.name),
      )
    }

    console.log("[v0] Attempting to list from images folder")
    const { data: imagesData, error: imagesError } = await supabase.storage.from("az_gallery").list("images", {
      limit: 10,
    })

    if (imagesError) {
      console.error("[v0] Error listing images folder:", imagesError)
    } else {
      console.log(
        "[v0] Images folder contents:",
        imagesData?.map((f) => f.name),
      )
    }

    // Load images from each category folder
    for (const category of categories) {
      console.log(`[v0] Listing files in images/${category}`)

      const { data, error } = await supabase.storage.from("az_gallery").list(`images/${category}`, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      })

      if (error) {
        console.error(`[v0] Error loading ${category}:`, error)
        continue
      }

      if (data) {
        console.log(`[v0] Found ${data.length} files in ${category}`)
        console.log(
          `[v0] Files in ${category}:`,
          data.map((f) => f.name),
        )

        const categoryImages = data
          .filter((file) => {
            const ext = file.name.toLowerCase()
            return (
              ext.endsWith(".jpg") ||
              ext.endsWith(".jpeg") ||
              ext.endsWith(".png") ||
              ext.endsWith(".webp") ||
              ext.endsWith(".gif")
            )
          })
          .map((file) => ({
            name: file.name,
            url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/az_gallery/images/${category}/${file.name}`,
            category: category,
          }))

        allImages.push(...categoryImages)
      }
    }

    console.log(`[v0] Total images loaded: ${allImages.length}`)

    return NextResponse.json({ images: allImages, success: true })
  } catch (error) {
    console.error("[v0] Error in gallery API:", error)
    return NextResponse.json(
      {
        error: "Failed to load gallery images",
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
