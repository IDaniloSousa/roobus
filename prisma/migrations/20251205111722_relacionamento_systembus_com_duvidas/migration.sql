/*
  Warnings:

  - Added the required column `user_id` to the `duvidas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "duvidas" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
