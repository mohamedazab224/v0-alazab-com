import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const images = await sql`
      SELECT * FROM maintenance_images 
      WHERE request_id = ${params.id}
      ORDER BY created_at ASC
    `

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching maintenance images:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance images" }, { status: 500 })
  }
}
