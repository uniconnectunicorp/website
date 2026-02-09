'use client'

import { useMutation } from '@tanstack/react-query'
import { getLeadSessionId, setLeadSession } from '@/lib/cookies'

async function sendLead(data) {
  const response = await fetch('/api/send-lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email || '',
      phone: data.phone,
      course: data.course,
      modality: data.modality,
      message: data.message,
      sessionId: getLeadSessionId(),
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao enviar formulário')
  }

  return response.json()
}

export function useSendLead({ onSuccess, onError } = {}) {
  return useMutation({
    mutationFn: sendLead,
    onSuccess: (result) => {
      if (result.sessionId && result.responsavel) {
        setLeadSession(result.sessionId, result.responsavel)
      }
      onSuccess?.(result)
    },
    onError: (error) => {
      console.error('Erro ao enviar lead:', error)
      onError?.(error)
    },
  })
}
