"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function createLog(params: {
  action: string;
  entity?: string;
  entityId?: string;
  detail?: string;
  userId?: string;
  userName?: string;
  userRole?: string;
}) {
  try {
    const hdrs = await headers();
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0].trim() ||
      hdrs.get("x-real-ip") ||
      "unknown";
    const userAgent = hdrs.get("user-agent") || null;

    await prisma.systemLog.create({
      data: {
        id: crypto.randomUUID(),
        userId: params.userId || null,
        userName: params.userName || null,
        userRole: params.userRole || null,
        action: params.action,
        entity: params.entity || null,
        entityId: params.entityId || null,
        detail: params.detail || null,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error("createLog error:", error);
  }
}

export async function createLogFromSession(params: {
  action: string;
  entity?: string;
  entityId?: string;
  detail?: string;
}) {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session) return;
    await createLog({
      ...params,
      userId: session.user.id,
      userName: session.user.name || session.user.email,
      userRole: (session.user as any).role || "unknown",
    });
  } catch (error) {
    console.error("createLogFromSession error:", error);
  }
}

export async function getLogs(params: {
  userId?: string;
  entity?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (params.userId) where.userId = params.userId;
  if (params.entity) where.entity = params.entity;
  if (params.action) where.action = { contains: params.action, mode: "insensitive" };

  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) where.createdAt.gte = new Date(params.dateFrom);
    if (params.dateTo) {
      const to = new Date(params.dateTo);
      to.setHours(23, 59, 59, 999);
      where.createdAt.lte = to;
    }
  }

  if (params.search) {
    where.OR = [
      { action: { contains: params.search, mode: "insensitive" } },
      { userName: { contains: params.search, mode: "insensitive" } },
      { detail: { contains: params.search, mode: "insensitive" } },
      { entity: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const [logs, total] = await Promise.all([
    prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.systemLog.count({ where }),
  ]);

  return { logs, total, pages: Math.ceil(total / limit) };
}

export async function getLogStats() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, today, week, byEntity] = await Promise.all([
    prisma.systemLog.count(),
    prisma.systemLog.count({ where: { createdAt: { gte: oneDayAgo } } }),
    prisma.systemLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.systemLog.groupBy({ by: ["entity"], _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: 8 }),
  ]);

  return { total, today, week, byEntity };
}

export async function getDistinctUsers() {
  const users = await prisma.systemLog.findMany({
    where: { userId: { not: null } },
    select: { userId: true, userName: true, userRole: true },
    distinct: ["userId"],
    orderBy: { createdAt: "desc" },
  });
  return users;
}
