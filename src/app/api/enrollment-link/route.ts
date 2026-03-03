import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, fullName, birthDate, cpf, rg, maritalStatus, phone, email, street, number, neighborhood, city, state, cep, paymentMethodId, installments } = body;

    if (!token || !fullName || !phone || !cpf || !paymentMethodId) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    if (!installments) {
      return NextResponse.json({ error: "Número de parcelas não informado." }, { status: 400 });
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

    // Update lead with personal data and move to "awaitingPayment" status
    // Matrícula e finance só serão criados quando o vendedor converter manualmente
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
        status: "awaitingPayment",
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
        action: `Dados de matrícula preenchidos via link. Pagamento: ${pm.name} - ${inst}x. Lead movido para Aguard. Pagamento. Aguardando conversão manual.`,
        fromStatus: lead.status,
        toStatus: "awaitingPayment",
        userId: link.sellerId,
      },
    });

    // Notificação para o vendedor
    await prisma.notificacao.create({
      data: {
        id: crypto.randomUUID(),
        userId: link.sellerId,
        titulo: "Lead preencheu dados de matrícula!",
        mensagem: `${fullName} preencheu os dados via link (${lead.course || "Curso"}). Pagamento: ${pm.name} - ${inst}x. Converta o lead para finalizar.`,
        tipo: "alerta",
        linkUrl: `/admin/crm-pipeline`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("enrollment-link API error:", error);
    return NextResponse.json({ error: "Erro ao processar matrícula." }, { status: 500 });
  }
}
