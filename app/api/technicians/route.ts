import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const technicians = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        specialization,
        status,
        current_location_lat,
        current_location_lng
      FROM technicians
      ORDER BY name
    `

    return NextResponse.json({ technicians })
  } catch (error) {
    console.error("خطأ في جلب الفنيين:", error)
    return NextResponse.json({ error: "خطأ في جلب الفنيين" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, specialization } = await request.json()

    const [technician] = await sql`
      INSERT INTO technicians (name, email, phone, specialization)
      VALUES (${name}, ${email}, ${phone}, ${specialization})
      RETURNING *
    `

    return NextResponse.json({ technician })
  } catch (error) {
    console.error("خطأ في إضافة الفني:", error)
    return NextResponse.json({ error: "خطأ في إضافة الفني" }, { status: 500 })
  }
}
