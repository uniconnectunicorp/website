import { getAlunoById } from "@/lib/actions/alunos";
import { notFound } from "next/navigation";
import { AlunoProfileClient } from "./aluno-profile-client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AlunoPerfilPage({ params }: PageProps) {
  const { id } = await params;
  const [aluno, session] = await Promise.all([
    getAlunoById(id),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!aluno) {
    notFound();
  }

  const userRole = (session?.user as any)?.role || "";

  return <AlunoProfileClient aluno={JSON.parse(JSON.stringify(aluno))} userRole={userRole} />;
}
