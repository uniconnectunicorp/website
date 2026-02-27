import { getLeadsPipeline, getSellers, getPaymentMethods } from "@/lib/actions/leads";
import { KanbanBoard } from "@/components/admin/kanban-board";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CRMPipelinePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user as any;

  const [columns, sellers, paymentMethods] = await Promise.all([
    getLeadsPipeline({
      userRole: user?.role,
      userId: user?.id,
    }),
    getSellers(),
    getPaymentMethods(),
  ]);

  return (
    <KanbanBoard
      initialColumns={JSON.parse(JSON.stringify(columns))}
      sellers={JSON.parse(JSON.stringify(sellers))}
      paymentMethods={JSON.parse(JSON.stringify(paymentMethods))}
      currentUser={{ id: user?.id, name: user?.name, role: user?.role }}
    />
  );
}
