import { NextRequest, NextResponse } from 'next/server'
import { EmailJobs } from '@/lib/jobs/email-jobs'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized (e.g., from a cron service or admin)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { job } = body

    let result

    switch (job) {
      case 'pending':
        result = await EmailJobs.processPendingRequests()
        break
      case 'followups':
        result = await EmailJobs.sendFollowUpEmails()
        break
      case 'overdue':
        result = await EmailJobs.markOverdueRequests()
        break
      case 'summaries':
        result = await EmailJobs.sendDailySummaries()
        break
      case 'all':
        result = await EmailJobs.runAllJobs()
        break
      default:
        return NextResponse.json(
          { error: 'Invalid job type. Use: pending, followups, overdue, summaries, or all' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      job,
      result
    })
  } catch (error) {
    console.error('Error running email job:', error)
    return NextResponse.json(
      { error: 'Failed to run email job' },
      { status: 500 }
    )
  }
}
