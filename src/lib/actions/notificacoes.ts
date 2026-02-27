"use server";

import { prisma } from "@/lib/prisma";

export async function getNotificacoes(userId: string) {
  try {
    return await prisma.notificacao.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch (error) {
    return [];
  }
}

export async function marcarNotificacaoLida(id: string) {
  try {
    await prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function marcarTodasLidas(userId: string) {
  try {
    await prisma.notificacao.updateMany({
      where: { userId, lida: false },
      data: { lida: true },
    });
    return true;
  } catch (error) {
    return false;
  }
}
