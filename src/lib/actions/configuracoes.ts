"use server";

import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
    return users;
  } catch (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    return user;
  } catch (error) {
    console.error("updateUserRole error:", error);
    return null;
  }
}

export async function deleteUser(userId: string) {
  try {
    await prisma.user.delete({ where: { id: userId } });
    return true;
  } catch (error) {
    console.error("deleteUser error:", error);
    return false;
  }
}
