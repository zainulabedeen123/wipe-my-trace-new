import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/services/email-service'

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (implement based on your email provider)
    const signature = request.headers.get('webhook-signature')
    const webhookSecret = process.env.EMAIL_WEBHOOK_SECRET
    
    if (webhookSecret && signature) {
      // Implement signature verification here
      // This is provider-specific (Resend, SendGrid, etc.)
    }

    const webhookData = await request.json()
    
    // Process the webhook
    await EmailService.processEmailWebhook(webhookData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing email webhook:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
