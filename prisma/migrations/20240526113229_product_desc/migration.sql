-- CreateTable
CREATE TABLE "product_descriptions" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_descriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_descriptions" ADD CONSTRAINT "product_descriptions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
