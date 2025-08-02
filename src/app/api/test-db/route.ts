import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to database!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('✅ Query successful')
    
    // Check if any tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    ` as { table_name: string }[]

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      tablesCount: tables.length,
      tables: tables.map((t) => t.table_name),
      version: (result as { version: string }[])[0]?.version?.substring(0, 50) + '...'
    })
    
  } catch (error) {
    console.error('Database connection failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
