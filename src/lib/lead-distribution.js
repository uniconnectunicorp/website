import { prisma } from '@/lib/prisma'

function normalizePhone(phone) {
  if (!phone) return null
  const normalized = String(phone).replace(/\D/g, '')
  return normalized || null
}

export function isLeadDistributionEnabled() {
  if (process.env.LEAD_DISTRIBUTION_V2 !== 'true') {
    return false
  }

  return Boolean(
    prisma &&
    prisma.leadSession &&
    prisma.leadDistributionState &&
    prisma.leadDistributionEvent
  )
}

export async function getActiveLeadSellers() {
  if (!isLeadDistributionEnabled()) return []

  return prisma.user.findMany({
    where: {
      role: 'seller',
      active: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

async function createDistributionEvent(data) {
  if (!isLeadDistributionEnabled()) return null

  try {
    return await prisma.leadDistributionEvent.create({
      data: {
        id: crypto.randomUUID(),
        sessionId: data.sessionId || null,
        sellerId: data.sellerId || null,
        responsavel: data.responsavel || null,
        channel: data.channel,
        eventType: data.eventType,
        target: data.target || null,
        leadName: data.leadName || null,
        phone: normalizePhone(data.phone),
        metadata: data.metadata || undefined,
      },
    })
  } catch (error) {
    console.error('createDistributionEvent error:', error)
    return null
  }
}

export async function assignNextLeadSeller(channel = 'website') {
  if (!isLeadDistributionEnabled()) return null

  const sellers = await getActiveLeadSellers()
  if (sellers.length === 0) {
    return {
      responsavel: 'Equipe',
      sellerId: null,
      counterValue: null,
      seller: null,
    }
  }

  await prisma.leadDistributionState.upsert({
    where: { id: channel },
    update: {},
    create: {
      id: channel,
      counter: 0,
    },
  })

  const rows = await prisma.$queryRaw`
    UPDATE lead_distribution_state
    SET counter = counter + 1,
        "updatedAt" = NOW()
    WHERE id = ${channel}
    RETURNING counter - 1 as previous_counter, counter as new_counter
  `

  const previousCounter = Number(rows?.[0]?.previous_counter ?? 0)
  const newCounter = Number(rows?.[0]?.new_counter ?? previousCounter + 1)
  const selectedSeller = sellers[previousCounter % sellers.length] || sellers[0]

  await prisma.leadDistributionState.update({
    where: { id: channel },
    data: {
      lastSellerId: selectedSeller.id,
    },
  })

  return {
    responsavel: selectedSeller.name,
    sellerId: selectedSeller.id,
    counterValue: newCounter,
    seller: selectedSeller,
  }
}

export async function getLeadSessionContext(sessionId) {
  if (!isLeadDistributionEnabled() || !sessionId) return null

  try {
    return await prisma.leadSession.findUnique({
      where: { sessionId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('getLeadSessionContext error:', error)
    return null
  }
}

export async function getOrCreateLeadSession({ sessionId, phone, channel = 'website', source = 'website' } = {}) {
  if (!isLeadDistributionEnabled()) return null

  const normalizedPhone = normalizePhone(phone)

  if (normalizedPhone) {
    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: {
          contains: normalizedPhone,
        },
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (existingLead?.assignedTo) {
      const duplicateSessionId = existingLead.sessionId || sessionId || crypto.randomUUID()
      await createDistributionEvent({
        sessionId: duplicateSessionId,
        sellerId: existingLead.assignedTo,
        responsavel: existingLead.assignedUser?.name || 'Equipe',
        channel,
        eventType: 'duplicate_phone_detected',
        phone: normalizedPhone,
        metadata: {
          leadId: existingLead.id,
          source: existingLead.source || null,
        },
      })

      return {
        sessionId: duplicateSessionId,
        responsavel: existingLead.assignedUser?.name || 'Equipe',
        sellerId: existingLead.assignedTo,
        isDuplicate: true,
        counterValue: null,
        createdAt: existingLead.createdAt,
      }
    }

    const existingPhoneSession = await prisma.leadSession.findFirst({
      where: { phone: normalizedPhone },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (existingPhoneSession) {
      await createDistributionEvent({
        sessionId: existingPhoneSession.sessionId,
        sellerId: existingPhoneSession.sellerId,
        responsavel: existingPhoneSession.responsavel,
        channel,
        eventType: 'duplicate_phone_detected',
        phone: normalizedPhone,
        metadata: {
          matchedBy: 'lead_session',
        },
      })

      return {
        sessionId: existingPhoneSession.sessionId,
        responsavel: existingPhoneSession.responsavel,
        sellerId: existingPhoneSession.sellerId || existingPhoneSession.seller?.id || null,
        isDuplicate: true,
        counterValue: existingPhoneSession.counterValue,
        createdAt: existingPhoneSession.createdAt,
      }
    }
  }

  if (sessionId) {
    const existingSession = await getLeadSessionContext(sessionId)
    if (existingSession) {
      if (normalizedPhone && !existingSession.phone) {
        await prisma.leadSession.update({
          where: { sessionId },
          data: { phone: normalizedPhone },
        })
      }

      return {
        sessionId: existingSession.sessionId,
        responsavel: existingSession.responsavel,
        sellerId: existingSession.sellerId || existingSession.seller?.id || null,
        isDuplicate: false,
        counterValue: existingSession.counterValue,
        createdAt: existingSession.createdAt,
      }
    }
  }

  const orphanSession = await prisma.leadSession.findFirst({
    where: {
      phone: null,
      channel,
      createdAt: {
        gte: new Date(Date.now() - 30 * 60 * 1000),
      },
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (orphanSession) {
    if (normalizedPhone) {
      await prisma.leadSession.update({
        where: { sessionId: orphanSession.sessionId },
        data: { phone: normalizedPhone },
      })
    }

    return {
      sessionId: orphanSession.sessionId,
      responsavel: orphanSession.responsavel,
      sellerId: orphanSession.sellerId || orphanSession.seller?.id || null,
      isDuplicate: false,
      counterValue: orphanSession.counterValue,
      createdAt: orphanSession.createdAt,
    }
  }

  const assignment = await assignNextLeadSeller(channel)
  const newSessionId = sessionId || crypto.randomUUID()

  await prisma.leadSession.create({
    data: {
      sessionId: newSessionId,
      phone: normalizedPhone,
      responsavel: assignment?.responsavel || 'Equipe',
      sellerId: assignment?.sellerId || null,
      counterValue: assignment?.counterValue ?? null,
      channel,
      source,
    },
  })

  await createDistributionEvent({
    sessionId: newSessionId,
    sellerId: assignment?.sellerId || null,
    responsavel: assignment?.responsavel || 'Equipe',
    channel,
    eventType: 'session_created',
    phone: normalizedPhone,
    metadata: {
      source,
      counterValue: assignment?.counterValue ?? null,
    },
  })

  return {
    sessionId: newSessionId,
    responsavel: assignment?.responsavel || 'Equipe',
    sellerId: assignment?.sellerId || null,
    isDuplicate: false,
    counterValue: assignment?.counterValue ?? null,
    createdAt: new Date(),
  }
}

export async function trackWhatsappClick({ sessionId, responsavel, number, leadName, leadPhone } = {}) {
  if (!isLeadDistributionEnabled()) return null

  const session = sessionId ? await getLeadSessionContext(sessionId) : null

  return createDistributionEvent({
    sessionId: sessionId || session?.sessionId || null,
    sellerId: session?.sellerId || session?.seller?.id || null,
    responsavel: responsavel || session?.responsavel || session?.seller?.name || null,
    channel: 'whatsapp',
    eventType: 'whatsapp_click',
    target: number || null,
    leadName: leadName || null,
    phone: leadPhone || session?.phone || null,
    metadata: {
      targetNumber: number || null,
    },
  })
}

export async function trackLeadEmail({ sessionId, responsavel, sellerId, leadName, phone } = {}) {
  if (!isLeadDistributionEnabled()) return null

  return createDistributionEvent({
    sessionId: sessionId || null,
    sellerId: sellerId || null,
    responsavel: responsavel || null,
    channel: 'email',
    eventType: 'lead_email_sent',
    leadName: leadName || null,
    phone: phone || null,
  })
}
