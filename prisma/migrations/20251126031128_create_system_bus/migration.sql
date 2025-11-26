-- CreateTable
CREATE TABLE "system_bus" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "login" VARCHAR(256) NOT NULL,
    "password" VARCHAR(256) NOT NULL,
    "route_number" INTEGER NOT NULL,

    CONSTRAINT "system_bus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_bus_login_key" ON "system_bus"("login");
