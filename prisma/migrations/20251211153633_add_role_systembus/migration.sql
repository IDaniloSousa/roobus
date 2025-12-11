-- AlterTable
ALTER TABLE "system_bus" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER',
ALTER COLUMN "route_number" DROP NOT NULL;
