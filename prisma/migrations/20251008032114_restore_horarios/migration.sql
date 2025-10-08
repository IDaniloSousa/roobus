/*
  Warnings:

  - You are about to drop the column `usuario_id` on the `duvidas` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `linhas_recentes` table. All the data in the column will be lost.
  - You are about to drop the column `usuario_id` on the `respostas` table. All the data in the column will be lost.
  - You are about to drop the `embarque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `extrato_cartao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico_paradas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `anonymous_user_id` to the `duvidas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anonymous_user_id` to the `linhas_recentes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."duvidas" DROP CONSTRAINT "duvidas_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."embarque" DROP CONSTRAINT "embarque_itinerario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."extrato_cartao" DROP CONSTRAINT "extrato_cartao_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."historico_paradas" DROP CONSTRAINT "historico_paradas_embarque_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."historico_paradas" DROP CONSTRAINT "historico_paradas_itinerario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."linhas_recentes" DROP CONSTRAINT "linhas_recentes_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."respostas" DROP CONSTRAINT "respostas_usuario_id_fkey";

-- DropIndex
DROP INDEX "public"."linhas_recentes_itinerario_id_usuario_id_key";

-- AlterTable
ALTER TABLE "duvidas" DROP COLUMN "usuario_id",
ADD COLUMN     "anonymous_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "linhas_recentes" DROP COLUMN "usuario_id",
ADD COLUMN     "anonymous_user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "respostas" DROP COLUMN "usuario_id";

-- DropTable
DROP TABLE "public"."embarque";

-- DropTable
DROP TABLE "public"."extrato_cartao";

-- DropTable
DROP TABLE "public"."historico_paradas";

-- DropTable
DROP TABLE "public"."usuarios";

-- CreateTable
CREATE TABLE "Horario" (
    "id" SERIAL NOT NULL,
    "itinerario_id" INTEGER NOT NULL,
    "diaDaSemana" TEXT NOT NULL,
    "sentido" TEXT NOT NULL,
    "partidas" TEXT[],

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_itinerario_id_fkey" FOREIGN KEY ("itinerario_id") REFERENCES "itinerarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
