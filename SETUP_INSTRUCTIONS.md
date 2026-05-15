# 🚀 Instruções de Uso - Projeto VTCouro

## Passo 1: Preparar o Projeto Localmente

1. **Copie a pasta `vtcouro-website`** para seu computador (em um local de sua escolha)

2. **Abra a pasta no VS Code**
   ```bash
   cd caminho/para/vtcouro-website
   code .
   ```

3. **Instale as dependências**
   ```bash
   npm install
   ```

4. **Configure o banco de dados PostgreSQL**
   - Crie um banco chamado `vtcouro`
   - Anote a URL: `postgresql://usuario:senha@localhost:5432/vtcouro`

5. **Configure variáveis de ambiente**
   - Copie `.env.example` para `.env.local`
   - Edite `.env.local` e adicione:
     ```env
     DATABASE_URL="postgresql://usuario:senha@localhost:5432/vtcouro"
     ADMIN_PASSWORD="sua-senha-segura"
     ```

6. **Sincronize o banco de dados**
   ```bash
   npm run db:push
   ```

7. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   - Acesse: http://localhost:3000

---

## Passo 2: Integrar com Figma via MCP

### O que fazer com seu Figma:

1. **Exporte o Figma**
   - Você já tem as 3 páginas desenhadas no Figma
   - Exporte os componentes em alta qualidade (PNG ou SVG)
   - Coloque as imagens em: `src/images/` ou `public/images/`

2. **Conecte ao Claude via MCP**
   - Compartilhe o arquivo do Figma comigo
   - Ou envie prints/PDFs das 3 páginas
   - Vou transformar em componentes React

---

## Passo 3: Desenvolvimento

### Estrutura de componentes que criarei:

```
src/components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── home/
│   ├── Hero.tsx
│   ├── Categories.tsx
│   └── Features.tsx
├── products/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   └── ProductFilters.tsx
├── cart/
│   ├── CartBadge.tsx
│   ├── CartPage.tsx
│   └── CartItem.tsx
└── ui/
    ├── Button.tsx
    ├── Input.tsx
    └── Badge.tsx
```

---

## Passo 4: Fluxo de Trabalho

### Como vamos trabalhar:

1. **Você envia**: Link do Figma ou imagens das páginas
2. **Eu converto**: Componentes React + Tailwind
3. **Você integra**: Copia os arquivos `.tsx` para o projeto
4. **Você testa**: `npm run dev` e vê funcionando

---

## 📱 Páginas a Desenvolver

Com base no escopo, vamos criar:

1. **Home** - Seu design do Figma
2. **Catálogo** - Seu design do Figma  
3. **Carrinho** - Seu design do Figma
4. **(+ Páginas adicionais no escopo)**

---

## 🎯 Próximos Passos

1. ✅ Projeto criado e pronto
2. ⏳ **Aguardando**: Você enviar os designs do Figma
3. 🔨 Vou criar os componentes React
4. 🚀 Você integra e testa

---

## 💡 Dicas

- **Mantenha o git limpo**: Faça commits regulares
- **Use branches**: `git checkout -b feature/nome`
- **Teste sempre**: `npm run dev` após mudanças
- **TypeScript**: Sempre use tipos explícitos

---

## 📚 Referências Rápidas

```bash
# Desenvolvimento
npm run dev              # Servidor dev

# Banco
npm run db:studio       # Ver/editar banco visualmente
npm run db:push         # Sincronizar schema

# Código
npm run lint            # Verificar erros
npm run format          # Formatar código
```

---

## ❓ Dúvidas Frequentes

**P: Preciso instalar algo mais?**
A: Node.js 18+, PostgreSQL e VS Code. Só isso!

**P: Como adicionar as páginas do Figma?**
A: Envie os designs e vou criar os componentes React.

**P: Posso usar outro banco de dados?**
A: O Prisma suporta MySQL, SQLite, etc. Mude apenas a `DATABASE_URL`.

---

## ✅ Checklist

- [ ] Projeto copiado para seu computador
- [ ] `npm install` executado
- [ ] PostgreSQL configurado
- [ ] `.env.local` criado
- [ ] `npm run db:push` executado
- [ ] `npm run dev` rodando em localhost:3000
- [ ] Designs do Figma enviados

**Quando tudo estiver pronto, me avisa! 🚀**
