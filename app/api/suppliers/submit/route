import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { supplierSchema } from '@/lib/validations'
import { handleApiError, createSlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    const body = await request.json()
    
    // Validate the submission data
    const validatedData = supplierSchema.parse(body)

    // Generate a unique slug
    let baseSlug = createSlug(validatedData.name)
    let slug = baseSlug
    let counter = 1

    // Check if slug exists and make it unique
    while (true) {
      const { data: existing } = await supabase
        .from('suppliers')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!existing) break

      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the supplier record with pending status
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .insert([{
        ...validatedData,
        slug,
        status: 'pending', // Always start as pending for public submissions
        featured: false,
        verified_business: false,
        verified_insurance: false,
        view_count: 0,
        contact_count: 0,
        rating_average: 0,
        rating_count: 0,
        commission_rate: 0
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    // Add tags if provided
    if (validatedData.tags && validatedData.tags.length > 0) {
      const tagInserts = validatedData.tags.map(tag => ({
        supplier_id: supplier.id,
        tag: tag.trim()
      }))

      const { error: tagsError } = await supabase
        .from('supplier_tags')
        .insert(tagInserts)

      if (tagsError) {
        console.error('Error adding tags:', tagsError)
        // Don't fail the submission for tag errors
      }
    }

    // Send notification emails
    try {
      await Promise.all([
        sendSubmissionNotificationToAdmin(supplier),
        sendSubmissionConfirmationToSupplier(supplier, validatedData.contact_email)
      ])
    } catch (emailError) {
      console.error('Failed to send notification emails:', emailError)
      // Don't fail the submission for email errors
    }

    // Track submission for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'supplier_submitted', {
        category: validatedData.category_id,
        has_discount: validatedData.has_discount,
        accepts_quotes: validatedData.accepts_quotes
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: supplier.id,
        name: supplier.name,
        status: supplier.status
      },
      message: 'Supplier submission received! We\'ll review it within 2-3 business days.'
    })

  } catch (error: any) {
    console.error('Error submitting supplier:', error)

    // Handle validation errors specifically
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please check your submission for errors',
          details: error.errors
        },
        { status: 400 }
      )
    }

    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

// Send notification to admin team
async function sendSubmissionNotificationToAdmin(supplier: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@movingsuppliershub.com'
  
  const emailData = {
    to: adminEmail,
    subject: `New Supplier Submission: ${supplier.name}`,
    html: `
      <h2>New Supplier Submission</h2>
      <p>A new supplier has been submitted for review.</p>
      
      <h3>Company Details</h3>
      <ul>
        <li><strong>Name:</strong> ${supplier.name}</li>
        <li><strong>Website:</strong> <a href="${supplier.website_url}">${supplier.website_url}</a></li>
        <li><strong>Email:</strong> ${supplier.contact_email}</li>
        <li><strong>Phone:</strong> ${supplier.contact_phone || 'Not provided'}</li>
        <li><strong>Location:</strong> ${supplier.location || 'Not provided'}</li>
        <li><strong>Accepts Quotes:</strong> ${supplier.accepts_quotes ? 'Yes' : 'No'}</li>
        <li><strong>Has Discount:</strong> ${supplier.has_discount ? 'Yes' : 'No'}</li>
      </ul>
      
      <h3>Description</h3>
      <p>${supplier.description}</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
        <p><strong>Next Steps:</strong></p>
        <ol>
          <li>Review the supplier details above</li>
          <li>Verify business credentials if needed</li>
          <li>Approve or reject the submission in the admin panel</li>
          <li>The supplier will be notified of the decision</li>
        </ol>
      </div>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/suppliers?status=pending" 
           style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
          Review in Admin Panel
        </a>
      </p>
      
      <hr>
      <p><small>Submitted via Moving Suppliers Hub</small></p>
    `
  }

  // Implement your email sending logic here
  console.log('Would send admin notification:', emailData)
}

// Send confirmation to supplier
async function sendSubmissionConfirmationToSupplier(supplier: any, email: string) {
  const emailData = {
    to: email,
    subject: `Submission Received: ${supplier.name}`,
    html: `
      <h2>Thank you for your submission!</h2>
      <p>Hi there,</p>
      
      <p>We've received your submission for <strong>${supplier.name}</strong> and it's now under review.</p>
      
      <h3>What happens next?</h3>
      <ul>
        <li><strong>Review Process:</strong> Our team will review your submission within 2-3 business days</li>
        <li><strong>Verification:</strong> We may contact you if we need additional information or verification</li>
        <li><strong>Publication:</strong> Once approved, your listing will be published in our directory</li>
        <li><strong>Account Access:</strong> You'll receive login details to manage your listing</li>
      </ul>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #ecfdf5; border-radius: 8px;">
        <h4 style="margin: 0 0 10px 0; color: #065f46;">💡 While you wait...</h4>
        <ul style="margin: 0; color: #047857;">
          <li>Prepare any additional documentation we might request</li>
          <li>Consider what images you'd like to add to your listing</li>
          <li>Think about any special offers for our users</li>
        </ul>
      </div>
      
      <h3>Your Submission Summary</h3>
      <ul>
        <li><strong>Company:</strong> ${supplier.name}</li>
        <li><strong>Website:</strong> ${supplier.website_url}</li>
        <li><strong>Contact:</strong> ${supplier.contact_email}</li>
        <li><strong>Submission ID:</strong> ${supplier.id}</li>
      </ul>
      
      <p>If you have any questions about the review process, please don't hesitate to contact us.</p>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" 
           style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
          Contact Support
        </a>
      </p>
      
      <p>Thank you for wanting to be part of Moving Suppliers Hub!</p>
      
      <p>Best regards,<br>The Moving Suppliers Hub Team</p>
      
      <hr>
      <p><small>This is an automated message. Please do not reply to this email. For support, visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact">contact page</a>.</small></p>
    `
  }

  // Implement your email sending logic here
  console.log('Would send supplier confirmation:', emailData)
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 })
}
