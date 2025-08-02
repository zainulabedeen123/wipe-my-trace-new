import { useState } from 'react'

export interface EmailResult {
  success: boolean
  messageId?: string
  provider?: string
  emailLogId?: string
  error?: string
}

export function useEmailSending() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendDeletionRequestEmail = async (requestId: string): Promise<EmailResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/deletion-requests/${requestId}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const result = await response.json()
      return {
        success: true,
        messageId: result.messageId,
        provider: result.provider,
        emailLogId: result.emailLogId
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const sendFollowUpEmail = async (requestId: string): Promise<EmailResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/deletion-requests/${requestId}/follow-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send follow-up email')
      }

      const result = await response.json()
      return {
        success: true,
        messageId: result.messageId,
        provider: result.provider,
        emailLogId: result.emailLogId
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send follow-up email'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const sendBulkEmails = async (requestIds: string[]): Promise<{
    success: boolean
    results?: any[]
    successCount?: number
    failureCount?: number
    error?: string
  }> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/deletion-requests/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestIds })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send bulk emails')
      }

      const result = await response.json()
      return {
        success: true,
        results: result.results,
        successCount: result.successCount,
        failureCount: result.failureCount
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send bulk emails'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    sendDeletionRequestEmail,
    sendFollowUpEmail,
    sendBulkEmails
  }
}

export async function generateEmailPreview(requestId: string) {
  const response = await fetch(`/api/deletion-requests/${requestId}/email`)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to generate email preview')
  }

  return response.json()
}
