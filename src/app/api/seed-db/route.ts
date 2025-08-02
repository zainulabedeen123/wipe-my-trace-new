import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailTemplateService } from '@/lib/services/email-template-service'
import { Jurisdiction, CompanyCategory, Difficulty } from '@prisma/client'

export async function POST() {
  try {
    console.log('🌱 Seeding database with initial data...')

    // Create companies/data brokers
    const companies = [
      {
        name: 'Acxiom Corporation',
        website: 'acxiom.com',
        category: CompanyCategory.DATA_BROKER,
        description: 'Consumer data and analytics company that collects and sells personal information',
        contactEmail: 'privacy@acxiom.com',
        privacyEmail: 'privacy@acxiom.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR],
        difficulty: Difficulty.MEDIUM,
        avgResponseTime: 21,
        successRate: 85.0,
      },
      {
        name: 'Epsilon Data Management',
        website: 'epsilon.com',
        category: CompanyCategory.MARKETING,
        description: 'Email marketing and data services company',
        contactEmail: 'privacy@epsilon.com',
        privacyEmail: 'privacy@epsilon.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR],
        difficulty: Difficulty.EASY,
        avgResponseTime: 14,
        successRate: 92.0,
      },
      {
        name: 'LexisNexis Risk Solutions',
        website: 'risk.lexisnexis.com',
        category: CompanyCategory.DATA_BROKER,
        description: 'Background checks and data aggregation services',
        contactEmail: 'privacy@lexisnexis.com',
        privacyEmail: 'privacy@lexisnexis.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR, Jurisdiction.PIPEDA],
        difficulty: Difficulty.HARD,
        avgResponseTime: 35,
        successRate: 68.0,
      },
      {
        name: 'Experian Information Solutions',
        website: 'experian.com',
        category: CompanyCategory.CREDIT_BUREAU,
        description: 'Credit reporting and data services',
        contactEmail: 'privacy@experian.com',
        privacyEmail: 'privacy@experian.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR],
        difficulty: Difficulty.MEDIUM,
        avgResponseTime: 28,
        successRate: 78.0,
      },
      {
        name: 'TransUnion LLC',
        website: 'transunion.com',
        category: CompanyCategory.CREDIT_BUREAU,
        description: 'Credit reporting and risk management',
        contactEmail: 'privacy@transunion.com',
        privacyEmail: 'privacy@transunion.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR],
        difficulty: Difficulty.MEDIUM,
        avgResponseTime: 25,
        successRate: 82.0,
      },
      {
        name: 'Equifax Inc.',
        website: 'equifax.com',
        category: CompanyCategory.CREDIT_BUREAU,
        description: 'Credit reporting and information services',
        contactEmail: 'privacy@equifax.com',
        privacyEmail: 'privacy@equifax.com',
        supportedJurisdictions: [Jurisdiction.CCPA, Jurisdiction.GDPR],
        difficulty: Difficulty.MEDIUM,
        avgResponseTime: 30,
        successRate: 75.0,
      },
      {
        name: 'Spokeo Inc.',
        website: 'spokeo.com',
        category: CompanyCategory.PEOPLE_SEARCH,
        description: 'People search and background information',
        contactEmail: 'privacy@spokeo.com',
        privacyEmail: 'privacy@spokeo.com',
        supportedJurisdictions: [Jurisdiction.CCPA],
        difficulty: Difficulty.EASY,
        avgResponseTime: 12,
        successRate: 95.0,
      },
      {
        name: 'BeenVerified LLC',
        website: 'beenverified.com',
        category: CompanyCategory.PEOPLE_SEARCH,
        description: 'Background checks and people search',
        contactEmail: 'privacy@beenverified.com',
        privacyEmail: 'privacy@beenverified.com',
        supportedJurisdictions: [Jurisdiction.CCPA],
        difficulty: Difficulty.EASY,
        avgResponseTime: 10,
        successRate: 88.0,
      },
      {
        name: 'Intelius Inc.',
        website: 'intelius.com',
        category: CompanyCategory.PEOPLE_SEARCH,
        description: 'Public records and background reports',
        contactEmail: 'privacy@intelius.com',
        privacyEmail: 'privacy@intelius.com',
        supportedJurisdictions: [Jurisdiction.CCPA],
        difficulty: Difficulty.MEDIUM,
        avgResponseTime: 18,
        successRate: 76.0,
      },
      {
        name: 'PeopleFinders.com',
        website: 'peoplefinders.com',
        category: CompanyCategory.PEOPLE_SEARCH,
        description: 'People search and public records',
        contactEmail: 'privacy@peoplefinders.com',
        privacyEmail: 'privacy@peoplefinders.com',
        supportedJurisdictions: [Jurisdiction.CCPA],
        difficulty: Difficulty.EASY,
        avgResponseTime: 15,
        successRate: 90.0,
      },
    ]

    console.log('Creating companies...')
    let companiesCreated = 0
    for (const company of companies) {
      try {
        await prisma.company.upsert({
          where: { name: company.name },
          update: company,
          create: company,
        })
        companiesCreated++
      } catch (error) {
        console.error(`Failed to create company ${company.name}:`, error)
      }
    }

    console.log(`✅ ${companiesCreated} companies created/updated`)

    // Seed email templates
    console.log('Creating email templates...')
    try {
      await EmailTemplateService.seedDefaultTemplates()
      console.log('✅ Email templates created')
    } catch (error) {
      console.error('Failed to create email templates:', error)
    }

    // Get final counts
    const [companyCount, templateCount] = await Promise.all([
      prisma.company.count(),
      prisma.emailTemplate.count()
    ])

    console.log('🌱 Database seeded successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      companiesCreated,
      totalCompanies: companyCount,
      totalTemplates: templateCount
    })

  } catch (error) {
    console.error('Database seeding failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
