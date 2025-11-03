# Sistema de Matrícula - Uniconnect

## 📋 Visão Geral

Sistema completo de matrícula online com validações, integração com ViaCEP e envio de emails automatizados.

## 🔗 Como Funciona

### Links de Matrícula por Vendedor

Cada vendedor possui um ID único que gera um link personalizado:

- **Clara (ID: 1)**: `https://seusite.com/matricula/1`
- **Lidiane (ID: 2)**: `https://seusite.com/matricula/2`

### Adicionar Novos Vendedores

Edite o arquivo `src/data/sellers.js`:

```javascript
export const sellers = [
    {
        id: 1,
        name: "Clara",
    },
    {
        id: 2,
        name: "Lidiane",
    },
    {
        id: 3,
        name: "Novo Vendedor",
    }
];
```

## 📧 Configuração de Email

Configure as variáveis de ambiente no arquivo `.env`:

```env
# Configurações SMTP
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=465
SMTP_USER=seu@email.com
SMTP_PASS=suasenha

# Email que receberá as matrículas
ENROLLMENT_EMAIL=matriculas@seusite.com
```

### Provedores SMTP Recomendados

- **Gmail**: `smtp.gmail.com` (porta 465)
- **Outlook**: `smtp-mail.outlook.com` (porta 587)
- **SendGrid**: `smtp.sendgrid.net` (porta 587)
- **Mailgun**: `smtp.mailgun.org` (porta 587)

## 🎨 Funcionalidades

### Formulário de Matrícula

✅ **Dados Pessoais**
- Nome completo
- Data de nascimento (máscara DD/MM/AAAA)
- CPF (máscara 000.000.000-00)
- RG
- Estado civil (select estilizado)
- Telefone (máscara (00) 00000-0000)
- Email

✅ **Endereço**
- CEP com busca automática via ViaCEP
- Rua (preenchimento automático)
- Número
- Bairro (preenchimento automático)
- Cidade (preenchimento automático)
- Estado (select com todos os estados)

✅ **Curso**
- Seleção de curso (lista completa de cursos.json)
- Forma de pagamento (PIX, Boleto, Cartão de Crédito, Cartão de Débito)

### Validações

- ✅ Todos os campos obrigatórios
- ✅ Validação de formato de email
- ✅ Validação de telefone
- ✅ Validação de CEP
- ✅ Máscaras automáticas
- ✅ Toast de erro/sucesso

### Integração ViaCEP

Ao preencher o CEP completo (8 dígitos), o sistema:
1. Busca automaticamente o endereço
2. Preenche rua, bairro, cidade e estado
3. Exibe toast de sucesso ou erro

## 📄 Template de Email

O email enviado inclui:

- 🎓 Header com branding Black November
- 👤 Dados pessoais completos
- 📍 Endereço completo
- 📚 Curso escolhido e forma de pagamento
- 👥 Nome do vendedor responsável
- 🎨 Design responsivo e profissional

## 🚫 Página 404

Página 404 customizada com:
- Design moderno e animado
- Links úteis para navegação
- Elementos visuais interativos
- Totalmente responsiva

## 🎯 Onde os Botões Aparecem

### 1. CTASection (Rodapé dos Cursos)
- Botão "Fazer Matrícula Direta"
- Separador "ou"
- Formulário de contato rápido

### 2. Páginas de Curso (Regular e Competência)
- Botão destaque "Fazer Matrícula Completa"
- Card de investimento
- Formulário de solicitação de informações

### 3. Cards de Curso
- Badge "Black November" no topo
- Informações de desconto

## 🔧 Instalação de Dependências

Certifique-se de ter instalado:

```bash
npm install react-input-mask nodemailer
```

## 📱 Responsividade

Todos os componentes são totalmente responsivos:
- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🎨 Tema Black November

O sistema está integrado com o tema Black November:
- Gradientes laranja/amarelo
- Badges animados
- Sparkles e efeitos visuais
- Desconto de 40% destacado

## 🔐 Segurança

- Validação de ID do vendedor
- Sanitização de dados
- Proteção contra XSS
- HTTPS recomendado em produção

## 📊 Fluxo de Matrícula

1. Usuário acessa `/matricula/1` (link do vendedor)
2. Preenche o formulário completo
3. Sistema valida todos os campos
4. Busca CEP automaticamente
5. Envia dados para API `/api/enrollment`
6. API envia email com template HTML
7. Usuário é redirecionado para `/obrigado`
8. Toast de sucesso é exibido

## 🐛 Troubleshooting

### Email não está sendo enviado
- Verifique as credenciais SMTP no `.env`
- Confirme que a porta está correta
- Teste com um provedor SMTP confiável

### CEP não está sendo encontrado
- Verifique conexão com internet
- API ViaCEP pode estar temporariamente indisponível
- Toast de erro será exibido automaticamente

### Página 404 para ID inválido
- Comportamento esperado
- Apenas IDs em `sellers.js` são válidos
- Adicione novos vendedores conforme necessário

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.
