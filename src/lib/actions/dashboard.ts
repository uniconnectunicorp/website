"use server";

import { prisma } from "@/lib/prisma";

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
    start: new Date(range.start),
    end: new Date(range.end + "T23:59:59"),
  };
}

export async function getDashboardKPIs(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);
    const rangeDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));
    const prevStart = new Date(start.getTime() - rangeDays * 86400000);
    const prevEnd = new Date(start.getTime() - 1);

    const [
      totalLeadsPeriod,
      totalLeadsPrev,
      convertedPeriod,
      convertedPrev,
      revenuePeriod,
      revenuePrev,
      totalLeadsAll,
      totalConvertedAll,
    ] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.lead.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
      prisma.lead.count({ where: { status: "converted", convertedAt: { gte: start, lte: end } } }),
      prisma.lead.count({ where: { status: "converted", convertedAt: { gte: prevStart, lte: prevEnd } } }),
      prisma.finance.aggregate({
        where: { type: "leadPayment", transactionDate: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.finance.aggregate({
        where: { type: "leadPayment", transactionDate: { gte: prevStart, lte: prevEnd } },
        _sum: { amount: true },
      }),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "converted" } }),
    ]);

    const revenueVal = revenuePeriod._sum.amount || 0;
    const revenuePrevVal = revenuePrev._sum.amount || 0;

    const pctChange = (curr: number, prev: number) =>
      prev > 0 ? Number((((curr - prev) / prev) * 100).toFixed(1)) : curr > 0 ? 100 : 0;

    const conversionRate = totalLeadsPeriod > 0
      ? Number(((convertedPeriod / totalLeadsPeriod) * 100).toFixed(1))
      : 0;
    const prevConversionRate = totalLeadsPrev > 0
      ? Number(((convertedPrev / totalLeadsPrev) * 100).toFixed(1))
      : 0;

    return {
      totalLeads: totalLeadsPeriod,
      leadsChange: pctChange(totalLeadsPeriod, totalLeadsPrev),
      conversionRate,
      conversionRateChange: pctChange(conversionRate, prevConversionRate),
      convertedChange: pctChange(convertedPeriod, convertedPrev),
      matriculasFeitas: convertedPeriod,
      matriculasChange: pctChange(convertedPeriod, convertedPrev),
      revenue: revenueVal,
      revenueChange: pctChange(revenueVal, revenuePrevVal),
      lostPeriod: await prisma.lead.count({ where: { status: "lost", lostAt: { gte: start, lte: end } } }),
    };
  } catch (error) {
    console.error("getDashboardKPIs error:", error);
    return null;
  }
}

export async function getRevenueChart(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const data = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "transactionDate"), 'YYYY-MM') as label,
        COALESCE(SUM(amount), 0) as total
      FROM finance
      WHERE type = 'leadPayment'
      AND "transactionDate" >= $1
      AND "transactionDate" <= $2
      GROUP BY label
      ORDER BY label
    `, start, end);

    return (data as any[]).map((item: any) => ({
      label: item.label,
      value: Number(item.total),
    }));
  } catch (error) {
    console.error("getRevenueChart error:", error);
    return [];
  }
}

export async function getLeadsByStatusChart(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const data = await prisma.$queryRawUnsafe(`
      SELECT status, COUNT(*) as total
      FROM lead
      WHERE "createdAt" >= $1 AND "createdAt" <= $2
      GROUP BY status
    `, start, end);

    const statusLabels: Record<string, string> = {
      pending: "Novos",
      contacted: "Em Contato",
      negociating: "Negociação",
      confirmPayment: "Conf. Pagamento",
      converted: "Convertidos",
      lost: "Perdidos",
    };

    return (data as any[]).map((item: any) => ({
      label: statusLabels[item.status] || item.status,
      value: Number(item.total),
      status: item.status,
    }));
  } catch (error) {
    console.error("getLeadsByStatusChart error:", error);
    return [];
  }
}

export async function getRecentLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        assignedUser: { select: { name: true } },
      },
    });
    return leads.map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      course: l.course,
      status: l.status,
      seller: l.assignedUser?.name || null,
      createdAt: l.createdAt,
    }));
  } catch (error) {
    console.error("getRecentLeads error:", error);
    return [];
  }
}

export async function getEntradasSaidasChart(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const data = await prisma.$queryRawUnsafe(`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', "transactionDate"), 'YYYY-MM') as label,
        COALESCE(SUM(CASE WHEN type = 'leadPayment' OR type = 'in' THEN amount ELSE 0 END), 0) as entradas,
        COALESCE(SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END), 0) as saidas
      FROM finance
      WHERE "transactionDate" >= $1
      AND "transactionDate" <= $2
      GROUP BY label
      ORDER BY label
    `, start, end);

    return (data as any[]).map((item: any) => ({
      label: item.label,
      entradas: Number(item.entradas),
      saidas: Number(item.saidas),
    }));
  } catch (error) {
    console.error("getEntradasSaidasChart error:", error);
    return [];
  }
}

export async function getTopSellers(dateRange?: DateRange) {
  try {
    const { start, end } = parseDateRange(dateRange);

    const data = await prisma.$queryRawUnsafe(`
      SELECT 
        u.name,
        COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as conversoes,
        COUNT(*) as total_leads,
        COALESCE(SUM(CASE WHEN f.type = 'leadPayment' THEN f.amount ELSE 0 END), 0) as receita
      FROM "user" u
      LEFT JOIN lead l ON l."assignedTo" = u.id AND l."createdAt" >= $1 AND l."createdAt" <= $2
      LEFT JOIN finance f ON f."userId" = u.id AND f."transactionDate" >= $1 AND f."transactionDate" <= $2
      WHERE u.role = 'seller' AND u.active = true
      GROUP BY u.id, u.name
      ORDER BY conversoes DESC
      LIMIT 5
    `, start, end);

    return (data as any[]).map((item: any) => ({
      name: item.name,
      conversoes: Number(item.conversoes),
      totalLeads: Number(item.total_leads),
      receita: Number(item.receita),
    }));
  } catch (error) {
    console.error("getTopSellers error:", error);
    return [];
  }
}
