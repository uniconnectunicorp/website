"use server"

import { prisma } from "@/lib/prisma"

export async function getLeads() {
   try {
    const leads = await prisma.lead.findMany()
    return leads
   } catch (error) {
    console.error(error)
    return []
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