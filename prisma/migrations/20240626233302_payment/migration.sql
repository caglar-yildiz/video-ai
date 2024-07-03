/*
  Warnings:

  - A unique constraint covering the columns `[invoice_id]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[siparis_id]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[islem_id]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ucd_md]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[islem_guid]` on the table `payment_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment_transactions" ADD COLUMN     "invoice_id" TEXT,
ADD COLUMN     "islem_guid" TEXT,
ADD COLUMN     "islem_id" TEXT,
ADD COLUMN     "siparis_id" TEXT,
ADD COLUMN     "ucd_md" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_invoice_id_key" ON "payment_transactions"("invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_siparis_id_key" ON "payment_transactions"("siparis_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_islem_id_key" ON "payment_transactions"("islem_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_ucd_md_key" ON "payment_transactions"("ucd_md");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_islem_guid_key" ON "payment_transactions"("islem_guid");
