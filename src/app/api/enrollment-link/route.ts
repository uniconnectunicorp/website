import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, fullName, birthDate, cpf, rg, maritalStatus, phone, email, street, number, neighborhood, city, state, cep, paymentMethodId, installments } = body;

    if (!token || !fullName || !phone || !cpf || !paymentMethodId) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    // Find enrollment link
    const link = await prisma.enrollmentLink.findUnique({
      where: { token },
      include: { lead: true },
    });

    if (!link || link.used) {
      return NextResponse.json({ error: "Link inválido ou já utilizado." }, { status: 404 });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return NextResponse.json({ error: "Link expirado." }, { status: 410 });
    }

    const lead = link.lead;
    const pm = await prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm) {
      return NextResponse.json({ error: "Forma de pagamento não encontrada." }, { status: 400 });
    }

    const inst = parseInt(installments) || 1;
    const amount = lead.courseValue || 999.90;
    const feeAmount = amount * (pm.feePercentage / 100);
    const commissionAmount = pm.commissionType === "fixed"
      ? pm.commissionPercentage
      : amount * (pm.commissionPercentage / 100);
    const netAmount = amount - feeAmount;

    // Update lead with personal data and move to "enrolled" status
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        name: fullName,
        email: email || lead.email,
        phone: phone || lead.phone,
        cpf: cpf || lead.cpf,
        rg: rg || lead.rg,
        birthDate: birthDate || lead.birthDate,
        address: street || lead.address,
        houseNumber: number || lead.houseNumber,
        neighborhood: neighborhood || lead.neighborhood,
        city: city || lead.city,
        state: state || lead.state,
        zipCode: cep || lead.zipCode,
        civilStatus: maritalStatus || lead.civilStatus,
        paymentMethodId,
        installments: inst,
        status: "enrolled",
      },
    });

    // Create matrícula
    const count = await prisma.matricula.count();
    const numero = `UC-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    await prisma.matricula.create({
      data: {
        id: crypto.randomUUID(),
        leadId: lead.id,
        numero,
        modalidade: lead.modalidade || "regular",
      },
    });

    // Create finance entry
    await prisma.finance.create({
      data: {
        id: crypto.randomUUID(),
        leadId: lead.id,
        amount,
        netAmount,
        feeAmount,
        commissionAmount,
        installments: inst,
        type: "leadPayment",
        category: "matricula",
        description: `Matrícula ${numero} - ${lead.course || "Curso"} (via link)`,
        userId: link.sellerId,
        paymentMethodId,
        transactionDate: new Date(),
      },
    });

    // Mark enrollment link as used
    await prisma.enrollmentLink.update({
      where: { id: link.id },
      data: { used: true, usedAt: new Date() },
    });

    // History
    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId: lead.id,
        action: `Matrícula ${numero} realizada via link. Pagamento: ${pm.name} - ${inst}x. Lead movido para Matriculado.`,
        fromStatus: lead.status,
        toStatus: "enrolled",
        userId: link.sellerId,
      },
    });

    // Notificação para o vendedor (conversão deve ser manual)
    await prisma.notificacao.create({
      data: {
        id: crypto.randomUUID(),
        userId: link.sellerId,
        titulo: "Matrícula realizada via link!",
        mensagem: `${fullName} preencheu a matrícula ${numero} (${lead.course || "Curso"}). Pagamento: ${pm.name} - ${inst}x. Converta o lead manualmente.`,
        tipo: "alerta",
        linkUrl: `/admin/crm-pipeline`,
      },
    });

    return NextResponse.json({ success: true, numero });
  } catch (error) {
    console.error("enrollment-link API error:", error);
    return NextResponse.json({ error: "Erro ao processar matrícula." }, { status: 500 });
  }
}
