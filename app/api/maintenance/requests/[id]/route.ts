import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestData = await sql`
      SELECT 
        mr.*,
        t.name as technician_name,
        t.phone as technician_phone,
        t.email as technician_email,
        t.specialization as technician_specialization
      FROM maintenance_requests mr
      LEFT JOIN technicians t ON mr.assigned_technician_id = t.id
      WHERE mr.id = ${params.id}
    `

    if (requestData.length === 0) {
      return NextResponse.json({ error: "Maintenance request not found" }, { status: 404 })
    }

    return NextResponse.json(requestData[0])
  } catch (error) {
    console.error("Error fetching maintenance request:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance request" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, admin_notes, estimated_cost, final_cost, assigned_technician_id } = body

    // Get current request to check for status change
    const currentRequest = await sql`
      SELECT status FROM maintenance_requests WHERE id = ${params.id}
    `

    if (currentRequest.length === 0) {
      return NextResponse.json({ error: "Maintenance request not found" }, { status: 404 })
    }

    const oldStatus = currentRequest[0].status

    // Update the request
    const updatedRequest = await sql`
      UPDATE maintenance_requests 
      SET 
        status = COALESCE(${status}, status),
        admin_notes = COALESCE(${admin_notes}, admin_notes),
        estimated_cost = COALESCE(${estimated_cost}, estimated_cost),
        final_cost = COALESCE(${final_cost}, final_cost),
        assigned_technician_id = COALESCE(${assigned_technician_id}, assigned_technician_id),
        updated_at = NOW(),
        completed_at = CASE WHEN ${status} = 'completed' THEN NOW() ELSE completed_at END
      WHERE id = ${params.id}
      RETURNING *
    `

    // If status changed, record it in history
    if (status && status !== oldStatus) {
      await sql`
        INSERT INTO maintenance_status_history (
          request_id, old_status, new_status, changed_by, notes, created_at
        ) VALUES (
          ${params.id}, ${oldStatus}, ${status}, 'admin', ${admin_notes || null}, NOW()
        )
      `

      // Create notification for status change
      const requestDetails = await sql`
        SELECT customer_email, customer_name, request_number 
        FROM maintenance_requests 
        WHERE id = ${params.id}
      `

      if (requestDetails.length > 0) {
        const { customer_email, customer_name, request_number } = requestDetails[0]

        await sql`
          INSERT INTO notifications (
            request_id, recipient_email, recipient_type, notification_type,
            title, message, created_at, is_sent
          ) VALUES (
            ${params.id}, ${customer_email}, 'customer', 'status_update',
            'تحديث حالة طلب الصيانة', 
            ${`عزيزي ${customer_name}، تم تحديث حالة طلب الصيانة رقم ${request_number} إلى: ${status}`},
            NOW(), false
          )
        `
      }
    }

    return NextResponse.json(updatedRequest[0])
  } catch (error) {
    console.error("Error updating maintenance request:", error)
    return NextResponse.json({ error: "Failed to update maintenance request" }, { status: 500 })
  }
}
