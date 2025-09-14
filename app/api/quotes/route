import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { quoteRequestSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Check if quote requests are enabled
    const { data: featureFlag } = await supabase
      .from('feature_flags')
      .select('enabled')
      .eq('id', 'quote_requests')
      .single()

    if (!featureFlag?.enabled) {
      return NextResponse.json(
        { success: false, error: 'Quote request feature is not available' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = quoteRequestSchema.parse(body)

    // Verify supplier exists and accepts quotes
    const { data: supplier, error: supplierError } = await supabase
      .from('suppliers')
      .select('id, name, contact_email, accepts_quotes, commission_rate')
      .eq('id', validatedData.supplier_id)
      .eq('status', 'approved')
      .single()

    if (supplierError || !supplier) {
      return NextResponse.json(
        { success: false, error: 'Supplier not found or not available' },
        { status: 404 }
      )
    }

    if (!supplier.accepts_quotes) {
      return NextResponse.json(
        { success: false, error: 'This supplier does not accept quote requests' },
        { status: 400 }
      )
    }

    // Create quote request
    const { data: quoteRequest, error } = await supabase
      .from('quote_requests')
      .insert([{
        ...validatedData,
        status: 'new',
        source: 'quote_form'
      }])
      .select(`
        *,
        supplier:suppliers(name, contact_email, commission_rate)
      `)
      .single()

    if (error) {
      throw error
    }

    // Increment supplier contact count
    await supabase
      .from('suppliers')
      .update({ 
        contact_count: supplier.contact_count + 1 
      })
      .eq('id', validatedData.supplier_id)

    // Send notifications
    try {
      await Promise.all([
        sendQuoteNotificationToSupplier(quoteRequest),
        sendQuoteConfirmationToRequester(quoteRequest)
      ])
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError)
      // Don't fail the API call if emails fail
    }

    // Track for analytics and potential commission (Phase 2)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quote_requested', {
        supplier_id: supplier.id,
        supplier_name: supplier.name,
        service_type: validatedData.service_type,
        budget_range: validatedData.budget_range
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: quoteRequest.id,
        supplier_name: supplier.name,
        status: 'sent'
      },
      message: 'Your quote request has been sent! The supplier will contact you directly.'
    })

  } catch (error) {
    console.error('Error handling quote request:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

// Send notification to supplier
async function sendQuoteNotificationToSupplier(quoteRequest: any) {
  const emailData = {
    to: quoteRequest.supplier.contact_email,
    subject: `New Quote Request from ${quoteRequest.requester_name}`,
    html: `
      <h2>New Quote Request</h2>
      <p>You have received a new quote request through Moving Suppliers Hub.</p>
      
      <h3>Contact Details</h3>
      <p><strong>Name:</strong> ${quoteRequest.requester_name}</p>
      <p><strong>Email:</strong> ${quoteRequest.requester_email}</p>
      ${quoteRequest.company_name ? `<p><strong>Company:</strong> ${quoteRequest.company_name}</p>` : ''}
      ${quoteRequest.phone ? `<p><strong>Phone:</strong> ${quoteRequest.phone}</p>` : ''}
      
      <h3>Requirements</h3>
      ${quoteRequest.service_type ? `<p><strong>Service Type:</strong> ${quoteRequest.service_type}</p>` : ''}
      ${quoteRequest.budget_range ? `<p><strong>Budget Range:</strong> ${quoteRequest.budget_range}</p>` : ''}
      ${quoteRequest.timeline ? `<p><strong>Timeline:</strong> ${quoteRequest.timeline}</p>` : ''}
      ${quoteRequest.location ? `<p><strong>Location:</strong> ${quoteRequest.location}</p>` : ''}
      
      <p><strong>Message:</strong></p>
      <p>${quoteRequest.message.replace(/\n/g, '<br>')}</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Contact the customer directly using the details above</li>
          <li>Provide your quote and discuss their requirements</li>
          <li>Update the lead status in your supplier dashboard</li>
        </ol>
      </div>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/supplier-dashboard" 
           style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
          View in Dashboard
        </a>
      </p>
      
      <hr>
      <p><small>This lead was generated through Moving Suppliers Hub. Please respond promptly to maintain your high service rating.</small></p>
    `
  }

  // Implement your email sending logic here
  console.log('Would send supplier notification:', emailData)
}

// Send confirmation to quote requester
async function sendQuoteConfirmationToRequester(quoteRequest: any) {
  const emailData = {
    to: quoteRequest.requester_email,
    subject: `Quote Request Sent to ${quoteRequest.supplier.name}`,
    html: `
      <h2>Quote Request Confirmation</h2>
      <p>Hi ${quoteRequest.requester_name},</p>
      
      <p>Your quote request has been successfully sent to <strong>${quoteRequest.supplier.name}</strong>.</p>
      
      <h3>What Happens Next?</h3>
      <ul>
        <li>The supplier will contact you directly within 24-48 hours</li>
        <li>They'll discuss your requirements and provide a detailed quote</li>
        <li>You can ask questions and negotiate terms directly with them</li>
      </ul>
      
      <h3>Your Request Details</h3>
      ${quoteRequest.service_type ? `<p><strong>Service:</strong> ${quoteRequest.service_type}</p>` : ''}
      ${quoteRequest.budget_range ? `<p><strong>Budget:</strong> ${quoteRequest.budget_range}</p>` : ''}
      ${quoteRequest.timeline ? `<p><strong>Timeline:</strong> ${quoteRequest.timeline}</p>` : ''}
      
      <div style="margin: 20px 0; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
        <p><strong>💡 Tip:</strong> While you wait, you can explore more suppliers in our directory or save your favorites for future reference.</p>
      </div>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/" 
           style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
          Browse More Suppliers
        </a>
      </p>
      
      <p>If you don't hear back within 2 business days, please let us know and we'll follow up.</p>
      
      <p>Best regards,<br>The Moving Suppliers Hub Team</p>
      
      <hr>
      <p><small>Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">contact page</a>.</small></p>
    `
  }

  // Implement your email sending logic here
  console.log('Would send requester confirmation:', emailData)
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 })
}
