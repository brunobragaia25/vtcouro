# VTCouro - Website Moderno

Site moderno para VTCouro - Produtos de couro personalizados, com catálogo, carrinho de orçamento e painel administrativo.

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 13+
- npm ou yarn

### Instalação

1. **Clone o repositório** (ou extraia os arquivos)
```bash
cd vtcouro-website
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env.local
# Edite .env.local com suas variáveis
```

4. **Configure o banco de dados**
```bash
# Crie um banco PostgreSQL chamado 'vtcouro'
# Atualize a DATABASE_URL em .env.local

# Execute as migrations
npm run db:push
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 📁 Estrutura do Projeto

```
vtcouro-website/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (main)/         # Rotas públicas
│   │   ├── admin/          # Painel administrativo
│   │   ├── api/            # API Routes
│   │   └── layout.tsx      # Layout raiz
│   ├── components/         # Componentes React reutilizáveis
│   ├── lib/               # Utilitários e funções
│   ├── types/             # Tipos TypeScript
│   └── styles/            # CSS global
├── prisma/
│   └── schema.prisma      # Schema do banco de dados
├── public/                # Arquivos estáticos
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev em http://localhost:3000

# Build
npm run build           # Build para produção
npm start              # Inicia servidor de produção

# Banco de Dados
npm run db:push        # Sincroniza schema com banco
npm run db:studio      # Abre Prisma Studio (gerenciador visual)

# Código
npm run lint           # Executa linter
npm run format         # Formata código com Prettier
```

## 🎨 Design System

As cores, tipografia e componentes estão definidos em:
- `tailwind.config.ts` - Configuração de cores e espaçamento
- `DESIGN_SYSTEM_VTCOURO.md` - Documentação completa

### Cores Principais
- **Primária**: #2C1810 (Marrom escuro)
- **Secundária**: #D4A574 (Marrom claro)
- **Accent**: #E8D5C4 (Bege quente)

## 📦 Dependências Principais

- **Next.js 14** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Prisma** - ORM para banco de dados
- **React Hook Form** - Gerenciamento de formulários
- **Zustand** - State management
- **TanStack Query** - Data fetching

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vtcouro"

# Email Service (SendGrid)
SENDGRID_API_KEY="sua-chave-api"
SENDGRID_FROM_EMAIL="vendas@vtcouro.com.br"

# Cloud Storage (AWS S3)
AWS_ACCESS_KEY_ID="sua-chave"
AWS_SECRET_ACCESS_KEY="sua-chave-secreta"
AWS_BUCKET_NAME="seu-bucket"

# Admin
ADMIN_PASSWORD="sua-senha-segura"
```

## 📚 Rotas Principais

### Público
- `/` - Home
- `/produtos` - Catálogo de produtos
- `/produtos/[slug]` - Detalhes do produto
- `/carrinho` - Carrinho de orçamento
- `/orcamento` - Finalizar orçamento
- `/sobre` - Sobre a empresa
- `/contato` - Entre em contato

### Admin (Protegido)
- `/admin` - Dashboard
- `/admin/produtos` - Gerenciar produtos
- `/admin/categorias` - Gerenciar categorias
- `/admin/orcamentos` - Ver orçamentos

## 🧪 Testes

(Documentação de testes será adicionada em breve)

## 📝 Notas de Desenvolvimento

1. **TypeScript**: Sempre use tipos (`.ts` ou `.tsx`)
2. **Componentes**: Coloque componentes reutilizáveis em `src/components/`
3. **Estilos**: Use Tailwind CSS classes quando possível
4. **Banco de Dados**: Qualquer mudança no schema, execute `npm run db:push`
5. **Commits**: Use mensagens claras e descritivas

## 🚀 Deploy

O projeto está configurado para deploy em **Vercel** (recomendado para Next.js).

1. Faça push para um repositório Git
2. Conecte o repositório no Vercel
3. Configure variáveis de ambiente
4. Deploy automático!

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com o time de desenvolvimento.

---

**VTCouro © 2024** - Desenvolvido com ❤️
