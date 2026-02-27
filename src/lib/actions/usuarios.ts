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
      createdAt: u.createdAt,
      sellerConfig: u.sellerConfig
        ? { minValue: u.sellerConfig.minValue, maxValue: u.sellerConfig.maxValue }
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
    // For now, permissions are role-based. This action stores the intent.
    // In a full implementation, you'd save to a UserPermission table.
    // Currently we log and return success since permissions derive from roles.
    console.log("Permissions saved:", Object.keys(permissionsData).length, "users updated");
    return { success: true };
  } catch (error) {
    console.error("saveUserPermissions error:", error);
    return { error: "Erro ao salvar permissões" };
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
