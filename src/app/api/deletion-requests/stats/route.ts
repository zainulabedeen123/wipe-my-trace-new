import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { DeletionRequestService } from '@/lib/services/deletion-request-service'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const includeGlobal = searchParams.get('global') === 'true'

    // Get user-specific stats
    const userStats = await DeletionRequestService.getDeletionRequestStatistics(userId)

    let globalStats = null
    if (includeGlobal) {
      // Only include global stats if user is admin (you'd check this based on your auth system)
      globalStats = await DeletionRequestService.getDeletionRequestStatistics()
    }

    return NextResponse.json({
      userStats,
      globalStats
    })
  } catch (error) {
    console.error('Error fetching deletion request statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
