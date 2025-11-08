-- CreateTable
CREATE TABLE "RouteShape" (
    "id" SERIAL NOT NULL,
    "itinerario_id" INTEGER NOT NULL,
    "sentido" TEXT NOT NULL,
    "coordinates" JSONB NOT NULL,

    CONSTRAINT "RouteShape_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RouteShape_itinerario_id_sentido_key" ON "RouteShape"("itinerario_id", "sentido");

-- AddForeignKey
ALTER TABLE "RouteShape" ADD CONSTRAINT "RouteShape_itinerario_id_fkey" FOREIGN KEY ("itinerario_id") REFERENCES "itinerarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
