import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { CompanyService } from '@/lib/services/company-service'
import { CompanyCategory, Difficulty, Jurisdiction } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category') as CompanyCategory | null
    const jurisdiction = searchParams.get('jurisdiction') as Jurisdiction | null
    const difficulty = searchParams.get('difficulty') as Difficulty | null
    const search = searchParams.get('search') || undefined
    const isActive = searchParams.get('isActive') === 'true' ? true : 
                    searchParams.get('isActive') === 'false' ? false : undefined
    const isVerified = searchParams.get('isVerified') === 'true' ? true :
                      searchParams.get('isVerified') === 'false' ? false : undefined

    const filters = {
      category: category || undefined,
      jurisdiction: jurisdiction || undefined,
      difficulty: difficulty || undefined,
      search,
      isActive,
      isVerified
    }

    const result = await CompanyService.getCompanies(filters, page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    // Validate enums
    if (!Object.values(CompanyCategory).includes(body.category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    if (body.difficulty && !Object.values(Difficulty).includes(body.difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty' },
        { status: 400 }
      )
    }

    if (body.supportedJurisdictions) {
      const validJurisdictions = body.supportedJurisdictions.every((j: string) => 
        Object.values(Jurisdiction).includes(j as Jurisdiction)
      )
      if (!validJurisdictions) {
        return NextResponse.json(
          { error: 'Invalid jurisdiction(s)' },
          { status: 400 }
        )
      }
    }

    const company = await CompanyService.createCompany({
      name: body.name,
      website: body.website,
      email: body.email,
      category: body.category,
      description: body.description,
      contactEmail: body.contactEmail,
      privacyEmail: body.privacyEmail,
      dpoEmail: body.dpoEmail,
      phone: body.phone,
      address: body.address,
      supportedJurisdictions: body.supportedJurisdictions || [],
      difficulty: body.difficulty || Difficulty.MEDIUM,
      avgResponseTime: body.avgResponseTime || 30,
      successRate: body.successRate || 0
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    console.error('Error creating company:', error)
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Company with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
