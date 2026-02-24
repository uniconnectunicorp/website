"use server"

import { prisma } from "@/lib/prisma"

export async function getLeads(search?: string) {
  try {
   let leads: any;

    if (search) {
      leads = await prisma.$queryRaw`
         SELECT *
         FROM lead
         WHERE unaccent(LOWER(name)) 
         LIKE unaccent(LOWER(${`%${search}%`}))
         ORDER BY "createdAt" DESC
      `;
    } else {
      leads = await prisma.lead.findMany({
         orderBy: { createdAt: 'desc' }
      });
    }

    const grouped = leads.reduce((acc: any[], lead: any) => {
      if (!acc[lead.status]) {
        acc[lead.status] = [];
      }

      acc[lead.status].push(lead);
      return acc;
    }, {} as Record<string, typeof leads>);

    return grouped;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function createLead(data: any) {
   try {
      const lead = await prisma.lead.create({
         data
      })
      return lead
   } catch (error) {
      console.error(error)
      return null
   }
}

export async function updateLead(id: string, data: any) {
   try {
      const lead = await prisma.lead.update({
         where: { id },
         data
      })
      return lead
   } catch (error) {
      console.error(error)
      return null
   }
}

export async function getGeneralReport({ startDate, endDate, period }: {
  startDate: Date; endDate: Date; period: 'week' | 'month' | 'year' | 'custom'; }) {

  try {
    const grouping = getDateGrouping(period, "createdAt");

    const convertedGraph = await prisma.$queryRawUnsafe(`
      SELECT 
        ${grouping} as label,
        COUNT(*) as total
      FROM lead
      WHERE status = 'converted'
      AND "createdAt" BETWEEN $1 AND $2
      GROUP BY label
      ORDER BY label
    `, startDate, endDate);

    const totalConverted = await prisma.lead.count({
      where: {
        status: 'converted',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalLost = await prisma.lead.count({
      where: {
        status: 'lost',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const lossReasons = await prisma.$queryRawUnsafe(`
      SELECT 
        "lossReason" as name,
        COUNT(*) as total
      FROM lead
      WHERE status = 'lost'
      AND "createdAt" BETWEEN $1 AND $2
      AND "lossReason" IS NOT NULL
      GROUP BY "lossReason"
    `, startDate, endDate);

    const lossWithPercentage = lossReasons.map((item: any) => ({
      name: item.name,
      quantity: Number(item.total),
      percentage: totalLost > 0
        ? Number(((Number(item.total) / totalLost) * 100).toFixed(2))
        : 0
    }));

    const paymentMethods = await prisma.$queryRawUnsafe(`
      SELECT 
        "paymentMethod" as name,
        COUNT(*) as total
      FROM finance
      WHERE type = 'leadPayment'
      AND "transactionDate" BETWEEN $1 AND $2
      GROUP BY "paymentMethod"
    `, startDate, endDate);

    return {
      graph: convertedGraph,
      totalLost,
      lossReasons: lossWithPercentage,
      paymentMethods
    };

  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserReport({userId, startDate, endDate, period}: {
  userId: string; startDate: Date; endDate: Date; period: 'week' | 'month' | 'year' | 'custom';}) {

  try {
    const grouping = getDateGrouping(period, "transactionDate");

    const salesGraph = await prisma.$queryRawUnsafe(`
      SELECT 
        ${grouping} as label,
        COUNT(*) as totalSales,
        SUM(amount) as totalValue
      FROM finance
      WHERE type = 'leadPayment'
      AND "userId" = $1
      AND "transactionDate" BETWEEN $2 AND $3
      GROUP BY label
      ORDER BY label
    `, userId, startDate, endDate);

    const totalSales = await prisma.finance.count({
      where: {
        userId,
        type: 'leadPayment',
        transactionDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const totalValueAgg = await prisma.finance.aggregate({
      where: {
        userId,
        type: 'leadPayment',
        transactionDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    const totalValue = totalValueAgg._sum.amount || 0;
    const averageTicket = totalSales > 0
      ? Number((totalValue / totalSales).toFixed(2))
      : 0;

    const totalAssigned = await prisma.lead.count({
      where: {
        assignedTo: userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const convertedAssigned = await prisma.lead.count({
      where: {
        assignedTo: userId,
        status: 'converted',
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const conversionRate = totalAssigned > 0
      ? Number(((convertedAssigned / totalAssigned) * 100).toFixed(2))
      : 0;

   const openLeads = await prisma.lead.count({
      where: {
         assignedTo: userId,
         createdAt: {
            gte: startDate,
            lte: endDate
         },
         NOT: {
            status: {
            in: ['converted', 'lost']
            }
         }
      }
   });

    return {
      graph: salesGraph,
      totalSales,
      totalValue,
      averageTicket,
      conversionRate,
      openLeads
    };

  } catch (error) {
    console.error(error);
    return null;
  }
}

function getDateGrouping(period: string, field: string) {
  if (period === 'year') {
    return `
      TO_CHAR(DATE_TRUNC('month', ${field}), 'YYYY-MM')
    `;
  }

  return `
    TO_CHAR(DATE_TRUNC('day', ${field}), 'YYYY-MM-DD')
  `;
}