import { useState, useEffect } from 'react'
import { CompanyCategory, Difficulty, Jurisdiction } from '@prisma/client'

export interface Company {
  id: string
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
  difficulty: Difficulty
  avgResponseTime: number
  successRate: number
  isActive: boolean
  isVerified: boolean
  lastUpdated: string
  createdAt: string
  updatedAt: string
  _count?: {
    deletionRequests: number
  }
}

export interface CompanyFilters {
  category?: CompanyCategory
  jurisdiction?: Jurisdiction
  difficulty?: Difficulty
  isActive?: boolean
  isVerified?: boolean
  search?: string
}

export interface CompaniesResponse {
  companies: Company[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useCompanies(filters: CompanyFilters = {}, page = 1, limit = 50) {
  const [data, setData] = useState<CompaniesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        })

        if (filters.category) params.append('category', filters.category)
        if (filters.jurisdiction) params.append('jurisdiction', filters.jurisdiction)
        if (filters.difficulty) params.append('difficulty', filters.difficulty)
        if (filters.search) params.append('search', filters.search)
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
        if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified.toString())

        const response = await fetch(`/api/companies?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch companies')
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [filters, page, limit])

  return { data, loading, error, refetch: () => setData(null) }
}

export function useCompany(id: string) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/companies/${id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Company not found')
          }
          throw new Error('Failed to fetch company')
        }

        const result = await response.json()
        setCompany(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompany()
    }
  }, [id])

  return { company, loading, error }
}

export function useCompanySearch(query: string, limit = 20) {
  const [results, setResults] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchCompanies = async () => {
      if (!query || query.trim().length < 2) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          q: query.trim(),
          limit: limit.toString()
        })

        const response = await fetch(`/api/companies/search?${params}`)
        
        if (!response.ok) {
          throw new Error('Failed to search companies')
        }

        const result = await response.json()
        setResults(result.results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCompanies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, limit])

  return { results, loading, error }
}

export async function createCompany(data: Partial<Company>) {
  const response = await fetch('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create company')
  }

  return response.json()
}

export async function updateCompany(id: string, data: Partial<Company>) {
  const response = await fetch(`/api/companies/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update company')
  }

  return response.json()
}

export async function deleteCompany(id: string) {
  const response = await fetch(`/api/companies/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete company')
  }

  return response.json()
}
