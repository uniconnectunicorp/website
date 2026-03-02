"use server";

import { prisma } from "@/lib/prisma";

export async function getPerformanceReport(startDate: Date, endDate: Date) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["admin", "director", "manager", "seller"] as any },
      },
      select: { id: true, name: true, role: true },
    });

    const performance = await Promise.all(
      users.map(async (user) => {
        const [totalAssigned, converted, totalSales, revenueAgg] = await Promise.all([
          prisma.lead.count({
            where: {
              assignedTo: user.id,
              OR: [
                { createdAt: { gte: startDate, lte: endDate } },
                { convertedAt: { gte: startDate, lte: endDate } },
                { lostAt: { gte: startDate, lte: endDate } },
              ],
            },
          }),
          prisma.lead.count({
            where: {
              assignedTo: user.id,
              status: "converted",
              convertedAt: { gte: startDate, lte: endDate },
            },
          }),
          prisma.finance.count({
            where: {
              userId: user.id,
              type: "leadPayment",
              transactionDate: { gte: startDate, lte: endDate },
            },
          }),
          prisma.finance.aggregate({
            where: {
              userId: user.id,
              type: "leadPayment",
              transactionDate: { gte: startDate, lte: endDate },
            },
            _sum: { amount: true },
          }),
        ]);

        const revenue = revenueAgg._sum.amount || 0;
        const conversionRate = totalAssigned > 0
          ? Number(((converted / totalAssigned) * 100).toFixed(1))
          : 0;

        return {
          id: user.id,
          name: user.name,
          role: user.role,
          totalAssigned,
          converted,
          conversionRate,
          totalSales,
          revenue,
        };
      })
    );

    return performance.sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error("getPerformanceReport error:", error);
    return [];
  }
}

export async function getSalesReport(startDate: Date, endDate: Date) {
  try {
    const [salesByMonth, salesByCourse, salesByPayment, totals] = await Promise.all([
      prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "transactionDate"), 'YYYY-MM') as label,
          COUNT(*) as total_sales,
          COALESCE(SUM(amount), 0) as total_value
        FROM finance
        WHERE type = 'leadPayment'
        AND "transactionDate" BETWEEN $1 AND $2
        GROUP BY label
        ORDER BY label
      `, startDate, endDate),

      prisma.$queryRawUnsafe(`
        SELECT 
          COALESCE(l.course, 'Não informado') as name,
          COUNT(*) as total,
          COALESCE(SUM(f.amount), 0) as revenue
        FROM finance f
        LEFT JOIN lead l ON f."leadId" = l.id
        WHERE f.type = 'leadPayment'
        AND f."transactionDate" BETWEEN $1 AND $2
        GROUP BY l.course
        ORDER BY revenue DESC
        LIMIT 10
      `, startDate, endDate),

      prisma.$queryRawUnsafe(`
        SELECT 
          COALESCE(pm.name, 'Não informado') as name,
          COUNT(*) as total,
          COALESCE(SUM(f.amount), 0) as value
        FROM finance f
        LEFT JOIN payment_method pm ON f."paymentMethodId" = pm.id
        WHERE f.type = 'leadPayment'
        AND f."transactionDate" BETWEEN $1 AND $2
        GROUP BY pm.name
      `, startDate, endDate),

      prisma.finance.aggregate({
        where: {
          type: "leadPayment",
          transactionDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalRevenue = totals._sum.amount || 0;
    const totalSales = totals._count || 0;
    const averageTicket = totalSales > 0 ? Number((totalRevenue / totalSales).toFixed(2)) : 0;

    return {
      salesByMonth: (salesByMonth as any[]).map((i: any) => ({
        label: i.label,
        sales: Number(i.total_sales),
        value: Number(i.total_value),
      })),
      salesByCourse: (salesByCourse as any[]).map((i: any) => ({
        name: i.name,
        total: Number(i.total),
        revenue: Number(i.revenue),
      })),
      salesByPayment: (salesByPayment as any[]).map((i: any) => ({
        name: i.name,
        total: Number(i.total),
        value: Number(i.value),
      })),
      totalRevenue,
      totalSales,
      averageTicket,
    };
  } catch (error) {
    console.error("getSalesReport error:", error);
    return {
      salesByMonth: [],
      salesByCourse: [],
      salesByPayment: [],
      totalRevenue: 0,
      totalSales: 0,
      averageTicket: 0,
    };
  }
}

export async function getConversionReport(startDate: Date, endDate: Date) {
  try {
    const [totalLeads, byStatus, convertedTimeline] = await Promise.all([
      prisma.lead.count({
        where: { createdAt: { gte: startDate, lte: endDate } },
      }),
      prisma.$queryRawUnsafe(`
        SELECT status, COUNT(*) as total
        FROM lead
        WHERE "createdAt" BETWEEN $1 AND $2
        GROUP BY status
      `, startDate, endDate),
      prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "convertedAt"), 'YYYY-MM') as label,
          COUNT(*) as total
        FROM lead
        WHERE status = 'converted'
        AND "convertedAt" BETWEEN $1 AND $2
        GROUP BY label
        ORDER BY label
      `, startDate, endDate),
    ]);

    const statusLabels: Record<string, string> = {
      pending: "Novos",
      contacted: "Em Contato",
      negociating: "Negociação",
      confirmPayment: "Conf. Pagamento",
      converted: "Convertidos",
      lost: "Perdidos",
    };

    const funnel = (byStatus as any[]).map((item: any) => {
      const count = Number(item.total);
      return {
        status: item.status,
        label: statusLabels[item.status] || item.status,
        count,
        percentage: totalLeads > 0 ? Number(((count / totalLeads) * 100).toFixed(1)) : 0,
      };
    });

    const statusOrder = ["pending", "contacted", "negociating", "confirmPayment", "converted", "lost"];
    funnel.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    return {
      totalLeads,
      funnel,
      convertedTimeline: (convertedTimeline as any[]).map((i: any) => ({
        label: i.label,
        value: Number(i.total),
      })),
    };
  } catch (error) {
    console.error("getConversionReport error:", error);
    return { totalLeads: 0, funnel: [], convertedTimeline: [] };
  }
}

