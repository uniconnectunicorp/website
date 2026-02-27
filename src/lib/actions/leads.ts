"use server";

import { prisma } from "@/lib/prisma";

export async function getLeadsPipeline(options?: {
  search?: string;
  sellerId?: string;
  userRole?: string;
  userId?: string;
}) {
  try {
    const { search, sellerId, userRole, userId } = options || {};

    const where: any = {};

    // Role-based filtering: sellers only see their own leads
    if (userRole === "seller" && userId) {
      where.assignedTo = userId;
    } else if (sellerId) {
      where.assignedTo = sellerId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { course: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedUser: { select: { id: true, name: true } },
        paymentMethod: { select: { name: true } },
        enrollmentLink: { select: { token: true, used: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const columns: Record<string, typeof leads> = {
      pending: [],
      contacted: [],
      negociating: [],
      confirmPayment: [],
      converted: [],
      lost: [],
    };

    leads.forEach((lead) => {
      // For converted/lost, only show today's
      if (lead.status === "converted" || lead.status === "lost") {
        const leadDate = lead.convertedAt || lead.lostAt || lead.updatedAt;
        if (new Date(leadDate) >= today) {
          columns[lead.status]?.push(lead);
        }
      } else {
        columns[lead.status]?.push(lead);
      }
    });

    return columns;
  } catch (error) {
    console.error("getLeadsPipeline error:", error);
    return {};
  }
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  userId?: string,
  extra?: { lossReason?: string }
) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    const data: any = { status: newStatus };

    if (newStatus === "lost") {
      data.lossReason = extra?.lossReason || "Não informado";
      data.lostAt = new Date();
      // Save stages before loss
      const stageOrder = ["pending", "contacted", "negociating", "confirmPayment"];
      const currentIdx = stageOrder.indexOf(lead.status);
      data.stagesBeforeLoss = stageOrder.slice(0, currentIdx + 1).join(",");
    }

    if (newStatus === "converted") {
      data.convertedAt = new Date();
    }

    const updated = await prisma.lead.update({
      where: { id: leadId },
      data,
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: newStatus === "lost"
          ? `Lead marcado como perdido: ${extra?.lossReason || "Não informado"}`
          : `Status alterado para ${newStatus}`,
        fromStatus: lead.status,
        toStatus: newStatus,
        userId,
      },
    });

    return updated;
  } catch (error) {
    console.error("updateLeadStatus error:", error);
    return null;
  }
}

export async function convertLead(
  leadId: string,
  paymentMethodId: string,
  installments: number,
  userId: string
) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { error: "Lead não encontrado" };

    const pm = await prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm) return { error: "Forma de pagamento não encontrada" };

    const amount = lead.courseValue || 999.90;
    const feeAmount = amount * (pm.feePercentage / 100);
    const netAmount = amount - feeAmount;

    // Update lead
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: "converted",
        convertedAt: new Date(),
        paymentMethodId,
        installments,
      },
    });

    // Create matrícula
    const count = await prisma.matricula.count();
    const numero = `UC-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    await prisma.matricula.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        numero,
        modalidade: lead.modalidade || "regular",
      },
    });

    // Create finance entry
    await prisma.finance.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        amount,
        netAmount,
        feeAmount,
        installments,
        type: "leadPayment",
        category: "matricula",
        description: `Matrícula ${numero} - ${lead.course || "Curso"}`,
        userId: lead.assignedTo || userId,
        paymentMethodId,
        transactionDate: new Date(),
      },
    });

    // History
    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: `Lead convertido! Pagamento: ${pm.name} - ${installments}x`,
        fromStatus: lead.status,
        toStatus: "converted",
        userId,
      },
    });

    return { success: true, numero };
  } catch (error) {
    console.error("convertLead error:", error);
    return { error: "Erro ao converter lead" };
  }
}

export async function generateEnrollmentLink(leadId: string, sellerId: string) {
  try {
    // Check if link already exists
    const existing = await prisma.enrollmentLink.findUnique({ where: { leadId } });
    if (existing && !existing.used) {
      return { token: existing.token, url: `/matricular/${existing.token}` };
    }

    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

    await prisma.enrollmentLink.upsert({
      where: { leadId },
      update: { token, used: false, usedAt: null, sellerId },
      create: {
        id: crypto.randomUUID(),
        token,
        leadId,
        sellerId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: "Link de matrícula gerado",
        userId: sellerId,
      },
    });

    return { token, url: `/matricular/${token}` };
  } catch (error) {
    console.error("generateEnrollmentLink error:", error);
    return null;
  }
}

export async function getLeadById(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        history: { orderBy: { createdAt: "desc" } },
        finance: { include: { paymentMethod: true } },
        assignedUser: { select: { name: true } },
        enrollmentLink: true,
        matricula: true,
      },
    });
    return lead;
  } catch (error) {
    console.error("getLeadById error:", error);
    return null;
  }
}

export async function updateLeadValue(leadId: string, value: number, userId: string) {
  try {
    // Get seller config to enforce min/max
    const seller = await prisma.user.findUnique({
      where: { id: userId },
      include: { sellerConfig: true },
    });

    if (seller?.sellerConfig) {
      const { minValue, maxValue } = seller.sellerConfig;
      if (value < minValue || value > maxValue) {
        return { error: `Valor deve ser entre R$ ${minValue} e R$ ${maxValue}` };
      }
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: { courseValue: value },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: `Valor do curso alterado para R$ ${value.toFixed(2)}`,
        userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateLeadValue error:", error);
    return { error: "Erro ao atualizar valor" };
  }
}

export async function addLeadNote(leadId: string, note: string) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return null;

    const currentNotes = lead.notes || "";
    const timestamp = new Date().toLocaleString("pt-BR");
    const newNotes = currentNotes
      ? `${currentNotes}\n[${timestamp}] ${note}`
      : `[${timestamp}] ${note}`;

    await prisma.lead.update({
      where: { id: leadId },
      data: { notes: newNotes },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: `Observação adicionada: ${note}`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("addLeadNote error:", error);
    return null;
  }
}

export async function updateLeadData(leadId: string, data: any) {
  try {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data,
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: "Dados atualizados",
      },
    });

    return lead;
  } catch (error) {
    console.error("updateLeadData error:", error);
    return null;
  }
}

export async function addLeadManually(data: {
  name: string;
  phone: string;
  course?: string;
  assignedTo: string;
}) {
  try {
    // Check duplicate phone
    const normalized = data.phone.replace(/\D/g, "");
    const existing = await prisma.lead.findFirst({
      where: { phone: { contains: normalized } },
    });

    if (existing) {
      return { error: "Já existe um lead com este telefone", existingId: existing.id };
    }

    const lead = await prisma.lead.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        phone: data.phone,
        course: data.course || null,
        assignedTo: data.assignedTo,
        source: "manual",
        status: "pending",
      },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId: lead.id,
        action: "Lead criado manualmente",
        toStatus: "pending",
        userId: data.assignedTo,
      },
    });

    return { success: true, lead };
  } catch (error) {
    console.error("addLeadManually error:", error);
    return { error: "Erro ao criar lead" };
  }
}

export async function mergeLeads(keepId: string, removeId: string, userId: string) {
  try {
    const remove = await prisma.lead.findUnique({ where: { id: removeId } });
    if (!remove) return { error: "Lead não encontrado" };

    // Merge: copy missing fields from remove to keep
    const keep = await prisma.lead.findUnique({ where: { id: keepId } });
    if (!keep) return { error: "Lead de destino não encontrado" };

    const updates: any = {};
    if (!keep.email && remove.email) updates.email = remove.email;
    if (!keep.cpf && remove.cpf) updates.cpf = remove.cpf;
    if (!keep.course && remove.course) updates.course = remove.course;
    if (!keep.courseValue && remove.courseValue) updates.courseValue = remove.courseValue;
    if (!keep.city && remove.city) updates.city = remove.city;
    if (!keep.state && remove.state) updates.state = remove.state;

    if (Object.keys(updates).length > 0) {
      await prisma.lead.update({ where: { id: keepId }, data: updates });
    }

    // Move history
    await prisma.leadHistory.updateMany({
      where: { leadId: removeId },
      data: { leadId: keepId },
    });

    // Delete the duplicate
    await prisma.lead.delete({ where: { id: removeId } });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId: keepId,
        action: `Lead mesclado com ${remove.name} (${remove.phone})`,
        userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("mergeLeads error:", error);
    return { error: "Erro ao mesclar leads" };
  }
}

export async function getPaymentMethods(onlyVisible?: boolean) {
  try {
    const where: any = { active: true };
    if (onlyVisible) where.visibleOnEnrollment = true;

    return await prisma.paymentMethod.findMany({
      where,
      orderBy: [{ type: "asc" }, { maxInstallments: "asc" }],
    });
  } catch (error) {
    console.error("getPaymentMethods error:", error);
    return [];
  }
}

export async function getSellers() {
  try {
    return await prisma.user.findMany({
      where: { role: "seller", active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("getSellers error:", error);
    return [];
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["admin", "director", "manager", "seller"] as any },
        active: true,
      },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    });
    return users;
  } catch (error) {
    console.error("getUsers error:", error);
    return [];
  }
}
