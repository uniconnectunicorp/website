import { getAlunos } from "@/lib/actions/alunos";
import { AlunosClient } from "./alunos-client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AlunosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const result = await getAlunos({
    search: params.search,
    course: params.course,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie todos os alunos matriculados</p>
      </div>

      <AlunosClient
        alunos={JSON.parse(JSON.stringify(result.data))}
        total={result.total}
        pages={result.pages}
        currentPage={result.currentPage}
        initialFilters={{
          search: params.search || "",
          course: params.course || "",
        }}
      />
    </div>
  );
}