export async function getLossReasonsReport(startDate: Date, endDate: Date) {
  try {
    const data = await prisma.$queryRawUnsafe(`
      SELECT 
        COALESCE("lossReason", 'Não informado') as reason,
        COUNT(*) as total
      FROM lead
      WHERE status = 'lost'
      AND "lostAt" BETWEEN $1 AND $2
      GROUP BY "lossReason"
      ORDER BY total DESC
    `, startDate, endDate);

    return (data as any[]).map((item: any) => ({
      name: item.reason,
      value: Number(item.total),
    }));
  } catch (error) {
    console.error("getLossReasonsReport error:", error);
    return [];
  }
}

export async function getSellerDetailReport(sellerId: string, startDate: Date, endDate: Date) {
  try {
    const [totalAssigned, converted, lost, revenueAgg, monthlyData, lossReasons] = await Promise.all([
      prisma.lead.count({
        where: {
          assignedTo: sellerId,
          OR: [
            { createdAt: { gte: startDate, lte: endDate } },
            { convertedAt: { gte: startDate, lte: endDate } },
            { lostAt: { gte: startDate, lte: endDate } },
          ],
        },
      }),
      prisma.lead.count({
        where: { assignedTo: sellerId, status: "converted", convertedAt: { gte: startDate, lte: endDate } },
      }),
      prisma.lead.count({
        where: { assignedTo: sellerId, status: "lost", lostAt: { gte: startDate, lte: endDate } },
      }),
      prisma.finance.aggregate({
        where: { userId: sellerId, type: "leadPayment", transactionDate: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      }),
      prisma.$queryRawUnsafe(`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', f."transactionDate"), 'YYYY-MM') as label,
          COALESCE(SUM(f.amount), 0) as total
        FROM finance f
        WHERE f."userId" = $1
        AND f.type = 'leadPayment'
        AND f."transactionDate" BETWEEN $2 AND $3
        GROUP BY label
        ORDER BY label
      `, sellerId, startDate, endDate),
      prisma.$queryRawUnsafe(`
        SELECT 
          COALESCE("lossReason", 'Não informado') as reason,
          COUNT(*) as total
        FROM lead
        WHERE "assignedTo" = $1
        AND status = 'lost'
        AND "lostAt" BETWEEN $2 AND $3
        GROUP BY "lossReason"
        ORDER BY total DESC
        LIMIT 5
      `, sellerId, startDate, endDate),
    ]);

    const revenue = revenueAgg._sum.amount || 0;
    const conversionRate = totalAssigned > 0 ? Number(((converted / totalAssigned) * 100).toFixed(1)) : 0;
    const lossRate = totalAssigned > 0 ? Number(((lost / totalAssigned) * 100).toFixed(1)) : 0;
    const ticketMedio = converted > 0 ? Number((revenue / converted).toFixed(2)) : 0;

    return {
      totalAssigned,
      converted,
      lost,
      revenue,
      conversionRate,
      lossRate,
      ticketMedio,
      monthlyRevenue: (monthlyData as any[]).map((i: any) => ({
        label: i.label,
        value: Number(i.total),
      })),
      lossReasons: (lossReasons as any[]).map((i: any) => ({
        name: i.reason,
        value: Number(i.total),
      })),
    };
  } catch (error) {
    console.error("getSellerDetailReport error:", error);
    return {
      totalAssigned: 0, converted: 0, lost: 0, revenue: 0,
      conversionRate: 0, lossRate: 0, ticketMedio: 0,
      monthlyRevenue: [], lossReasons: [],
    };
  }
}
