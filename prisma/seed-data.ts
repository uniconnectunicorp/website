import { config } from 'dotenv'
config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || ''
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// ─── Data ─────────────────────────────────────────────────────────────────────

const cursos = [
  'Técnico em Logística', 'Técnico em Segurança do Trabalho', 'Técnico em Administração',
  'Técnico em Informática', 'Técnico em Recursos Humanos', 'Técnico em Contabilidade',
  'Técnico em Marketing e Comunicação', 'Técnico em Eletrônica', 'Técnico em Mecânica',
  'Técnico em Eletrotécnica', 'Técnico em Nutrição e Dieta', 'Técnico em Redes de Computadores',
  'Técnico em Edificações', 'Técnico em Automação Industrial', 'Técnico em Meio Ambiente',
  'Técnico em Agropecuária', 'Técnico em Soldagem', 'Técnico em Mineração',
  'Técnico em Refrigeração e Climatização', 'Técnico em Desenvolvimento de Sistemas',
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
  'Vera Lúcia Pinto', 'Henrique Souza', 'Marisa Carvalho', 'Flávia Nunes',
  'Geraldo Lima', 'Tereza Santos', 'Cintia Ferreira', 'Waldir Costa',
  'Nathalia Rocha', 'Ítalo Ribeiro', 'Luana Alves', 'Marcos Vinicius Silva',
  'Eliana Gomes', 'Diogo Nascimento', 'Viviane Teixeira', 'Humberto Cardoso',
  'Jéssica Barbosa', 'Evandro Duarte', 'Sueli Araujo', 'Cleverson Freitas',
  'Rosimeire Barros', 'Fabrício Monteiro', 'Telma Carvalho', 'Nilson Farias',
  'Adriane Melo', 'Cleberson Rezende', 'Francisca Nogueira', 'Genivaldo Brito',
  'Rosângela Lopes', 'Iranildo Dias', 'Edna Campos', 'Silvio Correia',
  'Valdirene Moreira', 'Reinaldo Vieira', 'Norma Pinto', 'Jovino Ferreira',
  'Iracema Santos', 'Laercio Costa', 'Glaucia Ribeiro', 'Oziel Almeida',
  'Zenilda Gomes', 'Aristides Nascimento', 'Elza Teixeira', 'Valter Cardoso',
  'Neuza Barbosa', 'Elio Duarte', 'Sônia Araujo', 'Aloisio Freitas',
  'Neide Barros', 'Sebastião Monteiro', 'Ivone Carvalho', 'Maurilho Farias',
  'Lindalva Melo', 'Everaldo Rezende', 'Divina Nogueira', 'Creuza Brito',
  'Evaristo Lopes', 'Jaci Dias', 'Ordália Campos', 'Lindomar Correia',
  'Erondina Moreira', 'Orivaldo Vieira', 'Iraci Pinto', 'Wanderley Ferreira',
  'Aparecida Santos', 'Nildo Costa', 'Raimunda Ribeiro', 'Ozias Almeida',
  'Florinda Gomes', 'Manoel Nascimento', 'Creusa Teixeira', 'Dorival Cardoso',
  'Dinalva Barbosa', 'Gilmar Duarte', 'Nadir Araujo', 'Oreste Freitas',
  'Nair Barros', 'Clodomiro Monteiro', 'Ondina Carvalho', 'Jardelino Farias',
  'Alzira Melo', 'Eudoro Rezende', 'Ieda Nogueira', 'Cidinho Brito',
]

const ddds = ['11', '21', '31', '41', '51', '85', '71', '62', '81', '27', '48', '19']
const cidades: Record<string, { city: string; state: string }> = {
  '11': { city: 'São Paulo', state: 'SP' },
  '21': { city: 'Rio de Janeiro', state: 'RJ' },
  '31': { city: 'Belo Horizonte', state: 'MG' },
  '41': { city: 'Curitiba', state: 'PR' },
  '51': { city: 'Porto Alegre', state: 'RS' },
  '85': { city: 'Fortaleza', state: 'CE' },
  '71': { city: 'Salvador', state: 'BA' },
  '62': { city: 'Goiânia', state: 'GO' },
  '81': { city: 'Recife', state: 'PE' },
  '27': { city: 'Vitória', state: 'ES' },
  '48': { city: 'Florianópolis', state: 'SC' },
  '19': { city: 'Campinas', state: 'SP' },
}

