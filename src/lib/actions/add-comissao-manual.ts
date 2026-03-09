"use server";

import { prisma } from "@/lib/prisma";
import { createLogFromSession } from "@/lib/actions/logs";
import { publishCRMEvent } from "@/lib/realtime-crm";

export async function addCommissionManually(leadId: string, commissionAmount: number) {
  try {
    // Buscar lead e método de pagamento
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        paymentMethod: true,
        matricula: true,
      },
    });

    if (!lead) {
      return { error: "Lead não encontrado" };
    }

    if (lead.status !== "converted") {
      return { error: "Lead não está convertido" };
    }

    // Verificar se já existe entrada financeira
    const existingFinance = await prisma.finance.findFirst({
      where: {
        leadId,
        type: "leadPayment",
      },
    });

    if (existingFinance) {
      return { error: "Este lead já possui comissão registrada" };
    }

    // Criar entrada financeira manual
    const financeId = crypto.randomUUID();
    await prisma.finance.create({
      data: {
        id: financeId,
        leadId,
        amount: 0, // Boleto não entra como receita
        netAmount: 0,
        feeAmount: 0,
        commissionAmount,
        installments: 1,
        type: "leadPayment",
        category: "matricula",
        description: `Comissão manual - Matrícula ${lead.matricula?.numero || "N/A"} - ${lead.course || "Curso"} (${lead.paymentMethod?.name})`,
        userId: lead.assignedTo,
        paymentMethodId: lead.paymentMethodId,
        transactionDate: new Date(),
      },
    });

    // Criar log
    await createLogFromSession({
      action: "Comissão manual adicionada",
      entity: "finance",
      entityId: financeId,
      detail: `Comissão de R$ ${commissionAmount.toFixed(2)} adicionada manualmente para lead ${lead.name} (${lead.course})`,
    });

    await publishCRMEvent({ type: "lead_pipeline_changed", leadId });

    return { 
      success: true, 
      message: `Comissão de R$ ${commissionAmount.toFixed(2)} registrada com sucesso!` 
    };

  } catch (error) {
    console.error("addCommissionManually error:", error);
    return { error: "Erro ao adicionar comissão manual" };
  }
}
