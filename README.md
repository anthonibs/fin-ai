<div align="center">

<!-- 🖼️ BANNER DO PROJETO — substitua o src abaixo pela imagem de capa -->
<img src="./public/banner.jpg" alt="FinAI — Capa do projeto" width="100%" />

# 💸 FinAI

**Gestão financeira pessoal inteligente, potencializada por IA.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![Stripe](https://img.shields.io/badge/Stripe-Pagamentos-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white)](https://openai.com)
[![License](https://img.shields.io/badge/Licença-MIT-green.svg)](./LICENSE)

</div>

---

## 📖 Sobre o projeto

A **FinAI** é uma plataforma de gestão financeira que ajuda você a acompanhar suas movimentações e tomar decisões mais inteligentes com o seu dinheiro. Registre receitas, despesas e investimentos, visualize tudo em um dashboard interativo e receba **relatórios personalizados gerados por Inteligência Artificial** com dicas práticas para melhorar sua vida financeira.

O projeto possui modelo **freemium**: o plano gratuito permite até 10 transações por mês, e o plano **Pro** (via Stripe) libera transações ilimitadas e o relatório com IA.

## ✨ Funcionalidades

- 📊 **Dashboard interativo** — visão consolidada de receitas, despesas, investimentos e saldo, com gráficos por categoria e percentuais por tipo de transação
- 💳 **Gestão de transações** — crie, edite e exclua transações com categorias e métodos de pagamento
- 🤖 **Relatório com IA** — análise mensal das suas finanças gerada pela OpenAI (GPT-4o-mini), exclusiva do plano Pro
- 🔐 **Autenticação completa** — login e cadastro via Clerk, com limite de 1.000 usuários no ambiente de testes
- 💎 **Planos e assinaturas** — checkout e gestão de assinatura com Stripe (webhooks sincronizam o plano automaticamente)
- 📱 **Interface responsiva** — construída com Tailwind CSS 4, Radix UI e componentes shadcn/ui

## 🛠️ Stack

| Camada | Tecnologias |
|--------|-------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS 4, Radix UI, shadcn/ui, Lucide Icons, Recharts |
| Autenticação | Clerk |
| Banco de dados | PostgreSQL + Prisma 7 |
| Pagamentos | Stripe (checkout + webhooks) |
| IA | OpenAI API |
| Validação | Zod + React Hook Form |

---

## 🚀 Rodando o projeto localmente (fork)

Siga este passo a passo para fazer um fork e rodar a FinAI na sua máquina.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- Um banco **PostgreSQL** rodando (local, Docker ou serviço como Neon/Supabase)
- Contas gratuitas em: [Clerk](https://clerk.com), [Stripe](https://stripe.com) e [OpenAI](https://platform.openai.com)

### 2. Clone o repositório

```bash
git clone https://github.com/<seu-usuario>/fin-ai.git
cd fin-ai
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env-example .env
```

E preencha cada variável no `.env`:

| Variável | Onde obter |
|----------|-----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → **API Keys** |
| `CLERK_SECRET_KEY` | Clerk Dashboard → **API Keys** |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Clerk Dashboard → **Webhooks** (veja passo 7) |
| `DATABASE_URL` | String de conexão do seu PostgreSQL, ex: `postgresql://user:senha@localhost:5432/finai` |
| `APP_URL` | `http://localhost:3000` em desenvolvimento |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → **Developers → API keys** |
| `STRIPE_PLAN_PRO_PRICE_ID` | Stripe Dashboard → **Products** → crie um produto com preço recorrente e copie o `price_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → **Developers → Webhooks** (veja passo 7) |
| `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL` | Stripe Dashboard → **Settings → Billing → Customer portal** |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

### 5. Prepare o banco de dados

```bash
npx prisma migrate dev
```

Isso cria as tabelas no seu PostgreSQL a partir das migrations em `prisma/migrations`.

### 6. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

### 7. Configure os webhooks (para assinaturas e limite de usuários)

Em desenvolvimento, exponha sua máquina com um túnel:

```bash
# Stripe (recomendado: CLI oficial)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Para o Clerk, use ngrok ou similar
ngrok http 3000
```

**Stripe** — no Dashboard → **Developers → Webhooks**, adicione o endpoint `/api/webhooks/stripe` com os eventos:
- `invoice.paid`
- `customer.subscription.deleted`

**Clerk** — no Dashboard → **Webhooks**, adicione o endpoint `/api/webhooks/clerk` com o evento:
- `user.created`

Copie os segredos de assinatura gerados para `STRIPE_WEBHOOK_SECRET` e `CLERK_WEBHOOK_SIGNING_SECRET`.

### 8. Scripts úteis

```bash
npm run dev    # Servidor de desenvolvimento (Turbopack)
npm run build  # Build de produção
npm run start  # Sobe o build de produção
npm run lint   # Lint com ESLint
```

---

## 📁 Estrutura do projeto

```text
app/
├── (pages)/            # Rotas: dashboard, login, subscription, transactions
│   ├── (dashboard)/    # Página principal + relatório com IA
│   ├── login/          # Autenticação (Clerk)
│   ├── subscription/   # Planos e checkout Stripe
│   └── transactions/   # Listagem e gestão de transações
├── _actions/           # Server Actions (transações, dashboard)
├── _components/        # Componentes de UI (shadcn/ui + compartilhados)
├── _lib/               # Auth helpers, Prisma client, utils
├── api/webhooks/       # Webhooks do Stripe e do Clerk
└── modules/            # Services e tipos de domínio
prisma/
└── schema.prisma       # Modelo de dados
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
