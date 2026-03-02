import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🗑️  Iniciando limpeza do banco de dados...');

  // 1. Tabelas filhas primeiro (dependem de Lead)
  const tarefas = await prisma.tarefa.deleteMany();
  console.log(`✓ Tarefas removidas: ${tarefas.count}`);

  const notificacoes = await prisma.notificacao.deleteMany();
  console.log(`✓ Notificações removidas: ${notificacoes.count}`);

  const finances = await prisma.finance.deleteMany();
  console.log(`✓ Finanças removidas: ${finances.count}`);

  const matriculas = await prisma.matricula.deleteMany();
  console.log(`✓ Matrículas removidas: ${matriculas.count}`);

  const enrollmentLinks = await prisma.enrollmentLink.deleteMany();
  console.log(`✓ Links de matrícula removidos: ${enrollmentLinks.count}`);

  const leadHistories = await prisma.leadHistory.deleteMany();
  console.log(`✓ Histórico de leads removido: ${leadHistories.count}`);

  const leads = await prisma.lead.deleteMany();
  console.log(`✓ Leads removidos: ${leads.count}`);

  // 2. Formas de pagamento
  const paymentMethods = await prisma.paymentMethod.deleteMany();
  console.log(`✓ Formas de pagamento removidas: ${paymentMethods.count}`);

  // 3. Configs de vendedor (exceto do admin)
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@uniconnect.com.br' },
    select: { id: true },
  });

  if (!adminUser) {
    throw new Error('❌ Usuário admin@uniconnect.com.br não encontrado! Abortando.');
  }

  const sellerConfigs = await prisma.sellerConfig.deleteMany({
    where: { userId: { not: adminUser.id } },
  });
  console.log(`✓ SellerConfigs removidas: ${sellerConfigs.count}`);

  // 4. Sessions e accounts de outros usuários
  const sessions = await prisma.session.deleteMany({
    where: { userId: { not: adminUser.id } },
  });
  console.log(`✓ Sessões de outros usuários removidas: ${sessions.count}`);

  const accounts = await prisma.account.deleteMany({
    where: { userId: { not: adminUser.id } },
  });
  console.log(`✓ Accounts de outros usuários removidas: ${accounts.count}`);

  // 5. Outros usuários (não o admin)
  const users = await prisma.user.deleteMany({
    where: { email: { not: 'admin@uniconnect.com.br' } },
  });
  console.log(`✓ Outros usuários removidos: ${users.count}`);

  // 6. Verificações (tokens de reset de senha etc.)
  const verifications = await prisma.verification.deleteMany();
  console.log(`✓ Verificações removidas: ${verifications.count}`);

  console.log('\n✅ Banco zerado com sucesso! Apenas admin@uniconnect.com.br foi mantido.');
}

main()
  .catch((e) => {
    console.error('Erro durante limpeza:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
