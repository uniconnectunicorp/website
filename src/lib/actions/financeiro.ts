"use server";

import { prisma } from "@/lib/prisma";
import { PaymentType } from "@prisma/client";

interface DateRange {
  start: string;
  end: string;
}

function parseDateRange(range?: DateRange) {
  if (!range) {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
    };
  }
  return {
    start: new Date(range.start + "T00:00:00"),
    end: new Date(range.end + "T23:59:59"),
  };
}

export async function getFinanceOverview(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const [inTotal, outTotal, leadPaymentTotal, entries] = await Promise.all([
      prisma.finance.aggregate({
        where: { type: { in: ["in", "leadPayment"] }, transactionDate: { gte: start, lte: end } },
        _sum: { amount: true, netAmount: true, feeAmount: true, commissionAmount: true },
        _count: true,
      }),
      prisma.finance.aggregate({
        where: { type: "out", transactionDate: { gte: start, lte: end } },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.finance.aggregate({
        where: { type: "leadPayment", transactionDate: { gte: start, lte: end } },
        _sum: { amount: true, netAmount: true, feeAmount: true, commissionAmount: true },
        _count: true,
      }),
      prisma.finance.findMany({
        where: { transactionDate: { gte: start, lte: end } },
        include: {
          lead: { select: { name: true, course: true } },
          user: { select: { name: true } },
          paymentMethod: { select: { name: true, type: true } },
        },
        orderBy: { transactionDate: "desc" },
      }),
    ]);

    const totalIn = (inTotal._sum.amount || 0);
    const totalOut = (outTotal._sum.amount || 0);
    const totalFees = (leadPaymentTotal._sum.feeAmount || 0);
    const totalNet = (leadPaymentTotal._sum.netAmount || 0);
    const totalCommissions = (leadPaymentTotal._sum.commissionAmount || 0);

    return {
      totalIn,
      totalOut,
      balance: totalIn - totalOut,
      totalFees,
      totalNet,
      totalCommissions,
      enrollmentCount: leadPaymentTotal._count,
      entries: entries.map((e) => ({
        id: e.id,
        amount: e.amount,
        netAmount: e.netAmount,
        feeAmount: e.feeAmount,
        commissionAmount: e.commissionAmount || 0,
        type: e.type,
        category: e.category,
        description: e.description,
        installments: e.installments,
        transactionDate: e.transactionDate,
        leadName: e.lead?.name || null,
        leadCourse: e.lead?.course || null,
        userName: e.user?.name || null,
        paymentMethodName: e.paymentMethod?.name || null,
        paymentMethodType: e.paymentMethod?.type || null,
      })),
    };
  } catch (error) {
    console.error("getFinanceOverview error:", error);
    return null;
  }
}

export async function getPaymentMethodStats(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const data = await prisma.$queryRawUnsafe(`
      SELECT
        pm.name,
        pm.type,
        pm."feePercentage",
        pm."commissionPercentage",
        COUNT(f.id) as count,
        COALESCE(SUM(f.amount), 0) as total_amount,
        COALESCE(SUM(f."feeAmount"), 0) as total_fees,
        COALESCE(SUM(f."netAmount"), 0) as total_net,
        COALESCE(SUM(f."commissionAmount"), 0) as total_commission
      FROM payment_method pm
      LEFT JOIN finance f ON f."paymentMethodId" = pm.id
        AND f."transactionDate" >= $1
        AND f."transactionDate" <= $2
        AND f.type = 'leadPayment'
      WHERE pm.active = true
      GROUP BY pm.id, pm.name, pm.type, pm."feePercentage", pm."commissionPercentage"
      ORDER BY total_amount DESC
    `, start, end);

    return (data as any[]).map((item) => ({
      name: item.name,
      type: item.type,
      feePercentage: Number(item.feePercentage),
      commissionPercentage: Number(item.commissionPercentage),
      count: Number(item.count),
      totalAmount: Number(item.total_amount),
      totalFees: Number(item.total_fees),
      totalNet: Number(item.total_net),
      totalCommission: Number(item.total_commission),
    }));
  } catch (error) {
    console.error("getPaymentMethodStats error:", error);
    return [];
  }
}

export async function createFinanceEntry(data: {
  amount: number;
  type: "in" | "out";
  category: string;
  description: string;
  userId: string;
}) {
  try {
    const entry = await prisma.finance.create({
      data: {
        id: crypto.randomUUID(),
        amount: data.amount,
        netAmount: data.amount,
        feeAmount: 0,
        type: data.type,
        category: data.category,
        description: data.description,
        userId: data.userId,
        transactionDate: new Date(),
      },
    });
    return { success: true, entry };
  } catch (error) {
    console.error("createFinanceEntry error:", error);
    return { error: "Erro ao criar lançamento" };
  }
}

export async function getAllPaymentMethods() {
  try {
    return await prisma.paymentMethod.findMany({
      orderBy: [{ type: "asc" }, { maxInstallments: "asc" }],
    });
  } catch (error) {
    console.error("getAllPaymentMethods error:", error);
    return [];
  }
}

export async function updatePaymentMethod(id: string, data: {
  name?: string;
  feePercentage?: number;
  commissionPercentage?: number;
  commissionType?: string;
  maxInstallments?: number;
  active?: boolean;
  visibleOnEnrollment?: boolean;
}) {
  try {
    await prisma.paymentMethod.update({ where: { id }, data });
    return { success: true };
  } catch (error) {
    console.error("updatePaymentMethod error:", error);
    return { error: "Erro ao atualizar" };
  }
}

export async function createPaymentMethod(data: {
  name: string;
  type: PaymentType;
  feePercentage: number;
  commissionPercentage: number;
  commissionType: string;
  maxInstallments: number;
  visibleOnEnrollment: boolean;
}) {
  try {
    const pm = await prisma.paymentMethod.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        type: data.type,
        feePercentage: data.feePercentage,
        commissionPercentage: data.commissionPercentage,
        commissionType: data.commissionType,
        maxInstallments: data.maxInstallments,
        active: true,
        visibleOnEnrollment: data.visibleOnEnrollment,
      },
    });
    return { success: true, paymentMethod: pm };
  } catch (error) {
    console.error("createPaymentMethod error:", error);
    return { error: "Erro ao criar forma de pagamento" };
  }
}

export async function deletePaymentMethod(id: string) {
  try {
    await prisma.paymentMethod.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("deletePaymentMethod error:", error);
    return { error: "Erro ao excluir. Verifique se não há transações vinculadas." };
  }
}
