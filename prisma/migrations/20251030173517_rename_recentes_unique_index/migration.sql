/*
  Warnings:

  - A unique constraint covering the columns `[anonymous_user_id,itinerario_id]` on the table `linhas_recentes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "linhas_recentes_anonymous_user_id_itinerario_id_key" ON "linhas_recentes"("anonymous_user_id", "itinerario_id");
