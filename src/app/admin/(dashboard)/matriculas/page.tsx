import { getMatriculas, getMatriculaStats, getPaymentMethodsForFilter } from "@/lib/actions/matriculas";
import { MatriculasClient } from "./matriculas-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function MatriculasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const session = await auth.api.getSession({ headers: await headers() });

  const [result, stats, paymentMethods] = await Promise.all([
    getMatriculas({
      search: params.search,
      startDate: params.startDate,
      endDate: params.endDate,
      course: params.course,
      status: params.status,
      modalidade: params.modalidade,
      paymentMethod: params.paymentMethod,
      page,
    }),
    getMatriculaStats(),
    getPaymentMethodsForFilter(),
  ]);

  return (
    <MatriculasClient
      matriculas={JSON.parse(JSON.stringify(result.data))}
      total={result.total}
      pages={result.pages}
      currentPage={result.currentPage}
      stats={stats}
      userRole={(session?.user as any)?.role || "seller"}
      paymentMethods={paymentMethods}
      initialFilters={{
        search: params.search || "",
        startDate: params.startDate || "",
        endDate: params.endDate || "",
        course: params.course || "",
        status: params.status || "",
        modalidade: params.modalidade || "",
        paymentMethod: params.paymentMethod || "",
      }}
    />
  );
}
