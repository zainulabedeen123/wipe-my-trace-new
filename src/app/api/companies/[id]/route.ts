import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { CompanyService } from '@/lib/services/company-service'
import { CompanyCategory, Difficulty, Jurisdiction } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const company = await CompanyService.getCompanyById(params.id)

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate enums if provided
    if (body.category && !Object.values(CompanyCategory).includes(body.category)) {
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

    const company = await CompanyService.updateCompany(params.id, body)

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error updating company:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Company with this name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Soft delete by setting isActive to false
    const company = await CompanyService.deleteCompany(params.id)

    return NextResponse.json({ 
      message: 'Company deactivated successfully',
      company 
    })
  } catch (error) {
    console.error('Error deleting company:', error)
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    )
  }
}
