```markdown
# 🚌 RooBus

> **Rastreamento de Transporte Coletivo em Tempo Real para Rondonópolis.**

O **RooBus** é uma aplicação web moderna desenvolvida para facilitar a vida dos usuários de transporte público. Através de uma arquitetura híbrida e eficiente, o sistema conecta motoristas e passageiros, permitindo a visualização da localização dos veículos em tempo real, consulta de itinerários e horários.

---

## 🚀 Tecnologias Utilizadas

O projeto utiliza uma stack robusta e atualizada:

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript.
- **Estilização:** Tailwind CSS & Phosphor Icons.
- **Mapas:** Leaflet & React-Leaflet (OpenStreetMap).
- **Tempo Real:** Socket.IO (WebSocket).
- **Banco de Dados:** PostgreSQL (via Prisma ORM).
- **Segurança:** Bcrypt (Hash de senhas) & Cookies/Session.

---

## 🛠️ Instalação e Dependências

Abaixo estão os comandos necessários para instalar as bibliotecas específicas utilizadas no projeto, conforme configurado no ambiente de desenvolvimento:

### 1. Dependências do Mapa e Sockets
```bash
# Tipagens para o mapa
npm install -D @types/leaflet 

# Comunicação em Tempo Real (Cliente e Servidor)
npm install socket.io socket.io-client
```

### 2. Ferramentas de Execução e Utilitários
```bash
# Execução de TypeScript (necessário para Seeds e Backend local)
npm install -D ts-node

# Filtro de conteúdo impróprio (para o sistema de Dúvidas)
npm install glin-profanity
```

### 3. Autenticação e Validação
```bash
# Encriptação de senhas e tipagens
npm install bcrypt
npm install -D @types/bcrypt

# Validação de dados (Email, Inputs) e tipagens
npm install validator
npm install -D @types/validator
```

> **Nota:** Para instalar todas as dependências padrão do projeto (React, Next, etc.) de uma única vez, basta rodar:
> ```bash
> npm install
> ```

---

## ⚡ Como Rodar o Projeto

Devido à arquitetura separada (Frontend Serverless + Backend WebSocket), é necessário rodar dois processos em terminais diferentes para o ambiente de desenvolvimento local:

### Passo 1: Configurar Banco de Dados

Certifique-se de ter um arquivo `.env` configurado com a `DATABASE_URL` do seu PostgreSQL. Em seguida, gere as migrações e popule o banco:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Passo 2: Iniciar o Servidor de Sockets (Backend)

Em um terminal, inicie o servidor responsável pela comunicação em tempo real:

```bash
node socket-server.js
```

*O socket rodará na porta 3001.*

### Passo 3: Iniciar a Aplicação Web (Frontend)

Em **outro terminal**, inicie o Next.js:

```bash
npm run dev
```

*A aplicação rodará na porta 3000.*

Acesse **http://localhost:3000** no seu navegador.

---

## 📱 Funcionalidades Principais

- 📍 **Mapa em Tempo Real:** Visualização ao vivo dos ônibus em movimento.
- 🚍 **Itinerários:** Traçados completos das rotas (Ida e Volta).
- 🔍 **Busca Inteligente:** Encontre linhas pelo nome ou número.
- 📡 **Geolocalização:** Descubra linhas próximas à sua posição atual.
- 👮 **Modo Motorista:** Interface exclusiva para transmissão de GPS.
- 💬 **Dúvidas:** Sistema de perguntas frequentes com moderação automática.

---

## ☁️ Deploy

- **Frontend:** Otimizado para deploy na [Vercel](https://vercel.com/).
- **Backend (Sockets):** Projetado para rodar em servidores Node.js persistentes (ex: Umbrel, VPS, Railway) para manter as conexões WebSocket ativas.

---

Desenvolvido por **Danilo de Sousa, Gustavo Ribeiro da Silva, Lucas de Melo Belardinucci, Maria Luiza Gonçalves Leitão, Matheus Nonato Moreira, Paula Rayssa Paniago Costa**.
```