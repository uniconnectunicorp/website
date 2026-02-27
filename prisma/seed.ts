import { config } from 'dotenv'
import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";

config()

// ─── Users ────────────────────────────────────────────────────────────────────
const users = [
  { name: 'Admin UniConnect',      email: 'admin@uniconnect.com.br',      password: 'Admin@2025!',    role: 'admin' },
  { name: 'Diretor UniConnect',    email: 'diretor@uniconnect.com.br',    password: 'Diretor@2025!',  role: 'director' },
  { name: 'Gerente UniConnect',    email: 'gerente@uniconnect.com.br',    password: 'Gerente@2025!',  role: 'manager' },
  { name: 'Clara Vendedora',       email: 'clara@uniconnect.com.br',      password: 'Vendedor@2025!', role: 'seller' },
  { name: 'Lidiane Vendedora',     email: 'lidiane@uniconnect.com.br',    password: 'Vendedor@2025!', role: 'seller' },
  { name: 'Jaiany Vendedora',      email: 'jaiany@uniconnect.com.br',     password: 'Vendedor@2025!', role: 'seller' },
  { name: 'Vitoria Vendedora',     email: 'vitoria@uniconnect.com.br',    password: 'Vendedor@2025!', role: 'seller' },
  { name: 'Financeiro UniConnect', email: 'financeiro@uniconnect.com.br', password: 'Finance@2025!',  role: 'finance' },
]

const cursos = [
  'Administração', 'Agente Comunitário de Saúde', 'Agrimensura', 'Agropecuária',
  'Agricultura', 'Biotecnologia', 'Eletromecânica', 'Enfermagem', 'Logística',
  'Meio Ambiente', 'Mineração', 'Qualidade', 'Recursos Humanos', 'Refrigeração e Climatização',
  'Segurança do Trabalho', 'Sistema de Energia Renovável', 'Soldagem', 'Telecomunicações',
  'Prevenção e Combate a Incêndio',
]

const nomes = [
  'Ana Paula Souza', 'Carlos Eduardo Lima', 'Fernanda Oliveira', 'Ricardo Mendes',
  'Juliana Castro', 'Marcos Alves', 'Patrícia Rocha', 'Bruno Ferreira',
  'Larissa Nunes', 'Thiago Barbosa', 'Camila Santos', 'Diego Pereira',
  'Gabriela Martins', 'Rafael Costa', 'Amanda Silva', 'Lucas Ribeiro',
  'Beatriz Almeida', 'Felipe Gomes', 'Mariana Araujo', 'Pedro Nascimento',
  'Isabela Cardoso', 'Mateus Duarte', 'Carolina Teixeira', 'Rodrigo Pinto',
  'Daniela Correia', 'André Moreira', 'Letícia Freitas', 'Gustavo Barros',
  'Vanessa Lopes', 'Leonardo Dias', 'Renata Machado', 'Eduardo Campos',
  'Priscila Vieira', 'Henrique Monteiro', 'Aline Carvalho', 'Luciano Farias',
  'Tatiana Melo', 'Caio Rezende', 'Simone Nogueira', 'Maurício Brito',
  'Sandra Oliveira', 'Paulo Henrique Silva', 'Débora Ferreira', 'Rogério Santos',
  'Cristina Nascimento', 'Fábio Costa', 'Viviane Almeida', 'Roberto Gomes',
  'Elaine Souza', 'Wagner Lima', 'Adriana Pereira', 'Sérgio Martins',
  'Luciana Barbosa', 'Márcio Ribeiro', 'Cláudia Araujo', 'Fernando Dias',
  'Juliane Freitas', 'Leandro Campos', 'Rosana Teixeira', 'Alexandre Pinto',
  'Natália Correia', 'Gilberto Moreira', 'Raquel Barros', 'Antônio Vieira',
  'Michele Cardoso', 'José Carlos Duarte', 'Elisa Machado', 'Ronaldo Monteiro',
  'Bianca Carvalho', 'Thales Farias', 'Kelly Melo', 'Reginaldo Rezende',
  'Sabrina Nogueira', 'Otávio Brito', 'Tânia Lopes', 'Cássio Ferreira',
  'Monique Santos', 'Vitor Hugo Lima', 'Ingrid Oliveira', 'Danilo Mendes',
]

