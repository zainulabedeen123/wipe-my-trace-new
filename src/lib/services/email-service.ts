import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { EmailStatus, TemplateType } from '@prisma/client'

// Email service configuration
const resend = new Resend(process.env.RESEND_API_KEY)

// Fallback SMTP configuration
const smtpTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface SendEmailOptions {
  to: string
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  deletionRequestId?: string
  templateId?: string
}

export class EmailService {
  // Send email using Resend (primary) or SMTP (fallback)
  static async sendEmail(options: SendEmailOptions) {
    const fromEmail = options.from || process.env.FROM_EMAIL || 'noreply@wipemytrace.com'
    const replyToEmail = options.replyTo || process.env.REPLY_TO_EMAIL || 'support@wipemytrace.com'

    let emailLog
    let emailResult

    try {
      // Create email log entry
      if (options.deletionRequestId) {
        emailLog = await prisma.emailLog.create({
          data: {
            deletionRequestId: options.deletionRequestId,
            templateId: options.templateId,
            toEmail: options.to,
            fromEmail: fromEmail,
            subject: options.subject,
            body: options.html,
            status: EmailStatus.PENDING
          }
        })
      }

      // Try Resend first
      if (process.env.RESEND_API_KEY) {
        try {
          emailResult = await resend.emails.send({
            from: fromEmail,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
            reply_to: replyToEmail
          })

          // Update email log with success
          if (emailLog) {
            await prisma.emailLog.update({
              where: { id: emailLog.id },
              data: {
                status: EmailStatus.SENT,
                sentAt: new Date()
              }
            })
          }

          return {
            success: true,
            messageId: emailResult.data?.id,
            provider: 'resend',
            emailLogId: emailLog?.id
          }
        } catch (resendError) {
          console.error('Resend failed, trying SMTP:', resendError)
          // Fall back to SMTP
        }
      }

      // Fallback to SMTP
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        emailResult = await smtpTransporter.sendMail({
          from: fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          replyTo: replyToEmail
        })

        // Update email log with success
        if (emailLog) {
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              status: EmailStatus.SENT,
              sentAt: new Date()
            }
          })
        }

        return {
          success: true,
          messageId: emailResult.messageId,
          provider: 'smtp',
          emailLogId: emailLog?.id
        }
      }

      throw new Error('No email service configured')

    } catch (error) {
      console.error('Email sending failed:', error)

      // Update email log with failure
      if (emailLog) {
        await prisma.emailLog.update({
          where: { id: emailLog.id },
          data: {
            status: EmailStatus.FAILED,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        emailLogId: emailLog?.id
      }
    }
  }

  // Send deletion request email
  static async sendDeletionRequestEmail(deletionRequestId: string) {
    const deletionRequest = await prisma.deletionRequest.findUnique({
      where: { id: deletionRequestId },
      include: {
        user: true,
        company: true
      }
    })

    if (!deletionRequest) {
      throw new Error('Deletion request not found')
    }

    // Generate email content using the email template service
    const { EmailTemplateService } = await import('./email-template-service')
    const emailContent = await EmailTemplateService.generateDeletionEmail(
      deletionRequest.userId,
      deletionRequest.companyId,
      deletionRequest.jurisdiction
    )

    // Determine recipient email
    const recipientEmail = deletionRequest.company.privacyEmail || 
                          deletionRequest.company.contactEmail || 
                          deletionRequest.company.email

    if (!recipientEmail) {
      throw new Error('No email address found for company')
    }

    // Send the email
    const result = await this.sendEmail({
      to: recipientEmail,
      subject: emailContent.subject,
      html: emailContent.body,
      text: emailContent.plainText,
      deletionRequestId: deletionRequestId,
      templateId: emailContent.templateId
    })

    // Update deletion request status if email was sent successfully
    if (result.success) {
      const { DeletionRequestService } = await import('./deletion-request-service')
      await DeletionRequestService.markRequestAsSent(deletionRequestId, result.emailLogId!)
    }

    return result
  }

  // Send follow-up email
  static async sendFollowUpEmail(deletionRequestId: string) {
    const deletionRequest = await prisma.deletionRequest.findUnique({
      where: { id: deletionRequestId },
      include: {
        user: true,
        company: true
      }
    })

    if (!deletionRequest) {
      throw new Error('Deletion request not found')
    }

    // Generate follow-up email content
    const { EmailTemplateService } = await import('./email-template-service')
    const emailContent = await EmailTemplateService.generateFollowUpEmail(deletionRequestId)

    // Determine recipient email
    const recipientEmail = deletionRequest.company.privacyEmail || 
                          deletionRequest.company.contactEmail || 
                          deletionRequest.company.email

    if (!recipientEmail) {
      throw new Error('No email address found for company')
    }

    // Send the follow-up email
    const result = await this.sendEmail({
      to: recipientEmail,
      subject: emailContent.subject,
      html: emailContent.body,
      text: emailContent.plainText,
      deletionRequestId: deletionRequestId
    })

    // Update deletion request with follow-up info
    if (result.success) {
      await prisma.deletionRequest.update({
        where: { id: deletionRequestId },
        data: {
          emailsSent: { increment: 1 },
          lastEmailSent: new Date()
        }
      })
    }

    return result
  }

  // Send bulk deletion request emails
  static async sendBulkDeletionEmails(deletionRequestIds: string[]) {
    const results = []

    for (const requestId of deletionRequestIds) {
      try {
        const result = await this.sendDeletionRequestEmail(requestId)
        results.push({
          requestId,
          success: result.success,
          messageId: result.messageId,
          error: result.error
        })

        // Add delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        results.push({
          requestId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return {
      results,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length
    }
  }

  // Send notification email to user
  static async sendUserNotification(
    userId: string,
    subject: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-bottom: 20px;">${subject}</h2>
          <div style="background-color: white; padding: 20px; border-radius: 4px; border-left: 4px solid ${
            type === 'success' ? '#10b981' :
            type === 'warning' ? '#f59e0b' :
            type === 'error' ? '#ef4444' : '#3b82f6'
          };">
            <p style="color: #555; line-height: 1.6; margin: 0;">${message}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Best regards,<br>The Wipe My Trace Team</p>
            <p><a href="https://wipemytrace.com" style="color: #3b82f6;">wipemytrace.com</a></p>
          </div>
        </div>
      </div>
    `

    return await this.sendEmail({
      to: user.email,
      subject,
      html,
      text: message
    })
  }

  // Get email statistics
  static async getEmailStatistics(deletionRequestId?: string) {
    const where = deletionRequestId ? { deletionRequestId } : {}

    const [
      totalEmails,
      sentEmails,
      deliveredEmails,
      failedEmails,
      openedEmails
    ] = await Promise.all([
      prisma.emailLog.count({ where }),
      prisma.emailLog.count({ where: { ...where, status: EmailStatus.SENT } }),
      prisma.emailLog.count({ where: { ...where, status: EmailStatus.DELIVERED } }),
      prisma.emailLog.count({ where: { ...where, status: EmailStatus.FAILED } }),
      prisma.emailLog.count({ where: { ...where, openedAt: { not: null } } })
    ])

    return {
      totalEmails,
      sentEmails,
      deliveredEmails,
      failedEmails,
      openedEmails,
      deliveryRate: totalEmails > 0 ? Math.round((deliveredEmails / totalEmails) * 100) : 0,
      openRate: sentEmails > 0 ? Math.round((openedEmails / sentEmails) * 100) : 0
    }
  }

  // Process email webhooks (for tracking opens, clicks, etc.)
  static async processEmailWebhook(webhookData: any) {
    // This would handle webhooks from Resend or other email providers
    // to track email opens, clicks, bounces, etc.
    
    const { messageId, event, timestamp } = webhookData

    if (!messageId) return

    // Find email log by message ID (you'd need to store this in the email log)
    const emailLog = await prisma.emailLog.findFirst({
      where: {
        // You'd need to add a messageId field to the EmailLog model
        // messageId: messageId
      }
    })

    if (!emailLog) return

    const updateData: any = {}

    switch (event) {
      case 'delivered':
        updateData.status = EmailStatus.DELIVERED
        updateData.deliveredAt = new Date(timestamp)
        break
      case 'opened':
        updateData.openedAt = new Date(timestamp)
        break
      case 'clicked':
        updateData.clickedAt = new Date(timestamp)
        break
      case 'bounced':
        updateData.status = EmailStatus.BOUNCED
        break
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: updateData
      })
    }
  }
}
