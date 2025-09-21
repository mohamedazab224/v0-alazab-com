import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const history = await sql`
      SELECT * FROM maintenance_status_history 
      WHERE request_id = ${params.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json(history)
  } catch (error) {
    console.error("Error fetching status history:", error)
    return NextResponse.json({ error: "Failed to fetch status history" }, { status: 500 })
  }
}
