'use client'

import { useQuery } from '@tanstack/react-query'
import { getLeadSessionId, getLeadResponsavel, setLeadSession } from '@/lib/cookies'

async function fetchLeadSession(sessionId) {
  const headers = {}
  if (sessionId) {
    headers['x-lead-session'] = sessionId
  }

  const response = await fetch('/api/lead-session', { headers })

  if (!response.ok) {
    throw new Error('Erro ao obter sessão')
  }

  return response.json()
}

export function useLeadSession() {
  const existingSessionId = getLeadSessionId()
  const existingResponsavel = getLeadResponsavel()

  return useQuery({
    queryKey: ['lead-session', existingSessionId],
    queryFn: () => fetchLeadSession(existingSessionId),
    enabled: !existingSessionId || !existingResponsavel,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
    select: (data) => {
      if (data.success && data.sessionId && data.responsavel) {
        setLeadSession(data.sessionId, data.responsavel)
      }
      return {
        sessionId: data.sessionId || existingSessionId,
        responsavel: data.responsavel || existingResponsavel,
      }
    },
    placeholderData: existingSessionId && existingResponsavel
      ? { sessionId: existingSessionId, responsavel: existingResponsavel }
      : undefined,
  })
}
