"use server";

import { prisma } from "@/lib/prisma";

interface MatriculaFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  course?: string;
  status?: string;
  modalidade?: string;
  page?: number;
  perPage?: number;
}

export async function getMatriculas(filters: MatriculaFilters = {}) {
  try {
    const { search, startDate, endDate, course, status, modalidade, page = 1, perPage = 20 } = filters;
    const skip = (page - 1) * perPage;

    const where: any = {};

    if (search) {
      where.lead = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
          { email: { contains: search, mode: "insensitive" } },
          { cpf: { contains: search } },
        ],
      };
    }

    if (startDate || endDate) {
      where.dataInicio = {};
      if (startDate) where.dataInicio.gte = new Date(startDate);
      if (endDate) where.dataInicio.lte = new Date(endDate + "T23:59:59");
    }

    if (course) {
      where.lead = { ...where.lead, course: { contains: course, mode: "insensitive" } };
    }

    if (status) where.status = status;
    if (modalidade) where.modalidade = modalidade;

    const [matriculas, total] = await Promise.all([
      prisma.matricula.findMany({
        where,
        include: {
          lead: { include: { finance: true } },
        },
        orderBy: { dataInicio: "desc" },
        skip,
        take: perPage,
      }),
      prisma.matricula.count({ where }),
    ]);

    return {
      data: matriculas,
      total,
      pages: Math.ceil(total / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error("getMatriculas error:", error);
    return { data: [], total: 0, pages: 0, currentPage: 1 };
  }
}

export async function getMatriculaStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalMatriculas, ativas, concluidas, thisMonth, totalRevenue] = await Promise.all([
      prisma.matricula.count(),
      prisma.matricula.count({ where: { status: "ativa" } }),
      prisma.matricula.count({ where: { status: "concluida" } }),
      prisma.matricula.count({ where: { dataInicio: { gte: startOfMonth } } }),
      prisma.finance.aggregate({
        where: { type: "leadPayment" },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalMatriculas,
      ativas,
      concluidas,
      thisMonth,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  } catch (error) {
    console.error("getMatriculaStats error:", error);
    return { totalMatriculas: 0, ativas: 0, concluidas: 0, thisMonth: 0, totalRevenue: 0 };
  }
}

export async function criarMatricula(leadId: string, modalidade: string = "regular") {
  try {
    const count = await prisma.matricula.count();
    const numero = `UC-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const matricula = await prisma.matricula.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        numero,
        modalidade: modalidade as any,
      },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: `Matrícula criada: ${numero}`,
      },
    });

    return matricula;
  } catch (error) {
    console.error("criarMatricula error:", error);
    return null;
  }
}

export async function atualizarStatusMatricula(id: string, status: string, motivo?: string) {
  try {
    const data: any = { status };
    if (status === "cancelada") {
      data.dataCancelamento = new Date();
      if (motivo) data.motivoCancelamento = motivo;
    }
    if (status === "concluida") {
      data.dataConclusao = new Date();
    }

    return await prisma.matricula.update({ where: { id }, data });
  } catch (error) {
    console.error("atualizarStatusMatricula error:", error);
    return null;
  }
}

export async function getMatriculaByNumero(numero: string) {
  try {
    return await prisma.matricula.findUnique({
      where: { numero },
      include: {
        lead: {
          include: {
            finance: { include: { paymentMethod: true } },
            assignedUser: { select: { id: true, name: true, email: true } },
            history: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });
  } catch (error) {
    console.error("getMatriculaByNumero error:", error);
    return null;
  }
}

export async function emitirCertificado(id: string) {
  try {
    return await prisma.matricula.update({
      where: { id },
      data: { certificadoEmitido: true, dataCertificado: new Date() },
    });
  } catch (error) {
    console.error("emitirCertificado error:", error);
    return null;
  }
}
