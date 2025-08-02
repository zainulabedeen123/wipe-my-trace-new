import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'
import { RequestStatus } from '@prisma/client'

export async function GET(
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

    const deletionRequest = await DeletionRequestService.getDeletionRequestById(params.id)

    if (!deletionRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      )
    }

    // Check if user owns this request
    if (deletionRequest.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json(deletionRequest)
  } catch (error) {
    console.error('Error fetching deletion request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deletion request' },
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

    // Validate status if provided
    if (body.status && !Object.values(RequestStatus).includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get existing request to check ownership
    const existingRequest = await DeletionRequestService.getDeletionRequestById(params.id, false)
    
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      )
    }

    if (existingRequest.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Users can only update certain fields
    const allowedUpdates = {
      notes: body.notes,
      responseReceived: body.responseReceived
    }

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([, value]) => value !== undefined)
    )

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    const updatedRequest = await DeletionRequestService.updateDeletionRequest(
      params.id,
      updateData,
      userId
    )

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating deletion request:', error)
    return NextResponse.json(
      { error: 'Failed to update deletion request' },
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

    // Get existing request to check ownership
    const existingRequest = await DeletionRequestService.getDeletionRequestById(params.id, false)
    
    if (!existingRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      )
    }

    if (existingRequest.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Only allow cancellation of pending or sent requests
    if (!['PENDING', 'SENT'].includes(existingRequest.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel request in current status' },
        { status: 400 }
      )
    }

    const cancelledRequest = await DeletionRequestService.cancelDeletionRequest(params.id, userId)

    return NextResponse.json({
      message: 'Deletion request cancelled successfully',
      request: cancelledRequest
    })
  } catch (error) {
    console.error('Error cancelling deletion request:', error)
    return NextResponse.json(
      { error: 'Failed to cancel deletion request' },
      { status: 500 }
    )
  }
}
