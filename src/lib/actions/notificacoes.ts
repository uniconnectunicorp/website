"use server";

import { prisma } from "@/lib/prisma";

export async function getNotificacoes(userId: string) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.notificacao.findMany({
      where: {
        userId,
        OR: [
          { lida: false },
          { lida: true, lidaAt: { gte: oneDayAgo } },
        ],
      },
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
      data: { lida: true, lidaAt: new Date() },
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
      data: { lida: true, lidaAt: new Date() },
    });
    return true;
  } catch (error) {
    return false;
  }
}
