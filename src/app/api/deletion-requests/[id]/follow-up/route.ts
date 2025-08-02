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

    // Check if request is in a valid state for follow-up
    if (deletionRequest.status !== 'SENT') {
      return NextResponse.json(
        { error: 'Can only send follow-up for requests that have been sent' },
        { status: 400 }
      )
    }

    // Check if enough time has passed since last email
    const lastEmailDate = deletionRequest.lastEmailSent ? new Date(deletionRequest.lastEmailSent) : null
    if (lastEmailDate) {
      const daysSinceLastEmail = Math.floor((Date.now() - lastEmailDate.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastEmail < 7) {
        return NextResponse.json(
          { error: 'Must wait at least 7 days between follow-up emails' },
          { status: 400 }
        )
      }
    }

    // Send the follow-up email
    const result = await EmailService.sendFollowUpEmail(params.id)

    if (result.success) {
      return NextResponse.json({
        message: 'Follow-up email sent successfully',
        messageId: result.messageId,
        provider: result.provider,
        emailLogId: result.emailLogId
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send follow-up email' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error sending follow-up email:', error)
    return NextResponse.json(
      { error: 'Failed to send follow-up email' },
      { status: 500 }
    )
  }
}
