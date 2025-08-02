import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'
import { Jurisdiction, RequestType, RequestStatus, Priority } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') as RequestStatus | null
    const jurisdiction = searchParams.get('jurisdiction') as Jurisdiction | null
    const requestType = searchParams.get('requestType') as RequestType | null
    const companyId = searchParams.get('companyId') || undefined
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined

    const filters = {
      userId, // Always filter by current user
      status: status || undefined,
      jurisdiction: jurisdiction || undefined,
      requestType: requestType || undefined,
      companyId,
      dateFrom,
      dateTo
    }

    const result = await DeletionRequestService.getDeletionRequests(filters, page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching deletion requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deletion requests' },
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
    if (!body.companyId || !body.jurisdiction || !body.requestorName || !body.requestorEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, jurisdiction, requestorName, requestorEmail' },
        { status: 400 }
      )
    }

    // Validate enums
    if (!Object.values(Jurisdiction).includes(body.jurisdiction)) {
      return NextResponse.json(
        { error: 'Invalid jurisdiction' },
        { status: 400 }
      )
    }

    if (body.requestType && !Object.values(RequestType).includes(body.requestType)) {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      )
    }

    if (body.priority && !Object.values(Priority).includes(body.priority)) {
      return NextResponse.json(
        { error: 'Invalid priority' },
        { status: 400 }
      )
    }

    // Handle bulk requests
    if (body.requestType === RequestType.BULK && Array.isArray(body.companyIds)) {
      const result = await DeletionRequestService.createBulkDeletionRequests(
        userId,
        body.companyIds,
        body.jurisdiction,
        {
          name: body.requestorName,
          email: body.requestorEmail,
          phone: body.requestorPhone,
          address: body.requestorAddress
        }
      )

      return NextResponse.json({
        message: 'Bulk deletion requests created',
        results: result,
        successCount: result.filter(r => r.success).length,
        failureCount: result.filter(r => !r.success).length
      }, { status: 201 })
    }

    // Create single deletion request
    const deletionRequest = await DeletionRequestService.createDeletionRequest({
      userId,
      companyId: body.companyId,
      jurisdiction: body.jurisdiction,
      requestType: body.requestType || RequestType.INDIVIDUAL,
      priority: body.priority || Priority.NORMAL,
      requestorName: body.requestorName,
      requestorEmail: body.requestorEmail,
      requestorPhone: body.requestorPhone,
      requestorAddress: body.requestorAddress,
      cost: body.cost
    })

    return NextResponse.json(deletionRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating deletion request:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
      if (error.message.includes('does not support')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to create deletion request' },
      { status: 500 }
    )
  }
}