const lossReasons = [
  'Preço muito alto', 'Sem interesse no momento', 'Optou por outra instituição',
  'Não respondeu', 'Problemas financeiros', 'Mudou de cidade', 'Desistência pessoal',
]
const sources = ['site', 'whatsapp', 'instagram', 'facebook', 'indicação', 'google-organic']
const ruas = ['das Flores', 'Principal', 'São Paulo', 'dos Bandeirantes', 'XV de Novembro', 'das Acácias']
const bairros = ['Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cruz', 'Jardim Europa']

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function randomPhone(ddd: string): string { return `(${ddd}) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}` }
function randomDateInRange(startDaysAgo: number, endDaysAgo: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - randomInt(endDaysAgo, startDaysAgo))
  d.setHours(randomInt(8, 20), randomInt(0, 59), 0, 0)
  return d
}
function randomCpf(): string {
  const n = () => randomInt(0, 9)
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`
}

// ─── Payment Methods ───────────────────────────────────────────────────────────

async function seedPaymentMethods() {
  console.log('Seeding formas de pagamento...')
  const methods = [
    { id: 'pm_pix',       name: 'PIX',                   type: 'pix'    as const, maxInstallments: null, feePercentage: 0,     visibleOnEnrollment: true },
    { id: 'pm_credit_1x', name: 'Cartão de Crédito 1x',  type: 'credit' as const, maxInstallments: 1,    feePercentage: 2.99,  visibleOnEnrollment: true },
    { id: 'pm_credit_3x', name: 'Cartão de Crédito 3x',  type: 'credit' as const, maxInstallments: 3,    feePercentage: 5.49,  visibleOnEnrollment: true },
    { id: 'pm_credit_6x', name: 'Cartão de Crédito 6x',  type: 'credit' as const, maxInstallments: 6,    feePercentage: 8.49,  visibleOnEnrollment: true },
    { id: 'pm_credit_10x',name: 'Cartão de Crédito 10x', type: 'credit' as const, maxInstallments: 10,   feePercentage: 12.49, visibleOnEnrollment: true },
    { id: 'pm_credit_12x',name: 'Cartão de Crédito 12x', type: 'credit' as const, maxInstallments: 12,   feePercentage: 14.49, visibleOnEnrollment: true },
    { id: 'pm_debit',     name: 'Cartão de Débito',      type: 'debit'  as const, maxInstallments: 1,    feePercentage: 1.99,  visibleOnEnrollment: true },
  ]
  for (const m of methods) {
    await prisma.paymentMethod.upsert({
      where: { id: m.id },
      update: { name: m.name, feePercentage: m.feePercentage },
      create: m as any,
    })
  }
  console.log(`  ✓ ${methods.length} formas de pagamento\n`)
  return methods
}

// ─── Seller Configs ────────────────────────────────────────────────────────────

async function seedSellerConfigs() {
  console.log('Seeding seller configs...')
  const sellers = await prisma.user.findMany({ where: { role: 'seller' } })
  for (const s of sellers) {
    await prisma.sellerConfig.upsert({
      where: { userId: s.id },
      update: {},
      create: { id: `sc_${s.id.slice(0, 8)}`, userId: s.id, minValue: 599.90, maxValue: 1299.90 },
    })
  }
  console.log(`  ✓ ${sellers.length} seller configs\n`)
  return sellers
}

// ─── Leads ─────────────────────────────────────────────────────────────────────

async function seedLeads(sellers: any[], paymentMethods: any[]) {
  const TOTAL = 200
  console.log(`Seeding ${TOTAL} leads (6 meses)...`)

  if (sellers.length === 0) { console.log('  ⚠ Nenhum vendedor, pulando\n'); return }

  // weighted status distribution
  const statusPool = [
    ...Array(40).fill('pending'),
    ...Array(34).fill('contacted'),
    ...Array(22).fill('negociating'),
    ...Array(10).fill('confirmPayment'),
    ...Array(64).fill('converted'),
    ...Array(30).fill('lost'),
  ]

  // 6 monthly buckets: each ~33 leads, older months have lower daysAgo ranges
  const monthBuckets = [
    { start: 180, end: 151 }, // ~6 months ago
    { start: 150, end: 121 }, // ~5 months ago
    { start: 120, end: 91  }, // ~4 months ago
    { start: 90,  end: 61  }, // ~3 months ago
    { start: 60,  end: 31  }, // ~2 months ago
    { start: 30,  end: 1   }, // ~last month
  ]

  let created = 0
  let skipped = 0
  for (let i = 0; i < TOTAL; i++) {
    const leadId = `lead_seed_${String(i + 1).padStart(3, '0')}`
    const existing = await prisma.lead.findUnique({ where: { id: leadId } })
    if (existing) { skipped++; continue }

    const bucket = monthBuckets[Math.floor(i / Math.ceil(TOTAL / 6)) % 6]
    const ddd = randomItem(ddds)
    const loc = cidades[ddd]
    const status = statusPool[i % statusPool.length]
    const seller = sellers[i % sellers.length]
    const curso = randomItem(cursos)
    const value = [599.90, 699.90, 799.90, 899.90, 999.90, 1099.90, 1199.90, 1299.90][randomInt(0, 7)]
    const createdAt = randomDateInRange(bucket.start, bucket.end)
    const nome = nomes[i % nomes.length]
    const emailName = nome.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const leadData: any = {
      id: leadId,
      name: nome,
      email: `${emailName}.${i + 1}@email.com`,
      phone: randomPhone(ddd),
      cpf: Math.random() > 0.3 ? randomCpf() : null,
      birthDate: `${randomInt(1975, 2002)}-${String(randomInt(1, 12)).padStart(2, '0')}-${String(randomInt(1, 28)).padStart(2, '0')}`,
      city: loc.city,
      state: loc.state,
      course: curso,
      courseValue: value,
      status: status as any,
      source: randomItem(sources),
      assignedTo: seller.id,
      sessionId: `sess_seed_${i}`,
      createdAt,
      updatedAt: createdAt,
    }

    if (status === 'lost') {
      leadData.lossReason = randomItem(lossReasons)
      leadData.stagesBeforeLoss = randomItem(['pending', 'contacted', 'contacted,negociating'])
      leadData.lostAt = new Date(createdAt.getTime() + randomInt(1, 14) * 86400000)
    }

    if (status === 'converted') {
      const convertedAt = new Date(createdAt.getTime() + randomInt(1, 21) * 86400000)
      const pm = randomItem(paymentMethods)
      leadData.convertedAt = convertedAt
      leadData.paymentMethodId = pm.id
      leadData.installments = pm.maxInstallments || 1
      leadData.address = `Rua ${randomItem(ruas)}`
      leadData.houseNumber = String(randomInt(1, 999))
      leadData.neighborhood = randomItem(bairros)
      leadData.zipCode = `${randomInt(10000, 99999)}-${randomInt(100, 999)}`
      leadData.civilStatus = randomItem(['solteiro', 'casado', 'divorciado'])
      leadData.rg = `${randomInt(10, 99)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(0, 9)}`
    }

    await prisma.lead.create({ data: leadData })
    created++
  }
  console.log(`  ✓ ${created} leads criados${skipped > 0 ? `, ${skipped} já existiam` : ''}\n`)
}

// ─── Matrículas + Financeiro ───────────────────────────────────────────────────

async function seedMatriculasEFinanceiro() {
  console.log('Seeding matrículas e financeiro...')

  const admin = await prisma.user.findFirst({ where: { role: { in: ['admin', 'director'] } } })
  if (!admin) { console.log('  ⚠ Admin não encontrado\n'); return }

  const convertedLeads = await prisma.lead.findMany({
    where: { status: 'converted', matricula: null },
    include: { paymentMethod: true },
  })

  const matStatuses = ['ativa', 'ativa', 'ativa', 'ativa', 'concluida', 'trancada'] as const
  const modalidades = ['regular', 'regular', 'regular', 'aproveitamento', 'competencia'] as const
  const existingMatCount = await prisma.matricula.count()
  let matCount = existingMatCount

  for (const lead of convertedLeads) {
    const matId = `mat_seed_${lead.id}`
    const numero = `UC-2026-${String(matCount + 1).padStart(4, '0')}`
    const dataInicio = lead.convertedAt || lead.createdAt

    // skip if finance already exists
    const finExists = await prisma.finance.findUnique({ where: { leadId: lead.id } })
    if (!finExists) {
      const amount = lead.courseValue || 999.90
      const feePerc = lead.paymentMethod?.feePercentage || 0
      const feeAmount = parseFloat((amount * feePerc / 100).toFixed(2))
      const netAmount = parseFloat((amount - feeAmount).toFixed(2))

      await prisma.finance.create({
        data: {
          id: `fin_seed_${lead.id}`,
          leadId: lead.id,
          amount,
          netAmount,
          feeAmount,
          installments: lead.installments || 1,
          type: 'leadPayment',
          category: 'matricula',
          description: `Matrícula - ${lead.course}`,
          userId: lead.assignedTo || admin.id,
          paymentMethodId: lead.paymentMethodId,
          transactionDate: dataInicio,
        },
      })
    }

    const matExists = await prisma.matricula.findUnique({ where: { leadId: lead.id } })
    if (!matExists) {
      await prisma.matricula.create({
        data: {
          id: matId,
          leadId: lead.id,
          numero,
          status: randomItem([...matStatuses]) as any,
          modalidade: randomItem([...modalidades]) as any,
          dataInicio,
        },
      })
      matCount++
    }
  }

  // Despesas e entradas manuais espalhadas nos últimos 6 meses
  const manualEntries = [
    { id: 'fin_desp_01', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [180, 160] },
    { id: 'fin_desp_02', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [150, 130] },
    { id: 'fin_desp_03', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [120, 100] },
    { id: 'fin_desp_04', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [90,  70]  },
    { id: 'fin_desp_05', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [60,  45]  },
    { id: 'fin_desp_06', amount: 2500,  type: 'out', category: 'aluguel',    description: 'Aluguel do escritório',           daysAgoRange: [30,  15]  },
    { id: 'fin_desp_07', amount: 1800,  type: 'out', category: 'marketing',  description: 'Google Ads',                      daysAgoRange: [170, 155] },
    { id: 'fin_desp_08', amount: 2200,  type: 'out', category: 'marketing',  description: 'Google Ads + Meta Ads',           daysAgoRange: [140, 125] },
    { id: 'fin_desp_09', amount: 2800,  type: 'out', category: 'marketing',  description: 'Google Ads + Meta Ads',           daysAgoRange: [110, 95]  },
    { id: 'fin_desp_10', amount: 3100,  type: 'out', category: 'marketing',  description: 'Google Ads + Meta Ads',           daysAgoRange: [80,  65]  },
    { id: 'fin_desp_11', amount: 2600,  type: 'out', category: 'marketing',  description: 'Google Ads',                      daysAgoRange: [50,  35]  },
    { id: 'fin_desp_12', amount: 3400,  type: 'out', category: 'marketing',  description: 'Google Ads + Instagram Ads',      daysAgoRange: [20,  8]   },
    { id: 'fin_desp_13', amount: 450,   type: 'out', category: 'material',   description: 'Material de escritório',          daysAgoRange: [100, 80]  },
    { id: 'fin_desp_14', amount: 850,   type: 'out', category: 'internet',   description: 'Internet e telefonia',            daysAgoRange: [90,  70]  },
    { id: 'fin_desp_15', amount: 850,   type: 'out', category: 'internet',   description: 'Internet e telefonia',            daysAgoRange: [30,  15]  },
    { id: 'fin_desp_16', amount: 3200,  type: 'out', category: 'salarios',   description: 'Folha de pagamento complementar', daysAgoRange: [30,  25]  },
    { id: 'fin_desp_17', amount: 600,   type: 'out', category: 'outros',     description: 'Licenças de software',            daysAgoRange: [15,  5]   },
    { id: 'fin_entr_01', amount: 5000,  type: 'in',  category: 'outros',     description: 'Consultoria educacional',         daysAgoRange: [45,  35]  },
    { id: 'fin_entr_02', amount: 1500,  type: 'in',  category: 'outros',     description: 'Parceria institucional',          daysAgoRange: [20,  10]  },
  ]

  for (const entry of manualEntries) {
    const existing = await prisma.finance.findUnique({ where: { id: entry.id } })
    if (existing) continue
    await prisma.finance.create({
      data: {
        id: entry.id,
        amount: entry.amount,
        netAmount: entry.amount,
        feeAmount: 0,
        type: entry.type as any,
        category: entry.category,
        description: entry.description,
        userId: admin.id,
        transactionDate: randomDateInRange(entry.daysAgoRange[0], entry.daysAgoRange[1]),
      },
    })
  }

  console.log(`  ✓ ${matCount} matrículas + ${manualEntries.length} lançamentos manuais\n`)
}

// ─── Lead History ──────────────────────────────────────────────────────────────

async function seedLeadHistory() {
  console.log('Seeding histórico de leads...')
  const leads = await prisma.lead.findMany({
    where: { id: { startsWith: 'lead_seed_' } },
    select: { id: true, status: true, source: true, assignedTo: true, createdAt: true, lossReason: true, stagesBeforeLoss: true },
  })

  let count = 0
  for (const lead of leads) {
    const pipeline = ['pending', 'contacted', 'negociating', 'confirmPayment']
    const statusOrder = [...pipeline, lead.status === 'converted' ? 'converted' : lead.status === 'lost' ? 'lost' : ''].filter(Boolean)
    const reached = statusOrder.slice(0, statusOrder.indexOf(lead.status) + 1)

    for (let j = 0; j < reached.length; j++) {
      const histId = `lh_seed_${lead.id}_${j}`
      const existing = await prisma.leadHistory.findUnique({ where: { id: histId } })
      if (existing) continue

      const actions: Record<string, string> = {
        pending: `Lead criado via ${lead.source || 'site'}`,
        contacted: 'Primeiro contato realizado',
        negociating: 'Em negociação',
        confirmPayment: 'Aguardando confirmação de pagamento',
        converted: 'Matrícula confirmada! Lead convertido.',
        lost: `Lead perdido: ${lead.lossReason || 'Motivo não informado'}`,
      }

      await prisma.leadHistory.create({
        data: {
          id: histId,
          leadId: lead.id,
          action: actions[reached[j]] || reached[j],
          fromStatus: j > 0 ? reached[j - 1] : null,
          toStatus: reached[j],
          userId: lead.assignedTo,
          createdAt: new Date(lead.createdAt.getTime() + j * randomInt(1, 3) * 3600000),
        },
      })
      count++
    }
  }
  console.log(`  ✓ ${count} entradas de histórico\n`)
}

// ─── Notificações ──────────────────────────────────────────────────────────────

async function seedNotificacoes() {
  console.log('Seeding notificações...')
  const admin = await prisma.user.findFirst({ where: { role: { in: ['admin', 'director'] } } })
  const sellers = await prisma.user.findMany({ where: { role: 'seller' } })
  if (!admin) { console.log('  ⚠ Nenhum admin\n'); return }

  const nots = [
    { id: 'not_s_01', userId: admin.id,                          titulo: 'Novo lead recebido',        mensagem: 'Ana Paula Souza se cadastrou pelo site.',               tipo: 'info'    as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_s_02', userId: admin.id,                          titulo: 'Matrícula realizada',       mensagem: 'Juliana Castro concluiu o processo de matrícula.',      tipo: 'sucesso' as const, linkUrl: '/admin/matriculas' },
    { id: 'not_s_03', userId: admin.id,                          titulo: 'Leads sem contato',         mensagem: '5 leads parados há mais de 3 dias.',                    tipo: 'alerta'  as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_s_04', userId: admin.id,                          titulo: 'Meta atingida!',            mensagem: 'A equipe atingiu a meta mensal de vendas.',             tipo: 'sucesso' as const, linkUrl: '/admin/relatorios' },
    { id: 'not_s_05', userId: sellers[0]?.id || admin.id,        titulo: 'Novo lead atribuído',       mensagem: 'Você recebeu um novo lead: Carlos Eduardo Lima.',        tipo: 'info'    as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_s_06', userId: sellers[0]?.id || admin.id,        titulo: 'Lead convertido!',          mensagem: 'Parabéns! Thiago Barbosa realizou a matrícula.',         tipo: 'sucesso' as const },
    { id: 'not_s_07', userId: sellers[1]?.id || admin.id,        titulo: 'Follow-up pendente',        mensagem: '3 leads aguardam retorno há mais de 48h.',              tipo: 'alerta'  as const, linkUrl: '/admin/crm-pipeline' },
    { id: 'not_s_08', userId: sellers[2]?.id || admin.id,        titulo: 'Lead convertido!',          mensagem: 'Amanda Silva realizou a matrícula.',                    tipo: 'sucesso' as const },
  ]

  for (const n of nots) {
    await prisma.notificacao.upsert({ where: { id: n.id }, update: {}, create: n })
  }
  console.log(`  ✓ ${nots.length} notificações\n`)
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('  UniConnect — Seed de Dados de Teste')
  console.log('═══════════════════════════════════════\n')

  const pms = await seedPaymentMethods()
  const sellers = await seedSellerConfigs()
  await seedLeads(sellers, pms)
  await seedMatriculasEFinanceiro()
  await seedLeadHistory()
  await seedNotificacoes()

  console.log('═══════════════════════════════════════')
  console.log('  ✅ Seed concluído!')
  console.log('═══════════════════════════════════════\n')
}

main()
  .catch((e) => { console.error('Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
