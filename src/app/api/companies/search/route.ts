import { NextRequest, NextResponse } from 'next/server'
import { CompanyService } from '@/lib/services/company-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters long' },
        { status: 400 }
      )
    }

    const companies = await CompanyService.searchCompanies(query.trim(), limit)

    return NextResponse.json({
      query,
      results: companies,
      count: companies.length
    })
  } catch (error) {
    console.error('Error searching companies:', error)
    return NextResponse.json(
      { error: 'Failed to search companies' },
      { status: 500 }
    )
  }
}
