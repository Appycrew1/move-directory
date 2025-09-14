import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { contactMessageSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    const body = await request.json()
    const validatedData = contactMessageSchema.parse(body)

    // Create contact message
    const { data: message, error } = await supabase
      .from('contact_messages')
      .insert([{
        ...validatedData,
        source: 'contact_form'
      }])
      .select(`
        *,
        supplier:suppliers(name, contact_email)
      `)
      .single()

    if (error) {
      throw error
    }

    // Send email notification (implement your email service here)
    try {
      await sendContactNotification(message)
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the API call if email fails
    }

    // Track contact for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_submitted', {
        supplier_id: validatedData.supplier_id || 'general',
        has_company: !!validatedData.company
      })
    }

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Your message has been sent successfully. We\'ll get back to you soon!'
    })

  } catch (error) {
    console.error('Error handling contact form:', error)
    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

// Email notification function (you would implement with your email service)
async function sendContactNotification(message: any) {
  // Example implementation with a generic email service
  // Replace with your actual email service (SendGrid, Resend, etc.)
  
  const emailData = {
    to: message.supplier?.contact_email || process.env.CONTACT_EMAIL || 'hello@movingsuppliershub.com',
    subject: message.subject || 'New Contact Form Submission',
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${message.name} (${message.email})</p>
      ${message.company ? `<p><strong>Company:</strong> ${message.company}</p>` : ''}
      ${message.phone ? `<p><strong>Phone:</strong> ${message.phone}</p>` : ''}
      ${message.supplier ? `<p><strong>Regarding:</strong> ${message.supplier.name}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted via Moving Suppliers Hub contact form</small></p>
    `
  }

  // Implement your email sending logic here
  console.log('Would send email:', emailData)
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 })
}
