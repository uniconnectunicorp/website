import { config } from 'dotenv'
import { prisma } from "../src/lib/prisma";

config()


const leads = [
  {
    id: 'lead_01',
    name: 'Ana Paula Souza',
    email: 'ana.souza@email.com',
    phone: '(11) 91234-5678',
    cpf: '123.456.789-00',
    birthDate: '1995-03-12',
    city: 'São Paulo',
    state: 'SP',
    course: 'Administração',
    status: 'pending',
    source: 'site',
    campaign: 'google-ads',
  },
  {
    id: 'lead_02',
    name: 'Carlos Eduardo Lima',
    email: 'carlos.lima@email.com',
    phone: '(21) 98765-4321',
    cpf: '234.567.890-11',
    birthDate: '1990-07-25',
    city: 'Rio de Janeiro',
    state: 'RJ',
    course: 'Direito',
    status: 'contacted',
    source: 'instagram',
    campaign: 'meta-ads',
  },
  {
    id: 'lead_03',
    name: 'Fernanda Oliveira',
    email: 'fernanda.oliveira@email.com',
    phone: '(31) 97654-3210',
    cpf: '345.678.901-22',
    birthDate: '1998-11-08',
    city: 'Belo Horizonte',
    state: 'MG',
    course: 'Psicologia',
    status: 'negociating',
    source: 'facebook',
    campaign: 'meta-ads',
  },
  {
    id: 'lead_04',
    name: 'Ricardo Mendes',
    email: 'ricardo.mendes@email.com',
    phone: '(41) 96543-2109',
    cpf: '456.789.012-33',
    birthDate: '1993-05-17',
    city: 'Curitiba',
    state: 'PR',
    course: 'Engenharia Civil',
    status: 'confirmPayment',
    source: 'site',
    paymentMethod: 'boleto',
  },
  {
    id: 'lead_05',
    name: 'Juliana Castro',
    email: 'juliana.castro@email.com',
    phone: '(51) 95432-1098',
    cpf: '567.890.123-44',
    birthDate: '1997-09-30',
    city: 'Porto Alegre',
    state: 'RS',
    course: 'Medicina',
    status: 'converted',
    source: 'indicação',
    paymentMethod: 'cartão',
  },
  {
    id: 'lead_06',
    name: 'Marcos Alves',
    phone: '(85) 94321-0987',
    city: 'Fortaleza',
    state: 'CE',
    course: 'Enfermagem',
    status: 'lost',
    lossReason: 'Sem interesse no momento',
    source: 'google-organic',
  },
  {
    id: 'lead_07',
    name: 'Patrícia Rocha',
    email: 'patricia.rocha@email.com',
    phone: '(71) 93210-9876',
    cpf: '678.901.234-55',
    birthDate: '1992-01-14',
    city: 'Salvador',
    state: 'BA',
    course: 'Nutrição',
    status: 'pending',
    source: 'site',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'nutricao-2025',
  },
  {
    id: 'lead_08',
    name: 'Bruno Ferreira',
    email: 'bruno.ferreira@email.com',
    phone: '(62) 92109-8765',
    city: 'Goiânia',
    state: 'GO',
    course: 'Tecnologia da Informação',
    status: 'contacted',
    source: 'whatsapp',
    message: 'Tenho interesse no curso de TI, pode me passar mais informações?',
  },
  {
    id: 'lead_09',
    name: 'Larissa Nunes',
    email: 'larissa.nunes@email.com',
    phone: '(92) 91098-7654',
    cpf: '789.012.345-66',
    birthDate: '1999-06-22',
    city: 'Manaus',
    state: 'AM',
    course: 'Arquitetura',
    status: 'negociating',
    source: 'instagram',
    notes: 'Interessada em bolsa parcial',
  },
  {
    id: 'lead_10',
    name: 'Thiago Barbosa',
    email: 'thiago.barbosa@email.com',
    phone: '(81) 90987-6543',
    cpf: '890.123.456-77',
    birthDate: '1988-12-03',
    city: 'Recife',
    state: 'PE',
    course: 'Contabilidade',
    status: 'converted',
    source: 'site',
    paymentMethod: 'pix',
    campaign: 'black-friday',
  },
]

async function main() {
  console.log('Seeding leads...')

  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {},
      create: lead,
    })
  }

  console.log(`${leads.length} leads seeded successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
