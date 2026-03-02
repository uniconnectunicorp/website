"use server";

import { prisma } from "@/lib/prisma";
import { scrypt } from "@noble/hashes/scrypt.js";
import { bytesToHex, randomBytes } from "@noble/hashes/utils.js";
import { createLogFromSession } from "@/lib/actions/logs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

async function getCallerRole(): Promise<string | null> {
  try {
    const hdrs = await headers();
    const session = await auth.api.getSession({ headers: hdrs });
    return (session?.user as any)?.role || null;
  } catch { return null; }
}

async function isTargetProtected(userId: string): Promise<boolean> {
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return target?.role === "admin";
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const callerRole = await getCallerRole();
    if (callerRole !== "admin") return { error: "Sem permissão" };
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    await createLogFromSession({ action: `Role alterado para ${role}`, entity: "usuario", entityId: userId, detail: target?.name || userId });
    return { success: true };
  } catch (error) {
    console.error("updateUserRole error:", error);
    return { error: "Erro ao atualizar role" };
  }
}

export async function toggleUserActive(userId: string, active: boolean) {
  try {
    const callerRole = await getCallerRole();
    if (await isTargetProtected(userId) && callerRole !== "admin") return { error: "Sem permissão" };
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    await prisma.user.update({
      where: { id: userId },
      data: { active },
    });
    await createLogFromSession({ action: active ? "Usuário ativado" : "Usuário desativado", entity: "usuario", entityId: userId, detail: target?.name || userId });
    return { success: true };
  } catch (error) {
    console.error("toggleUserActive error:", error);
    return { error: "Erro ao atualizar status" };
  }
}

export async function saveUserPermissions(permissionsData: Record<string, Record<string, boolean>>) {
  try {
    const callerRole = await getCallerRole();
    // Fetch all target roles in one query
    const targetIds = Object.keys(permissionsData);
    const targets = await prisma.user.findMany({ where: { id: { in: targetIds } }, select: { id: true, role: true } });
    const updates = targets
      .filter((t) => {
        // Non-admins cannot modify admin accounts
        if (t.role === "admin" && callerRole !== "admin") return false;
        return true;
      })
      .map((t) => prisma.user.update({ where: { id: t.id }, data: { permissions: permissionsData[t.id] } }));
    await Promise.all(updates);
    return { success: true };
  } catch (error) {
    console.error("saveUserPermissions error:", error);
    return { error: "Erro ao salvar permissões" };
  }
}

export async function updateUserData(userId: string, data: { name: string; email: string }) {
  try {
    const callerRole = await getCallerRole();
    if (await isTargetProtected(userId) && callerRole !== "admin") return { error: "Sem permissão" };
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.name, email: data.email },
    });
    await createLogFromSession({ action: "Dados do usuário editados", entity: "usuario", entityId: userId, detail: `${data.name} <${data.email}>` });
    return { success: true };
  } catch (error) {
    console.error("updateUserData error:", error);
    return { error: "Erro ao atualizar usuário" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const callerRole = await getCallerRole();
    if (await isTargetProtected(userId) && callerRole !== "admin") return { error: "Sem permissão" };
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    await prisma.lead.updateMany({
      where: { assignedTo: userId },
      data: { assignedTo: null },
    });
    await prisma.user.delete({ where: { id: userId } });
    await createLogFromSession({ action: "Usuário excluído", entity: "usuario", entityId: userId, detail: target ? `${target.name} <${target.email}>` : userId });
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
    const callerRole = await getCallerRole();
    if (await isTargetProtected(userId) && callerRole !== "admin") return { error: "Sem permissão" };
    const target = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const hashed = await baHashPassword(newPassword);
    await prisma.account.updateMany({
      where: { userId, providerId: "credential" },
      data: { password: hashed },
    });
    await createLogFromSession({ action: "Senha do usuário alterada", entity: "usuario", entityId: userId, detail: target?.name || userId });
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

    await createLogFromSession({ action: "Novo usuário criado", entity: "usuario", entityId: userId, detail: `${data.name} <${data.email}> — ${data.role}` });

    return { success: true };
  } catch (error: any) {
    console.error("createUser error:", error);
    return { error: error?.message || "Erro ao criar usuário" };
  }
}
