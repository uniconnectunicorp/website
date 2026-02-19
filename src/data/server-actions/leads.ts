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