const ddds = ['11', '21', '31', '41', '51', '85', '71', '62', '92', '81', '27', '48', '47', '19']
const cidades: Record<string, { city: string; state: string }> = {
  '11': { city: 'São Paulo', state: 'SP' },
  '21': { city: 'Rio de Janeiro', state: 'RJ' },
  '31': { city: 'Belo Horizonte', state: 'MG' },
  '41': { city: 'Curitiba', state: 'PR' },
  '51': { city: 'Porto Alegre', state: 'RS' },
  '85': { city: 'Fortaleza', state: 'CE' },
  '71': { city: 'Salvador', state: 'BA' },
  '62': { city: 'Goiânia', state: 'GO' },
  '92': { city: 'Manaus', state: 'AM' },
  '81': { city: 'Recife', state: 'PE' },
  '27': { city: 'Vitória', state: 'ES' },
  '48': { city: 'Florianópolis', state: 'SC' },
  '47': { city: 'Joinville', state: 'SC' },
  '19': { city: 'Campinas', state: 'SP' },
}

const lossReasons = [
  'Preço muito alto', 'Sem interesse no momento', 'Optou por outra instituição',
  'Não respondeu', 'Problemas financeiros', 'Mudou de cidade',
  'Curso não disponível na modalidade desejada', 'Desistência pessoal',
]

