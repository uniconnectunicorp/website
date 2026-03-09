"use server";

import { prisma } from "@/lib/prisma";
import { isLeadDistributionEnabled } from "@/lib/lead-distribution";

export async function getPerformanceReport(startDate: Date, endDate: Date) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "seller" as any,
        active: true,
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

export async function getLeadDistributionReport(startDate: Date, endDate: Date) {
  try {
    if (!isLeadDistributionEnabled()) {
      return {
        totals: { sessions: 0, whatsappClicks: 0, emails: 0, duplicates: 0 },
        sellers: [],
      };
    }

    const sellers = await prisma.user.findMany({
      where: { role: "seller" as any, active: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    const [sessionsGrouped, eventsGrouped] = await Promise.all([
      prisma.leadSession.groupBy({
        by: ["sellerId"],
        where: {
          createdAt: { gte: startDate, lte: endDate },
        },
        _count: { _all: true },
      }),
      prisma.leadDistributionEvent.groupBy({
        by: ["sellerId", "eventType"],
        where: {
          createdAt: { gte: startDate, lte: endDate },
          eventType: { in: ["whatsapp_click", "lead_email_sent", "duplicate_phone_detected"] },
        },
        _count: { _all: true },
      }),
    ]);

    const sessionMap = new Map<string, number>();
    for (const row of sessionsGrouped) {
      if (row.sellerId) sessionMap.set(row.sellerId, row._count._all);
    }

    const eventMap = new Map<string, { whatsappClicks: number; emails: number; duplicates: number }>();
    for (const row of eventsGrouped) {
      if (!row.sellerId) continue;
      const current = eventMap.get(row.sellerId) || { whatsappClicks: 0, emails: 0, duplicates: 0 };
      if (row.eventType === "whatsapp_click") current.whatsappClicks = row._count._all;
      if (row.eventType === "lead_email_sent") current.emails = row._count._all;
      if (row.eventType === "duplicate_phone_detected") current.duplicates = row._count._all;
      eventMap.set(row.sellerId, current);
    }

    const sellerRows = sellers.map((seller) => {
      const events = eventMap.get(seller.id) || { whatsappClicks: 0, emails: 0, duplicates: 0 };
      return {
        sellerId: seller.id,
        sellerName: seller.name || "Sem nome",
        sessions: sessionMap.get(seller.id) || 0,
        whatsappClicks: events.whatsappClicks,
        emails: events.emails,
        duplicates: events.duplicates,
      };
    });

    return {
      totals: {
        sessions: sellerRows.reduce((sum, item) => sum + item.sessions, 0),
        whatsappClicks: sellerRows.reduce((sum, item) => sum + item.whatsappClicks, 0),
        emails: sellerRows.reduce((sum, item) => sum + item.emails, 0),
        duplicates: sellerRows.reduce((sum, item) => sum + item.duplicates, 0),
      },
      sellers: sellerRows,
    };
  } catch (error) {
    console.error("getLeadDistributionReport error:", error);
    return {
      totals: { sessions: 0, whatsappClicks: 0, emails: 0, duplicates: 0 },
      sellers: [],
    };
  }
}

export async function getSellerDetailReport(sellerId: string, startDate: Date, endDate: Date) {
  try {
    const [totalAssigned, converted, lost, revenueAgg, monthlyData, lossReasons, commissionsByPayment, leadSessionsCount, distributionEvents] = await Promise.all([
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
      prisma.$queryRawUnsafe(`
        SELECT 
          pm.name as payment_method,
          COALESCE(SUM(f."commissionAmount"), 0) as commission
        FROM finance f
        INNER JOIN payment_method pm ON f."paymentMethodId" = pm.id
        WHERE f."userId" = $1
        AND f.type = 'leadPayment'
        AND f."transactionDate" BETWEEN $2 AND $3
        GROUP BY pm.name
        ORDER BY commission DESC
      `, sellerId, startDate, endDate),
      isLeadDistributionEnabled()
        ? prisma.leadSession.count({
            where: {
              sellerId,
              createdAt: { gte: startDate, lte: endDate },
            },
          })
        : Promise.resolve(0),
      isLeadDistributionEnabled()
        ? prisma.leadDistributionEvent.groupBy({
            by: ["eventType"],
            where: {
              sellerId,
              createdAt: { gte: startDate, lte: endDate },
              eventType: { in: ["whatsapp_click", "lead_email_sent", "duplicate_phone_detected"] },
            },
            _count: { _all: true },
          })
        : Promise.resolve([] as any[]),
    ]);

    const revenue = revenueAgg._sum.amount || 0;
    const conversionRate = totalAssigned > 0 ? Number(((converted / totalAssigned) * 100).toFixed(1)) : 0;
    const lossRate = totalAssigned > 0 ? Number(((lost / totalAssigned) * 100).toFixed(1)) : 0;
    const ticketMedio = converted > 0 ? Number((revenue / converted).toFixed(2)) : 0;

    const commissionsData = (commissionsByPayment as any[]).map((i: any) => ({
      paymentMethod: i.payment_method,
      commission: Number(i.commission),
    }));
    const totalCommission = commissionsData.reduce((sum, item) => sum + item.commission, 0);
    const distributionCounts = { whatsappClicks: 0, emails: 0, duplicates: 0 };
    for (const item of distributionEvents as any[]) {
      if (item.eventType === "whatsapp_click") distributionCounts.whatsappClicks = Number(item._count?._all || 0);
      if (item.eventType === "lead_email_sent") distributionCounts.emails = Number(item._count?._all || 0);
      if (item.eventType === "duplicate_phone_detected") distributionCounts.duplicates = Number(item._count?._all || 0);
    }

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
      adminMetrics: {
        sessions: Number(leadSessionsCount || 0),
        whatsappClicks: distributionCounts.whatsappClicks,
        emails: distributionCounts.emails,
        duplicates: distributionCounts.duplicates,
      },
      commissionsByPayment: commissionsData,
      totalCommission,
    };
  } catch (error) {
    console.error("getSellerDetailReport error:", error);
    return {
      totalAssigned: 0, converted: 0, lost: 0, revenue: 0,
      conversionRate: 0, lossRate: 0, ticketMedio: 0,
      monthlyRevenue: [], lossReasons: [],
      adminMetrics: { sessions: 0, whatsappClicks: 0, emails: 0, duplicates: 0 },
      commissionsByPayment: [], totalCommission: 0,
    };
  }
}
