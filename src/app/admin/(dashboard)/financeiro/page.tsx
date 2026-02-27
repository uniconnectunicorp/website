import { getFinanceOverview, getPaymentMethodStats, getAllPaymentMethods } from "@/lib/actions/financeiro";
import { FinanceiroClient } from "./financeiro-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function FinanceiroPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any;

  const [overview, pmStats, allPMs] = await Promise.all([
    getFinanceOverview(),
    getPaymentMethodStats(),
    getAllPaymentMethods(),
  ]);

  return (
    <FinanceiroClient
      initialOverview={JSON.parse(JSON.stringify(overview))}
      initialPMStats={JSON.parse(JSON.stringify(pmStats))}
      allPaymentMethods={JSON.parse(JSON.stringify(allPMs))}
      userId={user?.id}
      userRole={user?.role}
    />
  );
}
