"use server";

import { prisma } from "@/lib/prisma";
import { scrypt } from "@noble/hashes/scrypt";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";

async function baHashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16));
  const key = await new Promise<Uint8Array>((resolve) => {
    resolve(scrypt(password.normalize("NFKC"), salt, { N: 16384, r: 16, p: 1, dkLen: 64 }));
  });
  return `${salt}:${bytesToHex(key)}`;
}

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

export async function changeUserPassword(userId: string, newPassword: string) {
  try {
    const hashed = await baHashPassword(newPassword);
    await prisma.account.updateMany({
      where: { userId, providerId: "credential" },
      data: { password: hashed },
    });
    return { success: true };
  } catch (error) {
    console.error("changeUserPassword error:", error);
    return { error: "Erro ao trocar senha" };
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return { error: "E-mail já cadastrado" };

    const userId = crypto.randomUUID();
    const hashed = await baHashPassword(data.password);

    await prisma.user.create({
      data: {
        id: userId,
        name: data.name,
        email: data.email,
        role: data.role as any,
        active: true,
        emailVerified: true,
      },
    });

    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("createUser error:", error);
    return { error: error?.message || "Erro ao criar usuário" };
  }
}
