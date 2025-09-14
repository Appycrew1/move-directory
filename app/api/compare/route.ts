import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { createRouteHandlerClient } from '@/lib/supabase'
import { aiComparisonSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/utils'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.AI_API_URL || 'https://api.openai.com/v1',
})

const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const supabase = createRouteHandlerClient(request, response)

    // Check if AI comparison is enabled
    const { data: featureFlag } = await supabase
      .from('feature_flags')
      .select('enabled')
      .eq('id', 'ai_comparison')
      .single()

    if (!featureFlag?.enabled) {
      return NextResponse.json(
        { success: false, error: 'AI comparison feature is not available' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { supplier_ids } = aiComparisonSchema.parse(body)

    // Fetch supplier details
    const { data: suppliers, error } = await supabase
      .from('suppliers')
      .select(`
        id,
        name,
        description,
        short_summary,
        category:categories(name),
        tags:supplier_tags(tag),
        rating_average,
        rating_count,
        has_discount,
        discount_description,
        founded_year,
        employee_count,
        pricing_model,
        website_url
      `)
      .in('id', supplier_ids)
      .eq('status', 'approved')

    if (error) {
      throw error
    }

    if (!suppliers || suppliers.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least 2 suppliers are required for comparison' },
        { status: 400 }
      )
    }

    // Prepare data for AI analysis
    const supplierData = suppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      category: supplier.category?.name || 'Unknown',
      description: supplier.description || supplier.short_summary || '',
      tags: supplier.tags?.map((t: any) => t.tag).join(', ') || '',
      rating: `${supplier.rating_average}/5 (${supplier.rating_count} reviews)`,
      hasDiscount: supplier.has_discount,
      discountDetails: supplier.discount_description || '',
      foundedYear: supplier.founded_year,
      employeeCount: supplier.employee_count,
      pricingModel: supplier.pricing_model || 'Contact for pricing',
      website: supplier.website_url
    }))

    // Create AI prompt
    const prompt = `
As an expert consultant for UK moving companies, analyze and compare these suppliers:

${supplierData.map(supplier => `
**${supplier.name}**
- Category: ${supplier.category}
- Description: ${supplier.description}
- Services/Tags: ${supplier.tags}
- Rating: ${supplier.rating}
- Founded: ${supplier.foundedYear || 'Not specified'}
- Team Size: ${supplier.employeeCount || 'Not specified'}
- Pricing: ${supplier.pricingModel}
- Discount Available: ${supplier.hasDiscount ? 'Yes' + (supplier.discountDetails ? ` - ${supplier.discountDetails}` : '') : 'No'}
`).join('\n')}

Please provide a comprehensive comparison in the following JSON format:
{
  "suppliers": [
    {
      "id": "supplier_id",
      "name": "Supplier Name",
      "pros": ["Pro 1", "Pro 2", "Pro 3"],
      "cons": ["Con 1", "Con 2"],
      "bestFor": "Brief description of what type of moving company this is best suited for"
    }
  ],
  "recommendation": "A detailed recommendation explaining which supplier to choose in different scenarios, considering factors like company size, budget, and specific needs."
}

Focus on practical aspects that matter to moving company owners: cost-effectiveness, ease of implementation, customer support quality, integration capabilities, and industry-specific features.
`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert consultant specializing in the UK moving and removals industry. You help moving companies choose the best suppliers and services for their business needs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Failed to generate AI comparison')
    }

    // Parse AI response
    let comparisonData
    try {
      comparisonData = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      throw new Error('Failed to parse AI comparison results')
    }

    // Track usage for potential billing in Phase 2
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ai_comparison_generated', {
        supplier_count: suppliers.length,
        category: suppliers[0].category?.name
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...comparisonData,
        generated_at: new Date().toISOString(),
        suppliers_analyzed: suppliers.length,
        model_used: AI_MODEL
      }
    })

  } catch (error: any) {
    console.error('Error generating AI comparison:', error)

    // Handle OpenAI specific errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { success: false, error: 'AI comparison service temporarily unavailable' },
        { status: 503 }
      )
    }

    if (error.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again in a moment.' },
        { status: 429 }
      )
    }

    const errorResponse = handleApiError(error)
    return NextResponse.json(
      { success: false, error: errorResponse.error },
      { status: errorResponse.statusCode }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed'
  }, { status: 405 })
}
