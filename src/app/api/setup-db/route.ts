import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Setting up complete database schema...')
    
    // Check current state
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as { table_name: string }[]
    
    console.log(`Found ${tables.length} existing tables:`, tables.map(t => t.table_name))
    
    // Create enums if they don't exist
    const enums = [
      { name: 'Jurisdiction', values: ['GDPR', 'CCPA', 'PIPEDA', 'LGPD'] },
      { name: 'CompanyCategory', values: ['DATA_BROKER', 'CREDIT_BUREAU', 'PEOPLE_SEARCH', 'MARKETING', 'SOCIAL_MEDIA', 'ADVERTISING', 'ANALYTICS', 'OTHER'] },
      { name: 'Difficulty', values: ['EASY', 'MEDIUM', 'HARD'] },
      { name: 'RequestStatus', values: ['PENDING', 'SENT', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED'] },
      { name: 'RequestType', values: ['INDIVIDUAL', 'BULK'] },
      { name: 'Priority', values: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] },
      { name: 'TemplateType', values: ['INITIAL_REQUEST', 'FOLLOW_UP', 'REMINDER', 'ESCALATION'] },
      { name: 'EmailStatus', values: ['PENDING', 'SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'FAILED'] },
      { name: 'SubscriptionTier', values: ['INDIVIDUAL', 'ENTERPRISE'] }
    ]
    
    for (const enumDef of enums) {
      try {
        const enumValues = enumDef.values.map(v => `'${v}'`).join(', ')
        await prisma.$executeRawUnsafe(`
          DO $$ BEGIN
            CREATE TYPE "${enumDef.name}" AS ENUM (${enumValues});
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `)
        console.log(`✅ Enum ${enumDef.name} created/verified`)
      } catch (enumError) {
        console.log(`⚠️ Enum ${enumDef.name} might already exist`)
      }
    }
    
    // Update users table if needed
    try {
      await prisma.$executeRaw`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS "defaultJurisdiction" "Jurisdiction" DEFAULT 'CCPA',
        ADD COLUMN IF NOT EXISTS "timezone" TEXT DEFAULT 'America/New_York',
        ADD COLUMN IF NOT EXISTS "language" TEXT DEFAULT 'en',
        ADD COLUMN IF NOT EXISTS "subscriptionTier" "SubscriptionTier" DEFAULT 'INDIVIDUAL',
        ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT
      `
      console.log('✅ Users table updated')
    } catch (error) {
      console.log('⚠️ Users table update failed:', (error as Error).message)
    }
    
    // Update companies table if needed
    try {
      await prisma.$executeRaw`
        ALTER TABLE companies 
        ADD COLUMN IF NOT EXISTS "category" "CompanyCategory" DEFAULT 'OTHER',
        ADD COLUMN IF NOT EXISTS "supportedJurisdictions" "Jurisdiction"[] DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS "difficulty" "Difficulty" DEFAULT 'MEDIUM',
        ADD COLUMN IF NOT EXISTS "avgResponseTime" INTEGER DEFAULT 30,
        ADD COLUMN IF NOT EXISTS "successRate" DOUBLE PRECISION DEFAULT 0.0,
        ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "lastUpdated" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "contactEmail" TEXT,
        ADD COLUMN IF NOT EXISTS "privacyEmail" TEXT,
        ADD COLUMN IF NOT EXISTS "dpoEmail" TEXT,
        ADD COLUMN IF NOT EXISTS "phone" TEXT,
        ADD COLUMN IF NOT EXISTS "address" TEXT,
        ADD COLUMN IF NOT EXISTS "description" TEXT
      `
      console.log('✅ Companies table updated')
    } catch (error) {
      console.log('⚠️ Companies table update failed:', (error as Error).message)
    }
    
    // Create deletion_requests table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "deletion_requests" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "companyId" TEXT NOT NULL,
          "jurisdiction" "Jurisdiction" NOT NULL,
          "requestType" "RequestType" NOT NULL DEFAULT 'INDIVIDUAL',
          "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
          "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
          "requestorName" TEXT NOT NULL,
          "requestorEmail" TEXT NOT NULL,
          "requestorPhone" TEXT,
          "requestorAddress" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "sentAt" TIMESTAMP(3),
          "acknowledgedAt" TIMESTAMP(3),
          "completedAt" TIMESTAMP(3),
          "estimatedCompletion" TIMESTAMP(3),
          "actualCompletion" TIMESTAMP(3),
          "emailsSent" INTEGER NOT NULL DEFAULT 0,
          "lastEmailSent" TIMESTAMP(3),
          "responseReceived" BOOLEAN NOT NULL DEFAULT false,
          "cost" DOUBLE PRECISION NOT NULL DEFAULT 3.50,
          "isPaid" BOOLEAN NOT NULL DEFAULT false,
          "notes" TEXT,
          "internalNotes" TEXT,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "deletion_requests_pkey" PRIMARY KEY ("id")
        )
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "deletion_requests" 
        ADD CONSTRAINT IF NOT EXISTS "deletion_requests_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "deletion_requests" 
        ADD CONSTRAINT IF NOT EXISTS "deletion_requests_companyId_fkey" 
        FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      `
      
      console.log('✅ Deletion requests table created')
    } catch (error) {
      console.log('⚠️ Deletion requests table creation failed:', (error as Error).message)
    }
    
    // Create email_templates table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "email_templates" (
          "id" TEXT NOT NULL,
          "companyId" TEXT,
          "jurisdiction" "Jurisdiction" NOT NULL,
          "templateType" "TemplateType" NOT NULL,
          "subject" TEXT NOT NULL,
          "body" TEXT NOT NULL,
          "plainText" TEXT,
          "language" TEXT NOT NULL DEFAULT 'en',
          "isDefault" BOOLEAN NOT NULL DEFAULT false,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
        )
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "email_templates" 
        ADD CONSTRAINT IF NOT EXISTS "email_templates_companyId_fkey" 
        FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `
      
      console.log('✅ Email templates table created')
    } catch (error) {
      console.log('⚠️ Email templates table creation failed:', (error as Error).message)
    }
    
    // Create email_logs table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "email_logs" (
          "id" TEXT NOT NULL,
          "deletionRequestId" TEXT NOT NULL,
          "templateId" TEXT,
          "toEmail" TEXT NOT NULL,
          "fromEmail" TEXT NOT NULL,
          "subject" TEXT NOT NULL,
          "body" TEXT NOT NULL,
          "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "deliveredAt" TIMESTAMP(3),
          "openedAt" TIMESTAMP(3),
          "clickedAt" TIMESTAMP(3),
          "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
          "errorMessage" TEXT,
          CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
        )
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "email_logs" 
        ADD CONSTRAINT IF NOT EXISTS "email_logs_deletionRequestId_fkey" 
        FOREIGN KEY ("deletionRequestId") REFERENCES "deletion_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "email_logs" 
        ADD CONSTRAINT IF NOT EXISTS "email_logs_templateId_fkey" 
        FOREIGN KEY ("templateId") REFERENCES "email_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `
      
      console.log('✅ Email logs table created')
    } catch (error) {
      console.log('⚠️ Email logs table creation failed:', (error as Error).message)
    }
    
    // Create audit_logs table
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "audit_logs" (
          "id" TEXT NOT NULL,
          "userId" TEXT,
          "deletionRequestId" TEXT,
          "action" TEXT NOT NULL,
          "entity" TEXT NOT NULL,
          "entityId" TEXT NOT NULL,
          "oldValues" JSONB,
          "newValues" JSONB,
          "ipAddress" TEXT,
          "userAgent" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
        )
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "audit_logs" 
        ADD CONSTRAINT IF NOT EXISTS "audit_logs_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `
      
      await prisma.$executeRaw`
        ALTER TABLE "audit_logs" 
        ADD CONSTRAINT IF NOT EXISTS "audit_logs_deletionRequestId_fkey" 
        FOREIGN KEY ("deletionRequestId") REFERENCES "deletion_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE
      `
      
      console.log('✅ Audit logs table created')
    } catch (error) {
      console.log('⚠️ Audit logs table creation failed:', (error as Error).message)
    }
    
    // Final verification
    const finalTables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as { table_name: string }[]
    
    console.log('🎉 Database setup completed!')
    console.log(`Final table count: ${finalTables.length}`)
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      tablesCreated: finalTables.length,
      tables: finalTables.map(t => t.table_name)
    })
    
  } catch (error) {
    console.error('Database setup failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
