import { getMatriculas, getMatriculaStats } from "@/lib/actions/matriculas";
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

  const [result, stats] = await Promise.all([
    getMatriculas({
      search: params.search,
      startDate: params.startDate,
      endDate: params.endDate,
      course: params.course,
      status: params.status,
      modalidade: params.modalidade,
      page,
    }),
    getMatriculaStats(),
  ]);

  return (
    <MatriculasClient
      matriculas={JSON.parse(JSON.stringify(result.data))}
      total={result.total}
      pages={result.pages}
      currentPage={result.currentPage}
      stats={stats}
      userRole={(session?.user as any)?.role || "seller"}
      initialFilters={{
        search: params.search || "",
        startDate: params.startDate || "",
        endDate: params.endDate || "",
        course: params.course || "",
        status: params.status || "",
        modalidade: params.modalidade || "",
      }}
    />
  );
}
