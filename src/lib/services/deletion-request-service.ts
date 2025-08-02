import { prisma } from '@/lib/prisma'
import { Jurisdiction, RequestType, RequestStatus, Priority } from '@prisma/client'
import { EmailTemplateService } from './email-template-service'

export interface CreateDeletionRequestData {
  userId: string
  companyId: string
  jurisdiction: Jurisdiction
  requestType?: RequestType
  priority?: Priority
  requestorName: string
  requestorEmail: string
  requestorPhone?: string
  requestorAddress?: string
  cost?: number
}

export interface UpdateDeletionRequestData {
  status?: RequestStatus
  notes?: string
  internalNotes?: string
  responseReceived?: boolean
  acknowledgedAt?: Date
  completedAt?: Date
  actualCompletion?: Date
}

export interface DeletionRequestFilters {
  userId?: string
  companyId?: string
  status?: RequestStatus
  jurisdiction?: Jurisdiction
  requestType?: RequestType
  dateFrom?: Date
  dateTo?: Date
}

export class DeletionRequestService {
  // Create a new deletion request
  static async createDeletionRequest(data: CreateDeletionRequestData) {
    const { userId, companyId, jurisdiction, ...requestData } = data

    // Verify user and company exist
    const [user, company] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.company.findUnique({ where: { id: companyId } })
    ])

    if (!user) {
      throw new Error('User not found')
    }

    if (!company) {
      throw new Error('Company not found')
    }

    // Check if company supports the jurisdiction
    if (!company.supportedJurisdictions.includes(jurisdiction)) {
      throw new Error(`Company does not support ${jurisdiction} jurisdiction`)
    }

    // Calculate estimated completion date based on company's average response time
    const estimatedCompletion = new Date()
    estimatedCompletion.setDate(estimatedCompletion.getDate() + company.avgResponseTime)

    // Determine cost based on request type
    const cost = data.cost || (data.requestType === RequestType.BULK ? 16.99 : 3.50)

    // Create the deletion request
    const deletionRequest = await prisma.deletionRequest.create({
      data: {
        ...requestData,
        userId,
        companyId,
        jurisdiction,
        estimatedCompletion,
        cost,
        requestType: data.requestType || RequestType.INDIVIDUAL,
        priority: data.priority || Priority.NORMAL,
        status: RequestStatus.PENDING
      },
      include: {
        user: true,
        company: true
      }
    })

    // Create audit log
    await this.createAuditLog(
      deletionRequest.id,
      'request_created',
      'DeletionRequest',
      deletionRequest.id,
      null,
      deletionRequest,
      userId
    )

    return deletionRequest
  }

  // Get deletion request by ID
  static async getDeletionRequestById(id: string, includeRelations = true) {
    return await prisma.deletionRequest.findUnique({
      where: { id },
      include: includeRelations ? {
        user: true,
        company: true,
        emailLogs: {
          orderBy: { sentAt: 'desc' }
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      } : undefined
    })
  }

  // Get deletion requests with filters
  static async getDeletionRequests(
    filters: DeletionRequestFilters = {},
    page = 1,
    limit = 50
  ) {
    const where: any = {}

    if (filters.userId) where.userId = filters.userId
    if (filters.companyId) where.companyId = filters.companyId
    if (filters.status) where.status = filters.status
    if (filters.jurisdiction) where.jurisdiction = filters.jurisdiction
    if (filters.requestType) where.requestType = filters.requestType

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {}
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom
      if (filters.dateTo) where.createdAt.lte = filters.dateTo
    }

    const [requests, total] = await Promise.all([
      prisma.deletionRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          company: {
            select: {
              id: true,
              name: true,
              category: true,
              difficulty: true
            }
          },
          _count: {
            select: {
              emailLogs: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.deletionRequest.count({ where })
    ])

    return {
      requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Update deletion request
  static async updateDeletionRequest(
    id: string,
    data: UpdateDeletionRequestData,
    userId?: string
  ) {
    const existingRequest = await prisma.deletionRequest.findUnique({
      where: { id }
    })

    if (!existingRequest) {
      throw new Error('Deletion request not found')
    }

    const updatedRequest = await prisma.deletionRequest.update({
      where: { id },
      data,
      include: {
        user: true,
        company: true
      }
    })

    // Create audit log
    await this.createAuditLog(
      id,
      'request_updated',
      'DeletionRequest',
      id,
      existingRequest,
      updatedRequest,
      userId
    )

    // Update company statistics if status changed to completed/failed
    if (data.status && ['COMPLETED', 'FAILED', 'REJECTED'].includes(data.status)) {
      // This would be done in a background job in production
      // await CompanyService.updateCompanyStats(updatedRequest.companyId)
    }

    return updatedRequest
  }

  // Generate and prepare email for deletion request
  static async generateRequestEmail(deletionRequestId: string) {
    const request = await this.getDeletionRequestById(deletionRequestId)
    
    if (!request) {
      throw new Error('Deletion request not found')
    }

    return await EmailTemplateService.generateDeletionEmail(
      request.userId,
      request.companyId,
      request.jurisdiction
    )
  }

  // Mark request as sent
  static async markRequestAsSent(deletionRequestId: string, emailLogId: string) {
    const updatedRequest = await prisma.deletionRequest.update({
      where: { id: deletionRequestId },
      data: {
        status: RequestStatus.SENT,
        sentAt: new Date(),
        emailsSent: { increment: 1 },
        lastEmailSent: new Date()
      }
    })

    await this.createAuditLog(
      deletionRequestId,
      'email_sent',
      'DeletionRequest',
      deletionRequestId,
      null,
      { emailLogId },
      updatedRequest.userId
    )

    return updatedRequest
  }

  // Get user's deletion requests
  static async getUserDeletionRequests(userId: string, page = 1, limit = 20) {
    return await this.getDeletionRequests({ userId }, page, limit)
  }

  // Get deletion request statistics
  static async getDeletionRequestStatistics(userId?: string) {
    const where = userId ? { userId } : {}

    const [
      totalRequests,
      pendingRequests,
      sentRequests,
      inProgressRequests,
      completedRequests,
      failedRequests,
      totalCost,
      avgResponseTime
    ] = await Promise.all([
      prisma.deletionRequest.count({ where }),
      prisma.deletionRequest.count({ where: { ...where, status: RequestStatus.PENDING } }),
      prisma.deletionRequest.count({ where: { ...where, status: RequestStatus.SENT } }),
      prisma.deletionRequest.count({ where: { ...where, status: RequestStatus.IN_PROGRESS } }),
      prisma.deletionRequest.count({ where: { ...where, status: RequestStatus.COMPLETED } }),
      prisma.deletionRequest.count({ 
        where: { ...where, status: { in: [RequestStatus.FAILED, RequestStatus.REJECTED] } }
      }),
      prisma.deletionRequest.aggregate({
        where,
        _sum: { cost: true }
      }),
      prisma.deletionRequest.aggregate({
        where: {
          ...where,
          status: RequestStatus.COMPLETED,
          sentAt: { not: null },
          completedAt: { not: null }
        },
        _avg: {
          // This would need a computed field for response time in days
          // For now, we'll calculate it differently
        }
      })
    ])

    const successRate = totalRequests > 0 
      ? Math.round((completedRequests / totalRequests) * 100) 
      : 0

    return {
      totalRequests,
      pendingRequests,
      sentRequests,
      inProgressRequests,
      completedRequests,
      failedRequests,
      successRate,
      totalCost: totalCost._sum.cost || 0,
      avgResponseTime: 0 // Would be calculated from actual data
    }
  }

  // Create bulk deletion requests
  static async createBulkDeletionRequests(
    userId: string,
    companyIds: string[],
    jurisdiction: Jurisdiction,
    requestorData: {
      name: string
      email: string
      phone?: string
      address?: string
    }
  ) {
    const results = []
    const bulkCost = 16.99

    for (const companyId of companyIds) {
      try {
        const request = await this.createDeletionRequest({
          userId,
          companyId,
          jurisdiction,
          requestType: RequestType.BULK,
          requestorName: requestorData.name,
          requestorEmail: requestorData.email,
          requestorPhone: requestorData.phone,
          requestorAddress: requestorData.address,
          cost: bulkCost / companyIds.length // Distribute cost across requests
        })

        results.push({ success: true, request })
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          companyId
        })
      }
    }

    return results
  }

  // Create audit log entry
  private static async createAuditLog(
    deletionRequestId: string,
    action: string,
    entity: string,
    entityId: string,
    oldValues: any,
    newValues: any,
    userId?: string
  ) {
    return await prisma.auditLog.create({
      data: {
        deletionRequestId,
        userId,
        action,
        entity,
        entityId,
        oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
        newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null
      }
    })
  }

  // Cancel deletion request
  static async cancelDeletionRequest(id: string, userId?: string) {
    return await this.updateDeletionRequest(
      id,
      { status: RequestStatus.CANCELLED },
      userId
    )
  }

  // Get requests requiring follow-up
  static async getRequestsRequiringFollowUp() {
    const followUpThreshold = new Date()
    followUpThreshold.setDate(followUpThreshold.getDate() - 7) // 7 days ago

    return await prisma.deletionRequest.findMany({
      where: {
        status: RequestStatus.SENT,
        sentAt: { lte: followUpThreshold },
        responseReceived: false
      },
      include: {
        user: true,
        company: true
      },
      orderBy: { sentAt: 'asc' }
    })
  }

  // Get requests by status for admin dashboard
  static async getRequestsByStatus() {
    const statuses = Object.values(RequestStatus)
    const results = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await prisma.deletionRequest.count({ where: { status } })
      }))
    )

    return results.reduce((acc, { status, count }) => {
      acc[status] = count
      return acc
    }, {} as Record<RequestStatus, number>)
  }

  // Get monthly request trends
  static async getMonthlyRequestTrends(months = 12) {
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - months)

    const requests = await prisma.deletionRequest.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        status: true
      }
    })

    // Group by month and status
    const trends = requests.reduce((acc, request) => {
      const monthKey = request.createdAt.toISOString().slice(0, 7) // YYYY-MM
      if (!acc[monthKey]) {
        acc[monthKey] = {
          total: 0,
          completed: 0,
          failed: 0,
          pending: 0
        }
      }

      acc[monthKey].total++

      if (request.status === RequestStatus.COMPLETED) {
        acc[monthKey].completed++
      } else if ([RequestStatus.FAILED, RequestStatus.REJECTED].includes(request.status)) {
        acc[monthKey].failed++
      } else if ([RequestStatus.PENDING, RequestStatus.SENT, RequestStatus.IN_PROGRESS].includes(request.status)) {
        acc[monthKey].pending++
      }

      return acc
    }, {} as Record<string, any>)

    return Object.entries(trends).map(([month, data]) => ({
      month,
      ...data
    }))
  }
}
