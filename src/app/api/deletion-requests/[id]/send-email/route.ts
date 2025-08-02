import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { EmailService } from '@/lib/services/email-service'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'

export async function POST(
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

    // Check if user owns this request
    const deletionRequest = await DeletionRequestService.getDeletionRequestById(params.id, false)
    
    if (!deletionRequest) {
      return NextResponse.json(
        { error: 'Deletion request not found' },
        { status: 404 }
      )
    }

    if (deletionRequest.userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if request is in a valid state for sending
    if (deletionRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Request has already been sent or is not in pending status' },
        { status: 400 }
      )
    }

    // Send the email
    const result = await EmailService.sendDeletionRequestEmail(params.id)

    if (result.success) {
      return NextResponse.json({
        message: 'Email sent successfully',
        messageId: result.messageId,
        provider: result.provider,
        emailLogId: result.emailLogId
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending deletion request email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
