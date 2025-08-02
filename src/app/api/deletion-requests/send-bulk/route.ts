import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { EmailService } from '@/lib/services/email-service'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'

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
    const { requestIds } = body

    if (!Array.isArray(requestIds) || requestIds.length === 0) {
      return NextResponse.json(
        { error: 'Request IDs array is required' },
        { status: 400 }
      )
    }

    // Verify all requests belong to the user and are in pending status
    const requests = await Promise.all(
      requestIds.map(id => DeletionRequestService.getDeletionRequestById(id, false))
    )

    const invalidRequests = requests.filter(
      (request) =>
        !request || 
        request.userId !== userId || 
        request.status !== 'PENDING'
    )

    if (invalidRequests.length > 0) {
      return NextResponse.json(
        { error: 'Some requests are invalid, not owned by user, or not in pending status' },
        { status: 400 }
      )
    }

    // Send bulk emails
    const result = await EmailService.sendBulkDeletionEmails(requestIds)

    return NextResponse.json({
      message: 'Bulk email sending completed',
      results: result.results,
      successCount: result.successCount,
      failureCount: result.failureCount
    })
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    return NextResponse.json(
      { error: 'Failed to send bulk emails' },
      { status: 500 }
    )
  }
}
