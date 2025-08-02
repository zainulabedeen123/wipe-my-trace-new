import { useState, useEffect } from 'react'
import { Jurisdiction, RequestType, RequestStatus, Priority } from '@prisma/client'

export interface DeletionRequest {
  id: string
  userId: string
  companyId: string
  jurisdiction: Jurisdiction
  requestType: RequestType
  status: RequestStatus
  priority: Priority
  requestorName: string
  requestorEmail: string
  requestorPhone?: string
  requestorAddress?: string
  createdAt: string
  sentAt?: string
  acknowledgedAt?: string
  completedAt?: string
  estimatedCompletion?: string
  actualCompletion?: string
  emailsSent: number
  lastEmailSent?: string
  responseReceived: boolean
  cost: number
  isPaid: boolean
  notes?: string
  internalNotes?: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  company?: {
    id: string
    name: string
    category: string
    difficulty: string
  }
  _count?: {
    emailLogs: number
  }
}

export interface DeletionRequestFilters {
  status?: RequestStatus
  jurisdiction?: Jurisdiction
  requestType?: RequestType
  companyId?: string
  dateFrom?: string
  dateTo?: string
}

export interface DeletionRequestsResponse {
  requests: DeletionRequest[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface DeletionRequestStats {
  totalRequests: number
  pendingRequests: number
  sentRequests: number
  inProgressRequests: number
  completedRequests: number
  failedRequests: number
  successRate: number
  totalCost: number
  avgResponseTime: number
}

export function useDeletionRequests(filters: DeletionRequestFilters = {}, page = 1, limit = 20) {
  const [data, setData] = useState<DeletionRequestsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        })

        if (filters.status) params.append('status', filters.status)
        if (filters.jurisdiction) params.append('jurisdiction', filters.jurisdiction)
        if (filters.requestType) params.append('requestType', filters.requestType)
        if (filters.companyId) params.append('companyId', filters.companyId)
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
        if (filters.dateTo) params.append('dateTo', filters.dateTo)

        const response = await fetch(`/api/deletion-requests?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch deletion requests')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [filters, page, limit])

  return { data, loading, error, refetch: () => setData(null) }
}

export function useDeletionRequest(id: string) {
  const [request, setRequest] = useState<DeletionRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/deletion-requests/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Deletion request not found')
          }
          throw new Error('Failed to fetch deletion request')
        }

        const result = await response.json()
        setRequest(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRequest()
    }
  }, [id])

  return { request, loading, error }
}

export function useDeletionRequestStats() {
  const [stats, setStats] = useState<DeletionRequestStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/deletion-requests/stats')
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }

        const result = await response.json()
        setStats(result.userStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

export async function createDeletionRequest(data: {
  companyId: string
  jurisdiction: Jurisdiction
  requestType?: RequestType
  priority?: Priority
  requestorName: string
  requestorEmail: string
  requestorPhone?: string
  requestorAddress?: string
  cost?: number
}) {
  const response = await fetch('/api/deletion-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create deletion request')
  }

  return response.json()
}

export async function createBulkDeletionRequests(data: {
  companyIds: string[]
  jurisdiction: Jurisdiction
  requestorName: string
  requestorEmail: string
  requestorPhone?: string
  requestorAddress?: string
}) {
  const response = await fetch('/api/deletion-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data,
      requestType: RequestType.BULK
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create bulk deletion requests')
  }

  return response.json()
}

export async function updateDeletionRequest(id: string, data: {
  notes?: string
  responseReceived?: boolean
}) {
  const response = await fetch(`/api/deletion-requests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update deletion request')
  }

  return response.json()
}

export async function cancelDeletionRequest(id: string) {
  const response = await fetch(`/api/deletion-requests/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to cancel deletion request')
  }

  return response.json()
}

export async function generateRequestEmail(id: string) {
  const response = await fetch(`/api/deletion-requests/${id}/email`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate email')
  }

  return response.json()
}
