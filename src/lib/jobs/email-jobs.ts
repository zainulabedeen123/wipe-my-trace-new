import { EmailService } from '@/lib/services/email-service'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'
import { prisma } from '@/lib/prisma'
import { RequestStatus } from '@prisma/client'

export class EmailJobs {
  // Process pending deletion requests and send emails
  static async processPendingRequests() {
    console.log('🔄 Processing pending deletion requests...')

    try {
      // Get all pending requests
      const pendingRequests = await prisma.deletionRequest.findMany({
        where: {
          status: RequestStatus.PENDING,
          sentAt: null
        },
        include: {
          user: true,
          company: true
        },
        take: 50 // Process in batches
      })

      console.log(`Found ${pendingRequests.length} pending requests`)

      const results = []

      for (const request of pendingRequests) {
        try {
          // Check if company has email address
          const recipientEmail = request.company.privacyEmail || 
                                request.company.contactEmail || 
                                request.company.email

          if (!recipientEmail) {
            console.log(`⚠️ No email address for company ${request.company.name}`)
            continue
          }

          // Send the email
          const result = await EmailService.sendDeletionRequestEmail(request.id)
          
          results.push({
            requestId: request.id,
            companyName: request.company.name,
            success: result.success,
            error: result.error
          })

          // Add delay between emails to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))

        } catch (error) {
          console.error(`Error processing request ${request.id}:`, error)
          results.push({
            requestId: request.id,
            companyName: request.company.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      console.log(`✅ Processed ${results.length} requests: ${successCount} success, ${failureCount} failed`)

      return {
        processed: results.length,
        successCount,
        failureCount,
        results
      }

    } catch (error) {
      console.error('Error in processPendingRequests:', error)
      throw error
    }
  }

  // Send follow-up emails for requests that haven't received responses
  static async sendFollowUpEmails() {
    console.log('🔄 Sending follow-up emails...')

    try {
      const requestsNeedingFollowUp = await DeletionRequestService.getRequestsRequiringFollowUp()

      console.log(`Found ${requestsNeedingFollowUp.length} requests needing follow-up`)

      const results = []

      for (const request of requestsNeedingFollowUp) {
        try {
          // Check if we've already sent too many follow-ups
          if (request.emailsSent >= 3) {
            console.log(`⚠️ Request ${request.id} has already received maximum follow-ups`)
            continue
          }

          const result = await EmailService.sendFollowUpEmail(request.id)
          
          results.push({
            requestId: request.id,
            companyName: request.company.name,
            success: result.success,
            error: result.error
          })

          // Add delay between emails
          await new Promise(resolve => setTimeout(resolve, 2000))

        } catch (error) {
          console.error(`Error sending follow-up for request ${request.id}:`, error)
          results.push({
            requestId: request.id,
            companyName: request.company.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      console.log(`✅ Sent ${results.length} follow-ups: ${successCount} success, ${failureCount} failed`)

      return {
        processed: results.length,
        successCount,
        failureCount,
        results
      }

    } catch (error) {
      console.error('Error in sendFollowUpEmails:', error)
      throw error
    }
  }

  // Mark overdue requests as failed
  static async markOverdueRequests() {
    console.log('🔄 Marking overdue requests...')

    try {
      const overdueThreshold = new Date()
      overdueThreshold.setDate(overdueThreshold.getDate() - 60) // 60 days

      const overdueRequests = await prisma.deletionRequest.findMany({
        where: {
          status: RequestStatus.SENT,
          sentAt: { lte: overdueThreshold },
          responseReceived: false
        }
      })

      console.log(`Found ${overdueRequests.length} overdue requests`)

      const results = []

      for (const request of overdueRequests) {
        try {
          await DeletionRequestService.updateDeletionRequest(
            request.id,
            { 
              status: RequestStatus.FAILED,
              internalNotes: 'Marked as failed due to no response after 60 days'
            }
          )

          // Send notification to user
          await EmailService.sendUserNotification(
            request.userId,
            'Deletion Request Update',
            `Your deletion request to ${request.company?.name || 'the company'} has been marked as failed due to no response after 60 days. You may want to try contacting them directly or filing a complaint with the relevant data protection authority.`,
            'warning'
          )

          results.push({
            requestId: request.id,
            success: true
          })

        } catch (error) {
          console.error(`Error marking request ${request.id} as overdue:`, error)
          results.push({
            requestId: request.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      console.log(`✅ Marked ${results.length} requests as overdue: ${successCount} success, ${failureCount} failed`)

      return {
        processed: results.length,
        successCount,
        failureCount,
        results
      }

    } catch (error) {
      console.error('Error in markOverdueRequests:', error)
      throw error
    }
  }

  // Send daily summary emails to users
  static async sendDailySummaries() {
    console.log('🔄 Sending daily summaries...')

    try {
      // Get users with active requests
      const usersWithRequests = await prisma.user.findMany({
        where: {
          deletionRequests: {
            some: {
              status: { in: [RequestStatus.PENDING, RequestStatus.SENT, RequestStatus.IN_PROGRESS] }
            }
          }
        },
        include: {
          deletionRequests: {
            where: {
              status: { in: [RequestStatus.PENDING, RequestStatus.SENT, RequestStatus.IN_PROGRESS] }
            },
            include: {
              company: true
            }
          }
        }
      })

      console.log(`Found ${usersWithRequests.length} users with active requests`)

      const results = []

      for (const user of usersWithRequests) {
        try {
          const pendingCount = user.deletionRequests.filter(r => r.status === RequestStatus.PENDING).length
          const sentCount = user.deletionRequests.filter(r => r.status === RequestStatus.SENT).length
          const inProgressCount = user.deletionRequests.filter(r => r.status === RequestStatus.IN_PROGRESS).length

          const message = `
            <h3>Your Privacy Protection Summary</h3>
            <p>Here's an update on your deletion requests:</p>
            <ul>
              <li><strong>${pendingCount}</strong> requests pending</li>
              <li><strong>${sentCount}</strong> requests sent and awaiting response</li>
              <li><strong>${inProgressCount}</strong> requests in progress</li>
            </ul>
            <p>We'll continue monitoring these requests and will notify you of any updates.</p>
            <p><a href="https://wipemytrace.com/dashboard/requests">View your requests</a></p>
          `

          await EmailService.sendUserNotification(
            user.id,
            'Daily Privacy Protection Summary',
            message,
            'info'
          )

          results.push({
            userId: user.id,
            email: user.email,
            success: true
          })

        } catch (error) {
          console.error(`Error sending summary to user ${user.id}:`, error)
          results.push({
            userId: user.id,
            email: user.email,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failureCount = results.filter(r => !r.success).length

      console.log(`✅ Sent ${results.length} summaries: ${successCount} success, ${failureCount} failed`)

      return {
        processed: results.length,
        successCount,
        failureCount,
        results
      }

    } catch (error) {
      console.error('Error in sendDailySummaries:', error)
      throw error
    }
  }

  // Run all email jobs
  static async runAllJobs() {
    console.log('🚀 Starting email job processing...')

    const results = {
      pendingRequests: await this.processPendingRequests(),
      followUps: await this.sendFollowUpEmails(),
      overdueRequests: await this.markOverdueRequests(),
      // dailySummaries: await this.sendDailySummaries() // Uncomment for daily summaries
    }

    console.log('✅ All email jobs completed')
    return results
  }
}
