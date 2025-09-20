import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: maintenanceRequest, error } = await supabase
      .from("maintenance_requests")
      .select("*")
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(maintenanceRequest)
  } catch (error) {
    console.error("Error fetching maintenance request:", error)
    return NextResponse.json({ error: "Failed to fetch maintenance request" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { notes, ...updateData } = body

    // Update the maintenance request
    const { data: updatedRequest, error: updateError } = await supabase
      .from("maintenance_requests")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    // If status changed, add to history
    if (updateData.status) {
      const { data: currentRequest } = await supabase
        .from("maintenance_requests")
        .select("status")
        .eq("id", params.id)
        .single()

      if (currentRequest && currentRequest.status !== updateData.status) {
        await supabase.from("maintenance_status_history").insert({
          request_id: params.id,
          old_status: currentRequest.status,
          new_status: updateData.status,
          notes: notes || `Status changed to ${updateData.status}`,
          changed_by: "Admin", // In real app, get from auth
          changed_at: new Date().toISOString(),
        })

        // Send email notification (implement email service)
        // await sendStatusUpdateEmail(updatedRequest, updateData.status)
      }
    }

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating maintenance request:", error)
    return NextResponse.json({ error: "Failed to update maintenance request" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("maintenance_requests").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting maintenance request:", error)
    return NextResponse.json({ error: "Failed to delete maintenance request" }, { status: 500 })
  }
}