const sources = ['site', 'whatsapp', 'instagram', 'facebook', 'indicação', 'google-organic']

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomPhone(ddd: string): string {
  return `(${ddd}) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`
}
function randomDateInRange(startDaysAgo: number, endDaysAgo: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - randomInt(endDaysAgo, startDaysAgo))
  d.setHours(randomInt(8, 20), randomInt(0, 59), 0, 0)
  return d
}
function randomDate(daysAgo: number): Date {
  return randomDateInRange(daysAgo, 0)
}
function randomCpf(): string {
  const n = () => randomInt(0, 9)
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`
}

async function seedUsers() {
  console.log('Seeding users...')
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (!existing) {
      const result = await auth.api.signUpEmail({
        body: { name: u.name, email: u.email, password: u.password },
      })
      if (result?.user?.id) {
        await prisma.user.update({
          where: { id: result.user.id },
          data: { role: u.role as any },
        })
        console.log(`  ✓ Criado: ${u.email} [${u.role}]`)
      }
    } else {
      await prisma.user.update({
        where: { email: u.email },
        data: { role: u.role as any },
      })
      console.log(`  ~ Já existe: ${u.email} [${u.role}]`)
    }
  }
  console.log(`${users.length} usuários processados.\n`)
}

async function seedPaymentMethods() {
  console.log('Seeding formas de pagamento...')
  const methods = [
    { id: 'pm_pix', name: 'PIX', type: 'pix' as const, maxInstallments: null, feePercentage: 0, visibleOnEnrollment: true },
    { id: 'pm_credit_1x', name: 'Cartão de Crédito 1x', type: 'credit' as const, maxInstallments: 1, feePercentage: 2.99, visibleOnEnrollment: true },
    { id: 'pm_credit_2x', name: 'Cartão de Crédito 2x', type: 'credit' as const, maxInstallments: 2, feePercentage: 4.49, visibleOnEnrollment: true },
    { id: 'pm_credit_3x', name: 'Cartão de Crédito 3x', type: 'credit' as const, maxInstallments: 3, feePercentage: 5.49, visibleOnEnrollment: true },
    { id: 'pm_credit_4x', name: 'Cartão de Crédito 4x', type: 'credit' as const, maxInstallments: 4, feePercentage: 6.49, visibleOnEnrollment: true },
    { id: 'pm_credit_5x', name: 'Cartão de Crédito 5x', type: 'credit' as const, maxInstallments: 5, feePercentage: 7.49, visibleOnEnrollment: true },
    { id: 'pm_credit_6x', name: 'Cartão de Crédito 6x', type: 'credit' as const, maxInstallments: 6, feePercentage: 8.49, visibleOnEnrollment: true },
    { id: 'pm_credit_7x', name: 'Cartão de Crédito 7x', type: 'credit' as const, maxInstallments: 7, feePercentage: 9.49, visibleOnEnrollment: true },
    { id: 'pm_credit_8x', name: 'Cartão de Crédito 8x', type: 'credit' as const, maxInstallments: 8, feePercentage: 10.49, visibleOnEnrollment: true },
    { id: 'pm_credit_9x', name: 'Cartão de Crédito 9x', type: 'credit' as const, maxInstallments: 9, feePercentage: 11.49, visibleOnEnrollment: true },
    { id: 'pm_credit_10x', name: 'Cartão de Crédito 10x', type: 'credit' as const, maxInstallments: 10, feePercentage: 12.49, visibleOnEnrollment: true },
    { id: 'pm_credit_11x', name: 'Cartão de Crédito 11x', type: 'credit' as const, maxInstallments: 11, feePercentage: 13.49, visibleOnEnrollment: true },
    { id: 'pm_credit_12x', name: 'Cartão de Crédito 12x', type: 'credit' as const, maxInstallments: 12, feePercentage: 14.49, visibleOnEnrollment: true },
    { id: 'pm_debit', name: 'Cartão de Débito', type: 'debit' as const, maxInstallments: 1, feePercentage: 1.99, visibleOnEnrollment: true },
  ]

  for (const m of methods) {
    await prisma.paymentMethod.upsert({
      where: { id: m.id },
      update: { feePercentage: m.feePercentage, name: m.name },
      create: m as any,
    })
  }
  console.log(`${methods.length} formas de pagamento criadas.\n`)
}

async function seedSellerConfigs() {
  console.log('Seeding configurações de vendedores...')
  const sellers = await prisma.user.findMany({ where: { role: 'seller' } })
  for (const s of sellers) {
    await prisma.sellerConfig.upsert({
      where: { userId: s.id },
      update: {},
      create: {
        id: `sc_${s.id.slice(0, 8)}`,
        userId: s.id,
        minValue: 599.90,
        maxValue: 1299.90,
      },
    })
  }
  console.log(`${sellers.length} configurações de vendedores.\n`)
}

async function seedLeads() {
  const TOTAL_LEADS = 80
  console.log(`Seeding leads (${TOTAL_LEADS} leads spread over 6 months)...`)

  const sellers = await prisma.user.findMany({ where: { role: 'seller' } })
  if (sellers.length === 0) {
    console.log('  ⚠ Nenhum vendedor encontrado, pulando...\n')
    return
  }

  const paymentMethods = await prisma.paymentMethod.findMany()
  const statuses: Array<{ status: string; weight: number }> = [
    { status: 'pending', weight: 20 },
    { status: 'contacted', weight: 18 },
    { status: 'negociating', weight: 12 },
    { status: 'confirmPayment', weight: 8 },
    { status: 'converted', weight: 30 },
    { status: 'lost', weight: 12 },
  ]

  function weightedStatus(): string {
    const total = statuses.reduce((a, b) => a + b.weight, 0)
    let r = Math.random() * total
    for (const s of statuses) {
      r -= s.weight
      if (r <= 0) return s.status
    }
    return 'pending'
  }

  for (let i = 0; i < TOTAL_LEADS; i++) {
    const leadId = `lead_${String(i + 1).padStart(3, '0')}`
    const ddd = randomItem(ddds)
    const loc = cidades[ddd]
    const status = weightedStatus()
    const seller = sellers[i % sellers.length]
    const curso = randomItem(cursos)
    const value = randomInt(5, 12) * 100 + 99.90
    const createdAt = randomDateInRange(180, 0)

    const nome = nomes[i] || `Lead Teste ${i + 1}`
    const emailName = nome.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const leadData: any = {
      id: leadId,
      name: nome,
      email: `${emailName}@email.com`,
      phone: randomPhone(ddd),
      cpf: Math.random() > 0.3 ? randomCpf() : null,
      birthDate: Math.random() > 0.4 ? `${randomInt(1985, 2002)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}` : null,
      city: loc.city,
      state: loc.state,
      course: curso,
      courseValue: value,
      status: status as any,
      source: randomItem(sources),
      assignedTo: seller.id,
      sessionId: `sess_${crypto.randomUUID().slice(0, 8)}`,
      createdAt,
    }

    if (status === 'lost') {
      leadData.lossReason = randomItem(lossReasons)
      leadData.stagesBeforeLoss = ['pending', 'contacted'].slice(0, randomInt(1, 2)).join(',')
      leadData.lostAt = new Date(createdAt.getTime() + randomInt(1, 14) * 86400000)
    }

    if (status === 'converted') {
      leadData.convertedAt = new Date(createdAt.getTime() + randomInt(1, 21) * 86400000)
      const pm = randomItem(paymentMethods)
      leadData.paymentMethodId = pm.id
      leadData.installments = pm.maxInstallments || 1
      leadData.address = `Rua ${randomItem(['das Flores', 'Principal', 'São Paulo', 'dos Bandeirantes', 'XV de Novembro'])}`
      leadData.houseNumber = String(randomInt(1, 999))
      leadData.neighborhood = randomItem(['Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cruz'])
      leadData.zipCode = `${randomInt(10000, 99999)}-${randomInt(100, 999)}`
      leadData.civilStatus = randomItem(['solteiro', 'casado', 'divorciado'])
      leadData.rg = `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`
    }

    await prisma.lead.upsert({
      where: { id: leadId },
      update: {},
      create: leadData,
    })
  }

  console.log(`${TOTAL_LEADS} leads criados.\n`)
}

async function seedMatriculasAndFinances() {
  console.log('Seeding matrículas e financeiro...')

  const convertedLeads = await prisma.lead.findMany({
    where: { status: 'converted' },
    include: { paymentMethod: true },
  })

  const matStatuses = ['ativa', 'ativa', 'ativa', 'concluida', 'cancelada', 'trancada'] as const
  let matCount = 0
  for (const lead of convertedLeads) {
    const matId = `mat_${lead.id}`
    const numero = `UC-2026-${String(matCount + 1).padStart(4, '0')}`

    await prisma.matricula.upsert({
      where: { id: matId },
      update: {},
      create: {
        id: matId,
        leadId: lead.id,
        numero,
        status: randomItem([...matStatuses]) as any,
        modalidade: randomItem(['regular', 'aproveitamento', 'competencia'] as any[]),
        dataInicio: lead.convertedAt || lead.createdAt,
      },
    })

    const amount = lead.courseValue || 999.90
    const fee = lead.paymentMethod ? (amount * lead.paymentMethod.feePercentage / 100) : 0
    const net = amount - fee

    await prisma.finance.upsert({
      where: { leadId: lead.id },
      update: {},
      create: {
        id: `fin_${lead.id}`,
        leadId: lead.id,
        amount,
        netAmount: net,
        feeAmount: fee,
        installments: lead.installments || 1,
        type: 'leadPayment',
        category: 'matricula',
        description: `Matrícula ${numero} - ${lead.course}`,
        userId: lead.assignedTo || '',
        paymentMethodId: lead.paymentMethodId,
        transactionDate: lead.convertedAt || lead.createdAt,
      },
    })

    matCount++
  }

  // Add manual finance entries spread over months
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
  if (admin) {
    const manualEntries = [
      { id: 'fin_manual_01', amount: 2500, type: 'out' as const, category: 'aluguel', description: 'Aluguel do escritório - Janeiro', transactionDate: randomDateInRange(180, 150) },
      { id: 'fin_manual_02', amount: 2500, type: 'out' as const, category: 'aluguel', description: 'Aluguel do escritório - Fevereiro', transactionDate: randomDateInRange(150, 120) },
      { id: 'fin_manual_03', amount: 2500, type: 'out' as const, category: 'aluguel', description: 'Aluguel do escritório - Março', transactionDate: randomDateInRange(120, 90) },
      { id: 'fin_manual_04', amount: 1800, type: 'out' as const, category: 'marketing', description: 'Google Ads - Janeiro', transactionDate: randomDateInRange(170, 150) },
      { id: 'fin_manual_05', amount: 2200, type: 'out' as const, category: 'marketing', description: 'Google Ads - Fevereiro', transactionDate: randomDateInRange(140, 120) },
      { id: 'fin_manual_06', amount: 2800, type: 'out' as const, category: 'marketing', description: 'Google Ads + Meta Ads - Março', transactionDate: randomDateInRange(110, 90) },
      { id: 'fin_manual_07', amount: 450, type: 'out' as const, category: 'material', description: 'Material de escritório', transactionDate: randomDateInRange(100, 60) },
      { id: 'fin_manual_08', amount: 5000, type: 'in' as const, category: 'outros', description: 'Consultoria educacional', transactionDate: randomDateInRange(45, 30) },
      { id: 'fin_manual_09', amount: 850, type: 'out' as const, category: 'internet', description: 'Internet e telefonia - Bimestre', transactionDate: randomDateInRange(60, 30) },
      { id: 'fin_manual_10', amount: 3200, type: 'out' as const, category: 'salarios', description: 'Folha de pagamento complementar', transactionDate: randomDateInRange(30, 10) },
      { id: 'fin_manual_11', amount: 1500, type: 'in' as const, category: 'outros', description: 'Parceria institucional - Prefeitura', transactionDate: randomDateInRange(20, 5) },
      { id: 'fin_manual_12', amount: 600, type: 'out' as const, category: 'software', description: 'Licenças de software', transactionDate: randomDateInRange(15, 1) },
    ]

    for (const entry of manualEntries) {
      await prisma.finance.upsert({
        where: { id: entry.id },
        update: {},
        create: {
          ...entry,
          userId: admin.id,
          netAmount: entry.amount,
          feeAmount: 0,
        } as any,
      })
    }
  }

  console.log(`${matCount} matrículas e registros financeiros criados.\n`)
}

async function seedLeadHistory() {
  console.log('Seeding histórico de leads...')

  const leads = await prisma.lead.findMany({ take: 60 })
  let count = 0

  for (const lead of leads) {
    const historyEntries = [
      { action: 'Lead criado via ' + (lead.source || 'site'), fromStatus: null, toStatus: 'pending' },
    ]

    if (['contacted', 'negociating', 'confirmPayment', 'converted', 'lost'].includes(lead.status)) {
      historyEntries.push({ action: 'Status alterado para Em Contato', fromStatus: 'pending', toStatus: 'contacted' })
    }
    if (['negociating', 'confirmPayment', 'converted'].includes(lead.status)) {
      historyEntries.push({ action: 'Status alterado para Negociação', fromStatus: 'contacted', toStatus: 'negociating' })
    }
    if (['confirmPayment', 'converted'].includes(lead.status)) {
      historyEntries.push({ action: 'Status alterado para Confirmar Pagamento', fromStatus: 'negociating', toStatus: 'confirmPayment' })
    }
    if (lead.status === 'converted') {
      historyEntries.push({ action: 'Lead convertido!', fromStatus: 'confirmPayment', toStatus: 'converted' })
    }
    if (lead.status === 'lost') {
      historyEntries.push({ action: `Lead perdido: ${lead.lossReason || 'Motivo não informado'}`, fromStatus: lead.stagesBeforeLoss?.split(',').pop() || 'pending', toStatus: 'lost' })
    }

    for (let j = 0; j < historyEntries.length; j++) {
      const h = historyEntries[j]
      await prisma.leadHistory.upsert({
        where: { id: `lh_${lead.id}_${j}` },
        update: {},
        create: {
          id: `lh_${lead.id}_${j}`,
          leadId: lead.id,
          action: h.action,
          fromStatus: h.fromStatus,
          toStatus: h.toStatus,
          userId: lead.assignedTo,
          createdAt: new Date(lead.createdAt.getTime() + j * 3600000),
        },
      })
      count++
    }
  }

  console.log(`${count} entradas de histórico criadas.\n`)
}

async function seedNotificacoes() {
  console.log('Seeding notificações...')

  const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
  const sellers = await prisma.user.findMany({ where: { role: 'seller' } })

  if (!admin || sellers.length === 0) {
    console.log('  ⚠ Usuários não encontrados para notificações, pulando...\n')
    return
  }

  const notificacoes = [
    { id: 'not_01', userId: admin.id, titulo: 'Novo lead recebido', mensagem: 'Ana Paula Souza se cadastrou pelo site.', tipo: 'info' as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_02', userId: admin.id, titulo: 'Matrícula realizada', mensagem: 'Juliana Castro concluiu o processo de matrícula.', tipo: 'sucesso' as const, linkUrl: '/admin/matriculas' },
    { id: 'not_03', userId: admin.id, titulo: '5 leads sem contato há 3 dias', mensagem: 'Atenção: leads parados na coluna "Novos" sem interação.', tipo: 'alerta' as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_04', userId: admin.id, titulo: 'Meta de vendas atingida', mensagem: 'Parabéns! A equipe atingiu a meta mensal de vendas.', tipo: 'sucesso' as const, linkUrl: '/admin/relatorios' },
    { id: 'not_05', userId: admin.id, titulo: 'Novo pagamento confirmado', mensagem: 'Pagamento de R$ 999,90 via PIX confirmado - Logística.', tipo: 'info' as const, linkUrl: '/admin/financeiro' },
    { id: 'not_06', userId: sellers[0].id, titulo: 'Novo lead atribuído', mensagem: 'Você recebeu um novo lead: Carlos Eduardo Lima.', tipo: 'info' as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_07', userId: sellers[0].id, titulo: 'Lead convertido!', mensagem: 'Parabéns! Thiago Barbosa realizou a matrícula.', tipo: 'sucesso' as const },
    { id: 'not_08', userId: sellers[1]?.id || sellers[0].id, titulo: 'Novo lead atribuído', mensagem: 'Você recebeu um novo lead: Fernanda Oliveira.', tipo: 'info' as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_09', userId: sellers[2]?.id || sellers[0].id, titulo: 'Lembrete: Follow-up pendente', mensagem: '3 leads aguardam retorno há mais de 48h.', tipo: 'alerta' as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_10', userId: sellers[3]?.id || sellers[0].id, titulo: 'Lead convertido!', mensagem: 'Parabéns! Amanda Silva realizou a matrícula.', tipo: 'sucesso' as const },
  ]

  for (const not of notificacoes) {
    await prisma.notificacao.upsert({
      where: { id: not.id },
      update: {},
      create: not,
    })
  }

  console.log(`${notificacoes.length} notificações criadas.\n`)
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  UniConnect - Seed Database')
  console.log('═══════════════════════════════════════════\n')

  await seedUsers()
  await seedPaymentMethods()
  await seedSellerConfigs()
  await seedLeads()
  await seedMatriculasAndFinances()
  await seedLeadHistory()
  await seedNotificacoes()

  console.log('═══════════════════════════════════════════')
  console.log('  ✅ Seed concluído com sucesso!')
  console.log('═══════════════════════════════════════════')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
