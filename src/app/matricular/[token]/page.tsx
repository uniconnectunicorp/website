import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MatricularClient } from "./matricular-client";

export default async function MatricularPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const link = await prisma.enrollmentLink.findUnique({
    where: { token },
    include: {
      lead: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          course: true,
          courseValue: true,
          modalidade: true,
          cpf: true,
          rg: true,
          birthDate: true,
          address: true,
          houseNumber: true,
          neighborhood: true,
          city: true,
          state: true,
          zipCode: true,
          civilStatus: true,
        },
      },
      seller: { select: { name: true } },
    },
  });

  if (!link || link.used) {
    return notFound();
  }

  // Check if expired
  if (link.expiresAt && new Date() > link.expiresAt) {
    return notFound();
  }

  // Get visible payment methods
  const paymentMethods = await prisma.paymentMethod.findMany({
    where: { active: true, visibleOnEnrollment: true },
    orderBy: [{ type: "asc" }, { maxInstallments: "asc" }],
  });

  return (
    <MatricularClient
      token={token}
      lead={JSON.parse(JSON.stringify(link.lead))}
      sellerName={link.seller.name}
      paymentMethods={JSON.parse(JSON.stringify(paymentMethods))}
    />
  );
}
