"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface AlunoFilters {
  search?: string;
  course?: string;
  page?: number;
  perPage?: number;
}

export async function getAlunos(filters: AlunoFilters = {}) {
  try {
    const { search, course, page = 1, perPage = 20 } = filters;
    const skip = (page - 1) * perPage;

    const where: any = {
      status: "converted",
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
        { cpf: { contains: search } },
      ];
    }

    if (course) {
      where.course = { contains: course, mode: "insensitive" };
    }

    const [alunos, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: { finance: true, matricula: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      data: alunos,
      total,
      pages: Math.ceil(total / perPage),
      currentPage: page,
    };
  } catch (error) {
    console.error("getAlunos error:", error);
    return { data: [], total: 0, pages: 0, currentPage: 1 };
  }
}

export async function getAlunoById(id: string) {
  try {
    const aluno = await prisma.lead.findUnique({
      where: { id },
      include: {
        history: { orderBy: { createdAt: "desc" } },
        finance: true,
        matricula: true,
      },
    });
    return aluno;
  } catch (error) {
    console.error("getAlunoById error:", error);
    return null;
  }
}

export async function updateAluno(id: string, data: any) {
  try {
    const aluno = await prisma.lead.update({
      where: { id },
      data,
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId: id,
        action: "Dados do aluno atualizados",
      },
    });

    return aluno;
  } catch (error) {
    console.error("updateAluno error:", error);
    return null;
  }
}

export async function toggleNotaEmitida(leadId: string, emitida: boolean) {
  try {
    const matricula = await prisma.matricula.findUnique({ where: { leadId } });
    if (!matricula) return { error: "Matrícula não encontrada" };

    await prisma.matricula.update({
      where: { leadId },
      data: {
        notaEmitida: emitida,
        dataNotaEmitida: emitida ? new Date() : null,
      },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId,
        action: emitida
          ? `Nota fiscal emitida para matrícula ${matricula.numero}`
          : `Nota fiscal removida da matrícula ${matricula.numero}`,
      },
    });

    revalidatePath("/admin/matriculas");
    revalidatePath("/admin/alunos");

    return { success: true };
  } catch (error) {
    console.error("toggleNotaEmitida error:", error);
    return { error: "Erro ao atualizar nota" };
  }
}

export async function addAlunoObservacao(id: string, texto: string) {
  try {
    const aluno = await prisma.lead.findUnique({ where: { id } });
    if (!aluno) return null;

    const currentNotes = aluno.notes || "";
    const timestamp = new Date().toLocaleString("pt-BR");
    const newNotes = currentNotes
      ? `${currentNotes}\n\n[${timestamp}] ${texto}`
      : `[${timestamp}] ${texto}`;

    const updated = await prisma.lead.update({
      where: { id },
      data: { notes: newNotes },
    });

    await prisma.leadHistory.create({
      data: {
        id: crypto.randomUUID(),
        leadId: id,
        action: `Observação adicionada: ${texto.substring(0, 50)}...`,
      },
    });

    return updated;
  } catch (error) {
    console.error("addAlunoObservacao error:", error);
    return null;
  }
}
