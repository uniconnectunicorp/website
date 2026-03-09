"use server";

import { prisma } from "@/lib/prisma";
import { publishNotificationEvent } from "@/lib/realtime-notificacoes";

async function enrichNotificationsWithRecipient<T extends { userId: string }>(items: T[]) {
  const userIds = Array.from(new Set(items.map((item) => item.userId)));
  if (userIds.length === 0) return items.map((item) => ({ ...item, recipientName: null }));

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  const usersMap = new Map(users.map((user) => [user.id, user]));

  return items.map((item) => ({
    ...item,
    recipientName: usersMap.get(item.userId)?.name || usersMap.get(item.userId)?.email || null,
  }));
}

export async function getNotificacoes(userId: string, userRole?: string) {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const notificacoes = await prisma.notificacao.findMany({
      where: {
        ...(userRole === "admin" ? {} : { userId }),
        OR: [
          { lida: false },
          { lida: true, lidaAt: { gte: oneDayAgo } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return await enrichNotificationsWithRecipient(notificacoes);
  } catch (error) {
    return [];
  }
}

export async function criarNotificacao(data: {
  userId: string;
  titulo: string;
  mensagem: string;
  tipo?: string;
  linkUrl?: string | null;
}) {
  try {
    const notificacao = await prisma.notificacao.create({
      data: {
        id: crypto.randomUUID(),
        userId: data.userId,
        titulo: data.titulo,
        mensagem: data.mensagem,
        tipo: (data.tipo as any) || "info",
        linkUrl: data.linkUrl || null,
      },
    });

    const recipient = await prisma.user.findUnique({
      where: { id: notificacao.userId },
      select: { name: true, email: true },
    });

    await publishNotificationEvent({
      type: "notificacao_criada",
      userId: notificacao.userId,
      notificacao: {
        id: notificacao.id,
        userId: notificacao.userId,
        recipientName: recipient?.name || recipient?.email || null,
        titulo: notificacao.titulo,
        mensagem: notificacao.mensagem,
        tipo: notificacao.tipo,
        lida: notificacao.lida,
        linkUrl: notificacao.linkUrl,
        createdAt: notificacao.createdAt.toISOString(),
      },
    });

    return notificacao;
  } catch (error) {
    console.error("criarNotificacao error:", error);
    return null;
  }
}

export async function marcarNotificacaoLida(id: string) {
  try {
    const notificacao = await prisma.notificacao.update({
      where: { id },
      data: { lida: true, lidaAt: new Date() },
    });

    await publishNotificationEvent({
      type: "notificacao_lida",
      userId: notificacao.userId,
      notificacaoId: notificacao.id,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function marcarTodasLidas(userId: string) {
  try {
    const unreadByUser = await prisma.notificacao.findMany({
      where: { userId, lida: false },
      select: { userId: true },
      distinct: ["userId"],
    });

    await prisma.notificacao.updateMany({
      where: { userId, lida: false },
      data: { lida: true, lidaAt: new Date() },
    });

    await Promise.all(
      unreadByUser.map((item) =>
        publishNotificationEvent({
          type: "notificacoes_lidas",
          userId: item.userId,
        })
      )
    );

    return true;
  } catch (error) {
    return false;
  }
}

export async function marcarTodasNotificacoesComoLidas() {
  try {
    const unreadByUser = await prisma.notificacao.findMany({
      where: { lida: false },
      select: { userId: true },
      distinct: ["userId"],
    });

    await prisma.notificacao.updateMany({
      where: { lida: false },
      data: { lida: true, lidaAt: new Date() },
    });

    await Promise.all(
      unreadByUser.map((item) =>
        publishNotificationEvent({
          type: "notificacoes_lidas",
          userId: item.userId,
        })
      )
    );

    return true;
  } catch (error) {
    return false;
  }
}
