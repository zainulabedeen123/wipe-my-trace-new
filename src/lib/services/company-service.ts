import { prisma } from '@/lib/prisma'
import { CompanyCategory, Difficulty, Jurisdiction } from '@prisma/client'

export interface CreateCompanyData {
  name: string
  website?: string
  email?: string
  category: CompanyCategory
  description?: string
  contactEmail?: string
  privacyEmail?: string
  dpoEmail?: string
  phone?: string
  address?: string
  supportedJurisdictions: Jurisdiction[]
  difficulty?: Difficulty
  avgResponseTime?: number
  successRate?: number
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  isActive?: boolean
  isVerified?: boolean
}

export interface CompanyFilters {
  category?: CompanyCategory
  jurisdiction?: Jurisdiction
  difficulty?: Difficulty
  isActive?: boolean
  isVerified?: boolean
  search?: string
}

export class CompanyService {
  // Create a new company
  static async createCompany(data: CreateCompanyData) {
    return await prisma.company.create({
      data: {
        ...data,
        lastUpdated: new Date()
      }
    })
  }

  // Get company by ID
  static async getCompanyById(id: string) {
    return await prisma.company.findUnique({
      where: { id },
      include: {
        deletionRequests: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            completedAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        emailTemplates: {
          where: { isActive: true }
        },
        _count: {
          select: {
            deletionRequests: true
          }
        }
      }
    })
  }

  // Get all companies with filters
  static async getCompanies(filters: CompanyFilters = {}, page = 1, limit = 50) {
    const where: Record<string, unknown> = {}

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.jurisdiction) {
      where.supportedJurisdictions = {
        has: filters.jurisdiction
      }
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { website: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        include: {
          _count: {
            select: {
              deletionRequests: true
            }
          }
        },
        orderBy: [
          { isVerified: 'desc' },
          { successRate: 'desc' },
          { name: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.company.count({ where })
    ])

    return {
      companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  // Update company
  static async updateCompany(id: string, data: UpdateCompanyData) {
    return await prisma.company.update({
      where: { id },
      data: {
        ...data,
        lastUpdated: new Date()
      }
    })
  }

  // Delete company (soft delete by setting isActive to false)
  static async deleteCompany(id: string) {
    return await prisma.company.update({
      where: { id },
      data: {
        isActive: false,
        lastUpdated: new Date()
      }
    })
  }

  // Update company success rate based on deletion requests
  static async updateCompanyStats(companyId: string) {
    const stats = await prisma.deletionRequest.aggregate({
      where: {
        companyId,
        status: { in: ['COMPLETED', 'FAILED', 'REJECTED'] }
      },
      _count: {
        _all: true
      }
    })

    const completedCount = await prisma.deletionRequest.count({
      where: {
        companyId,
        status: 'COMPLETED'
      }
    })

    await prisma.deletionRequest.aggregate({
      where: {
        companyId,
        status: 'COMPLETED',
        sentAt: { not: null },
        completedAt: { not: null }
      },
      _avg: {
        // This would need a computed field for response time in days
        // For now, we'll use a default calculation
      }
    })

    const successRate = stats._count._all > 0 
      ? (completedCount / stats._count._all) * 100 
      : 0

    return await this.updateCompany(companyId, {
      successRate: Math.round(successRate * 100) / 100
    })
  }

  // Get companies by category
  static async getCompaniesByCategory(category: CompanyCategory) {
    return await prisma.company.findMany({
      where: {
        category,
        isActive: true
      },
      orderBy: [
        { successRate: 'desc' },
        { name: 'asc' }
      ]
    })
  }

  // Get companies supporting specific jurisdiction
  static async getCompaniesByJurisdiction(jurisdiction: Jurisdiction) {
    return await prisma.company.findMany({
      where: {
        supportedJurisdictions: {
          has: jurisdiction
        },
        isActive: true
      },
      orderBy: [
        { successRate: 'desc' },
        { difficulty: 'asc' },
        { avgResponseTime: 'asc' }
      ]
    })
  }

  // Search companies
  static async searchCompanies(query: string, limit = 20) {
    return await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { website: { contains: query, mode: 'insensitive' } }
        ],
        isActive: true
      },
      take: limit,
      orderBy: [
        { successRate: 'desc' },
        { name: 'asc' }
      ]
    })
  }

  // Get company statistics
  static async getCompanyStatistics() {
    const [
      totalCompanies,
      activeCompanies,
      verifiedCompanies,
      categoryStats,
      jurisdictionStats,
      difficultyStats
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { isActive: true } }),
      prisma.company.count({ where: { isVerified: true } }),
      prisma.company.groupBy({
        by: ['category'],
        _count: { _all: true },
        where: { isActive: true }
      }),
      // Note: PostgreSQL doesn't support groupBy on array fields directly
      // This would need a custom query or different approach
      prisma.$queryRaw`
        SELECT unnest(supported_jurisdictions) as jurisdiction, COUNT(*) as count
        FROM companies 
        WHERE is_active = true 
        GROUP BY jurisdiction
      `,
      prisma.company.groupBy({
        by: ['difficulty'],
        _count: { _all: true },
        where: { isActive: true }
      })
    ])

    return {
      totalCompanies,
      activeCompanies,
      verifiedCompanies,
      categoryStats,
      jurisdictionStats,
      difficultyStats
    }
  }

  // Bulk import companies
  static async bulkImportCompanies(companies: CreateCompanyData[]) {
    const results = []
    
    for (const companyData of companies) {
      try {
        const company = await prisma.company.upsert({
          where: { name: companyData.name },
          update: {
            ...companyData,
            lastUpdated: new Date()
          },
          create: {
            ...companyData,
            lastUpdated: new Date()
          }
        })
        results.push({ success: true, company })
      } catch (error) {
        results.push({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error',
          companyName: companyData.name 
        })
      }
    }

    return results
  }

  // Verify company (admin action)
  static async verifyCompany(id: string, isVerified: boolean) {
    return await this.updateCompany(id, { isVerified })
  }

  // Get top performing companies
  static async getTopPerformingCompanies(limit = 10) {
    return await prisma.company.findMany({
      where: {
        isActive: true,
        successRate: { gt: 0 }
      },
      orderBy: [
        { successRate: 'desc' },
        { avgResponseTime: 'asc' }
      ],
      take: limit,
      include: {
        _count: {
          select: {
            deletionRequests: true
          }
        }
      }
    })
  }
}
