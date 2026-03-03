import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, fullName, birthDate, cpf, rg, maritalStatus, phone, email, street, number, neighborhood, city, state, cep, paymentMethodId, installments } = body;

    if (!token || !fullName || !phone || !cpf) {
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

    // Update lead with personal data and move to "enrolled" status
    // Payment method will be defined by the seller during manual conversion
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
        status: "enrolled",
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
        action: `Dados de matrícula preenchidos via link. Lead movido para Aguard. Pagamento. Aguardando definição de pagamento e conversão manual.`,
        fromStatus: lead.status,
        toStatus: "enrolled",
        userId: link.sellerId,
      },
    });

    // Notificação para o vendedor
    await prisma.notificacao.create({
      data: {
        id: crypto.randomUUID(),
        userId: link.sellerId,
        titulo: "Lead preencheu dados de matrícula!",
        mensagem: `${fullName} preencheu os dados via link (${lead.course || "Curso"}). Defina a forma de pagamento e converta o lead para finalizar.`,
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
