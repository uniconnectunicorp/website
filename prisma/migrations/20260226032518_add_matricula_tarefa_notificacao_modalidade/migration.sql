-- CreateEnum
CREATE TYPE "MatriculaStatus" AS ENUM ('ativa', 'concluida', 'cancelada', 'trancada');

-- CreateEnum
CREATE TYPE "Modalidade" AS ENUM ('regular', 'aproveitamento', 'competencia');

-- CreateEnum
CREATE TYPE "TarefaTipo" AS ENUM ('followup', 'ligacao', 'reuniao', 'email', 'visita', 'outro');

-- CreateEnum
CREATE TYPE "TarefaStatus" AS ENUM ('pendente', 'emAndamento', 'concluida', 'cancelada');

-- CreateEnum
CREATE TYPE "NotificacaoTipo" AS ENUM ('info', 'sucesso', 'alerta', 'erro');

-- AlterTable
ALTER TABLE "lead" ADD COLUMN     "modalidade" "Modalidade";

-- CreateTable
CREATE TABLE "matricula" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "status" "MatriculaStatus" NOT NULL DEFAULT 'ativa',
    "modalidade" "Modalidade" NOT NULL DEFAULT 'regular',
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataConclusao" TIMESTAMP(3),
    "dataCancelamento" TIMESTAMP(3),
    "motivoCancelamento" TEXT,
    "certificadoEmitido" BOOLEAN NOT NULL DEFAULT false,
    "dataCertificado" TIMESTAMP(3),
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matricula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefa" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" "TarefaTipo" NOT NULL DEFAULT 'followup',
    "status" "TarefaStatus" NOT NULL DEFAULT 'pendente',
    "prazo" TIMESTAMP(3),
    "concluidaEm" TIMESTAMP(3),
    "assignedTo" TEXT NOT NULL,
    "criadoPor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarefa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "tipo" "NotificacaoTipo" NOT NULL DEFAULT 'info',
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "linkUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matricula_leadId_key" ON "matricula"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "matricula_numero_key" ON "matricula"("numero");

-- CreateIndex
CREATE INDEX "tarefa_leadId_idx" ON "tarefa"("leadId");

-- CreateIndex
CREATE INDEX "tarefa_assignedTo_idx" ON "tarefa"("assignedTo");

-- CreateIndex
CREATE INDEX "notificacao_userId_idx" ON "notificacao"("userId");

-- CreateIndex
CREATE INDEX "notificacao_lida_idx" ON "notificacao"("lida");

-- AddForeignKey
ALTER TABLE "matricula" ADD CONSTRAINT "matricula_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarefa" ADD CONSTRAINT "tarefa_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
