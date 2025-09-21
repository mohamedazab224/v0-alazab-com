import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        mr.*,
        t.name as technician_name,
        t.phone as technician_phone,
        t.specialization as technician_specialization
      FROM maintenance_requests mr
      LEFT JOIN technicians t ON mr.assigned_technician_id = t.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      query += ` AND mr.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (priority && priority !== "all") {
      query += ` AND mr.priority = $${paramIndex}`
      params.push(priority)
      paramIndex++
    }

    query += ` ORDER BY mr.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const requests = await sql(query, params)

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Error fetching maintenance requests:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance requests" }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      Allow: "GET, OPTIONS",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
