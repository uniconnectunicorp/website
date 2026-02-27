import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('═══════════════════════════════════════════');
    console.log('  UniConnect - Seed Database (SQL)');
    console.log('═══════════════════════════════════════════\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM "notificacao"');
    await client.query('DELETE FROM "lead_history"');
    await client.query('DELETE FROM "enrollment_link"');
    await client.query('DELETE FROM "matricula"');
    await client.query('DELETE FROM "finance"');
    await client.query('DELETE FROM "lead"');
    await client.query('DELETE FROM "seller_config"');
    await client.query('DELETE FROM "payment_method"');
    await client.query('DELETE FROM "user"');
    console.log('✓ Data cleared\n');

    // Insert users
    console.log('Seeding users...');
    const users = [
      { id: 'user_admin', name: 'Admin UniConnect', email: 'admin@uniconnect.com.br', role: 'admin' },
      { id: 'user_dir', name: 'Diretor UniConnect', email: 'diretor@uniconnect.com.br', role: 'director' },
      { id: 'user_mgr', name: 'Gerente UniConnect', email: 'gerente@uniconnect.com.br', role: 'manager' },
      { id: 'user_clara', name: 'Clara Vendedora', email: 'clara@uniconnect.com.br', role: 'seller' },
      { id: 'user_lidiane', name: 'Lidiane Vendedora', email: 'lidiane@uniconnect.com.br', role: 'seller' },
      { id: 'user_jaiany', name: 'Jaiany Vendedora', email: 'jaiany@uniconnect.com.br', role: 'seller' },
      { id: 'user_vitoria', name: 'Vitoria Vendedora', email: 'vitoria@uniconnect.com.br', role: 'seller' },
      { id: 'user_fin', name: 'Financeiro UniConnect', email: 'financeiro@uniconnect.com.br', role: 'finance' },
    ];

    for (const u of users) {
      await client.query(
        'INSERT INTO "user" (id, name, email, role, active, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [u.id, u.name, u.email, u.role, true]
      );
    }
    console.log(`✓ ${users.length} users created\n`);

    // Insert payment methods
    console.log('Seeding payment methods...');
    const paymentMethods = [
      { id: 'pm_pix', name: 'PIX', type: 'pix', maxInstallments: null, feePercentage: 0 },
      { id: 'pm_credit_1x', name: 'Cartão de Crédito 1x', type: 'credit', maxInstallments: 1, feePercentage: 2.99 },
      { id: 'pm_credit_3x', name: 'Cartão de Crédito 3x', type: 'credit', maxInstallments: 3, feePercentage: 5.49 },
      { id: 'pm_credit_6x', name: 'Cartão de Crédito 6x', type: 'credit', maxInstallments: 6, feePercentage: 8.49 },
      { id: 'pm_credit_12x', name: 'Cartão de Crédito 12x', type: 'credit', maxInstallments: 12, feePercentage: 14.49 },
      { id: 'pm_debit', name: 'Cartão de Débito', type: 'debit', maxInstallments: 1, feePercentage: 1.99 },
    ];

    for (const m of paymentMethods) {
      await client.query(
        'INSERT INTO "payment_method" (id, name, type, "maxInstallments", "feePercentage", "visibleOnEnrollment", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [m.id, m.name, m.type, m.maxInstallments, m.feePercentage, true]
      );
    }
    console.log(`✓ ${paymentMethods.length} payment methods created\n`);

    // Insert seller configs
    console.log('Seeding seller configs...');
    const sellers = ['user_clara', 'user_lidiane', 'user_jaiany', 'user_vitoria'];
    for (const sellerId of sellers) {
      await client.query(
        'INSERT INTO "seller_config" (id, "userId", "minValue", "maxValue") VALUES ($1, $2, $3, $4)',
        [`sc_${sellerId}`, sellerId, 599.90, 1299.90]
      );
    }
    console.log(`✓ ${sellers.length} seller configs created\n`);

    // Insert leads (80 leads spread over 6 months)
    console.log('Seeding leads (80 leads over 6 months)...');
    const cursos = [
      'Administração', 'Agente Comunitário de Saúde', 'Agrimensura', 'Agropecuária',
      'Agricultura', 'Biotecnologia', 'Eletromecânica', 'Enfermagem', 'Logística',
      'Meio Ambiente', 'Mineração', 'Qualidade', 'Recursos Humanos', 'Refrigeração e Climatização',
      'Segurança do Trabalho', 'Sistema de Energia Renovável', 'Soldagem', 'Telecomunicações',
    ];
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
    ];
    const statuses = ['pending', 'pending', 'pending', 'contacted', 'contacted', 'negociating', 'confirmPayment', 'converted', 'converted', 'converted', 'converted', 'lost'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Fortaleza'];
    const sources = ['site', 'whatsapp', 'instagram', 'facebook', 'indicação'];

    let leadCount = 0;
    for (let i = 0; i < 80; i++) {
      const leadId = `lead_${String(i + 1).padStart(3, '0')}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const seller = sellers[i % sellers.length];
      const curso = cursos[Math.floor(Math.random() * cursos.length)];
      const value = (Math.floor(Math.random() * 8) + 5) * 100 + 99.90;
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date(Date.now() - daysAgo * 86400000);

      const nome = nomes[i] || `Lead ${i + 1}`;
      const email = `${nome.toLowerCase().replace(/ /g, '.')}@email.com`;
      const phone = `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;

      let convertedAt = null;
      if (status === 'converted') {
        convertedAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 21) * 86400000);
      }

      let lostAt = null;
      if (status === 'lost') {
        lostAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 14) * 86400000);
      }

      const paymentMethodId = status === 'converted' ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)].id : null;

      await client.query(
        `INSERT INTO "lead" (id, name, email, phone, course, "courseValue", status, source, "assignedTo", "paymentMethodId", "convertedAt", "lostAt", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [leadId, nome, email, phone, curso, value, status, sources[Math.floor(Math.random() * sources.length)], seller, paymentMethodId, convertedAt, lostAt, createdAt, createdAt]
      );
      leadCount++;
    }
    console.log(`✓ ${leadCount} leads created\n`);

    // Insert matrículas and finances for converted leads
    console.log('Seeding matrículas and finances...');
    const convertedLeads = await client.query('SELECT id, "courseValue", "paymentMethodId", "convertedAt", "createdAt" FROM "lead" WHERE status = $1', ['converted']);
    const matStatuses = ['ativa', 'ativa', 'ativa', 'concluida', 'cancelada', 'trancada'];
    const modalidades = ['regular', 'aproveitamento', 'competencia'];

    let matCount = 0;
    for (const lead of convertedLeads.rows) {
      const matId = `mat_${lead.id}`;
      const numero = `UC-2026-${String(matCount + 1).padStart(4, '0')}`;
      const matStatus = matStatuses[Math.floor(Math.random() * matStatuses.length)];
      const modalidade = modalidades[Math.floor(Math.random() * modalidades.length)];

      await client.query(
        'INSERT INTO "matricula" (id, "leadId", numero, status, modalidade, "dataInicio", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [matId, lead.id, numero, matStatus, modalidade, lead.convertedAt || lead.createdAt]
      );

      const amount = lead.courseValue || 999.90;
      const fee = amount * 0.05; // 5% average fee
      const net = amount - fee;

      await client.query(
        `INSERT INTO "finance" (id, "leadId", amount, "netAmount", "feeAmount", installments, type, category, description, "userId", "paymentMethodId", "transactionDate", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
        [
          `fin_${lead.id}`,
          lead.id,
          amount,
          net,
          fee,
          1,
          'leadPayment',
          'matricula',
          `Matrícula ${numero}`,
          sellers[Math.floor(Math.random() * sellers.length)],
          lead.paymentMethodId,
          lead.convertedAt || lead.createdAt,
        ]
      );

      matCount++;
    }
    console.log(`✓ ${matCount} matrículas and finances created\n`);

    // Insert notifications
    console.log('Seeding notifications...');
    const notificacoes = [
      { id: 'not_01', userId: 'user_admin', titulo: 'Novo lead recebido', mensagem: 'Ana Paula Souza se cadastrou pelo site.', tipo: 'info' },
      { id: 'not_02', userId: 'user_admin', titulo: 'Matrícula realizada', mensagem: 'Juliana Castro concluiu o processo de matrícula.', tipo: 'sucesso' },
      { id: 'not_03', userId: 'user_admin', titulo: 'Meta de vendas atingida', mensagem: 'Parabéns! A equipe atingiu a meta mensal de vendas.', tipo: 'sucesso' },
      { id: 'not_04', userId: 'user_clara', titulo: 'Novo lead atribuído', mensagem: 'Você recebeu um novo lead: Carlos Eduardo Lima.', tipo: 'info' },
      { id: 'not_05', userId: 'user_clara', titulo: 'Lead convertido!', mensagem: 'Parabéns! Thiago Barbosa realizou a matrícula.', tipo: 'sucesso' },
    ];

    for (const not of notificacoes) {
      await client.query(
        'INSERT INTO "notificacao" (id, "userId", titulo, mensagem, tipo, lida, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [not.id, not.userId, not.titulo, not.mensagem, not.tipo, false]
      );
    }
    console.log(`✓ ${notificacoes.length} notifications created\n`);

    console.log('═══════════════════════════════════════════');
    console.log('  ✅ Seed completed successfully!');
    console.log('═══════════════════════════════════════════');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
