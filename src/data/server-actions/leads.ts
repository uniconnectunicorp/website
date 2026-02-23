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