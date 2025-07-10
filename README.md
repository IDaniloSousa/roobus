# 🚌 RooBus - Sistema de Rastreamento de Ônibus

Aplicativo web para rastreamento de ônibus urbanos em tempo real, desenvolvido com Next.js, React, TypeScript e MongoDB.

## 🚀 Configuração Inicial (Nova Máquina)

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MongoDB (local ou Atlas)

### 📋 Passos para instalação:

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd roobus

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Gere o cliente Prisma
npx prisma generate

# 5. Execute o projeto em desenvolvimento
npm run dev
```

### 🌐 Acesse o aplicativo
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS 4
- **Banco de Dados**: MongoDB + Prisma ORM
- **Ícones**: Phosphor Icons
- **Autenticação**: Sistema próprio com cookies

## 📁 Estrutura do Projeto

```
roobus/
├── src/
│   ├── app/                 # App Router (Next.js 13+)
│   │   ├── (main)/         # Grupo de rotas principais
│   │   ├── api/            # API Routes
│   │   └── lib/            # Utilitários
│   └── components/         # Componentes React
├── prisma/                 # Schema do banco
├── public/                 # Arquivos estáticos
└── ...
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## ⚠️ Importante - Arquivos NÃO Versionados

Os seguintes arquivos/pastas são gerados automaticamente e NÃO devem ser commitados:

- `/.next/` - Build do Next.js
- `/node_modules/` - Dependências
- `.env` - Variáveis de ambiente
- `*.tsbuildinfo` - Cache do TypeScript

## 🗃️ Banco de Dados

O projeto usa MongoDB com Prisma. Para configurar:

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas) ou use MongoDB local
2. Adicione a string de conexão no arquivo `.env`:
   ```
   DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/roobus"
   ```
3. Execute `npx prisma generate` para gerar o cliente

## 🚀 Deploy

O projeto pode ser deployado facilmente na [Vercel](https://vercel.com):

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push na branch main
