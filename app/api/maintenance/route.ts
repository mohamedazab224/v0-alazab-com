import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { EmailService } from "@/lib/email-service"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Generate reference number
    const referenceNumber = `MR-${Date.now().toString().slice(-6)}`

    // Insert maintenance request into database
    const { data: maintenanceRequest, error } = await supabase
      .from("maintenance_requests")
      .insert({
        reference_number: referenceNumber,
        client_name: formData.name,
        client_phone: formData.phone,
        client_email: formData.email,
        client_address: formData.address,
        maintenance_type: formData.type,
        priority: formData.priority,
        category: formData.category,
        description: formData.description,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        contact_person: formData.contactPerson,
        contact_phone: formData.contactPhone,
        access_notes: formData.accessNotes,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json({ success: false, error: "Failed to save request" }, { status: 500 })
    }

    // Send confirmation emails
    const emailService = EmailService.getInstance()
    const emailSent = await emailService.sendMaintenanceRequestConfirmation({
      referenceNumber,
      clientName: formData.name,
      clientEmail: formData.email,
      maintenanceType: formData.type,
      priority: formData.priority,
      category: formData.category,
      description: formData.description,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
    })

    // Log status history
    await supabase.from("maintenance_status_history").insert({
      request_id: maintenanceRequest.id,
      old_status: null,
      new_status: "pending",
      notes: "طلب جديد تم إنشاؤه",
      changed_by: "system",
    })

    return NextResponse.json({
      success: true,
      referenceNumber,
      emailSent,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ref = searchParams.get("ref")

    if (!ref) {
      return NextResponse.json({ success: false, error: "Reference number is required" }, { status: 400 })
    }

    const { data: maintenanceData, error } = await supabase
      .from("maintenance_requests")
      .select(`
        *,
        maintenance_status_history (
          old_status,
          new_status,
          notes,
          changed_by,
          changed_at
        )
      `)
      .eq("reference_number", ref)
      .single()

    if (error || !maintenanceData) {
      return NextResponse.json({ success: false, error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      request: maintenanceData,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
