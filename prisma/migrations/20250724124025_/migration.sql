-- CreateTabl
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "matricula" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "codigo_recuperacao" TEXT,
    "nascimento_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerarios" (
    "id" SERIAL NOT NULL,
    "linha" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "itinerarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linhas_recentes" (
    "id" SERIAL NOT NULL,
    "itinerario_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "obs" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linhas_recentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duvidas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "fechado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "duvidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "duvida_id" INTEGER NOT NULL,
    "mensagem" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extrato_cartao" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "saldo_atual" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "extrato_cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embarque" (
    "id" SERIAL NOT NULL,
    "itinerario_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "sentido" TEXT NOT NULL,
    "ponto" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "embarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_paradas" (
    "id" SERIAL NOT NULL,
    "itinerario_id" INTEGER NOT NULL,
    "embarque_id" INTEGER NOT NULL,
    "horario" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historico_paradas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "itinerarios_descricao_key" ON "itinerarios"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "linhas_recentes_itinerario_id_usuario_id_key" ON "linhas_recentes"("itinerario_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "linhas_recentes" ADD CONSTRAINT "linhas_recentes_itinerario_id_fkey" FOREIGN KEY ("itinerario_id") REFERENCES "itinerarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linhas_recentes" ADD CONSTRAINT "linhas_recentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_duvida_id_fkey" FOREIGN KEY ("duvida_id") REFERENCES "duvidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extrato_cartao" ADD CONSTRAINT "extrato_cartao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embarque" ADD CONSTRAINT "embarque_itinerario_id_fkey" FOREIGN KEY ("itinerario_id") REFERENCES "itinerarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_paradas" ADD CONSTRAINT "historico_paradas_itinerario_id_fkey" FOREIGN KEY ("itinerario_id") REFERENCES "itinerarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_paradas" ADD CONSTRAINT "historico_paradas_embarque_id_fkey" FOREIGN KEY ("embarque_id") REFERENCES "embarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
