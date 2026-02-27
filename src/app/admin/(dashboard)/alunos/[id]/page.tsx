import { getAlunoById } from "@/lib/actions/alunos";
import { notFound } from "next/navigation";
import { AlunoProfileClient } from "./aluno-profile-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlunoPerfilPage({ params }: PageProps) {
  const { id } = await params;
  const aluno = await getAlunoById(id);

  if (!aluno) {
    notFound();
  }

  return <AlunoProfileClient aluno={JSON.parse(JSON.stringify(aluno))} />;
}
