"use server";

import { prisma } from "@/lib/prisma";

export async function getAllUsersWithConfig() {
  try {
    const users = await prisma.user.findMany({
      include: {
        sellerConfig: true,
        _count: {
          select: {
            leadsAssigned: true,
            enrollmentLinksGenerated: true,
          },
        },
      },
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      image: u.image,
      permissions: u.permissions || null,
      createdAt: u.createdAt,
      sellerConfig: u.sellerConfig
        ? { minValue: u.sellerConfig.minValue, maxValue: u.sellerConfig.maxValue, valueLimits: u.sellerConfig.valueLimits || {} }
        : null,
      leadsCount: u._count.leadsAssigned,
      linksCount: u._count.enrollmentLinksGenerated,
    }));
  } catch (error) {
    console.error("getAllUsersWithConfig error:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    return { success: true };
  } catch (error) {
    console.error("updateUserRole error:", error);
    return { error: "Erro ao atualizar role" };
  }
}

export async function toggleUserActive(userId: string, active: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { active },
    });
    return { success: true };
  } catch (error) {
    console.error("toggleUserActive error:", error);
    return { error: "Erro ao atualizar status" };
  }
}

export async function saveUserPermissions(permissionsData: Record<string, Record<string, boolean>>) {
  try {
    const updates = Object.entries(permissionsData).map(([userId, perms]) =>
      prisma.user.update({
        where: { id: userId },
        data: { permissions: perms },
      })
    );
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error("saveUserPermissions error:", error);
    return { error: "Erro ao salvar permissões" };
  }
}

export async function updateUserData(userId: string, data: { name: string; email: string }) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
    });
    return { success: true };
  } catch (error) {
    console.error("updateUserData error:", error);
    return { error: "Erro ao atualizar usuário" };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Cascade: sessions, accounts, sellerConfig, finance, enrollmentLinks, leadsAssigned all have onDelete rules
    // Leads assigned to this user — unassign them first
    await prisma.lead.updateMany({
      where: { assignedTo: userId },
      data: { assignedTo: null },
    });
    await prisma.user.delete({ where: { id: userId } });
    return { success: true };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { error: "Erro ao apagar usuário" };
  }
}

export async function updateSellerConfig(userId: string, minValue: number, maxValue: number) {
  try {
    await prisma.sellerConfig.upsert({
      where: { userId },
      update: { minValue, maxValue },
      create: {
        id: crypto.randomUUID(),
        userId,
        minValue,
        maxValue,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("updateSellerConfig error:", error);
    return { error: "Erro ao atualizar configuração" };
  }
}

export async function updateSellerValueLimits(
  userId: string,
  valueLimits: Record<string, { min: number; max: number }>
) {
  try {
    await prisma.sellerConfig.upsert({
      where: { userId },
      update: { valueLimits },
      create: {
        id: crypto.randomUUID(),
        userId,
        minValue: 0,
        maxValue: 99999,
        valueLimits,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("updateSellerValueLimits error:", error);
    return { error: "Erro ao atualizar limites por categoria" };
  }
}
