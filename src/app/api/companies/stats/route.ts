import { NextResponse } from 'next/server'
import { CompanyService } from '@/lib/services/company-service'

export async function GET() {
  try {
    const stats = await CompanyService.getCompanyStatistics()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching company statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company statistics' },
      { status: 500 }
    )
  }
}
