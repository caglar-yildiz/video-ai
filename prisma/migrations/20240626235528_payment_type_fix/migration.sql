/*
  Warnings:

  - You are about to drop the column `invoice_id` on the `payment_transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "payment_transactions_invoice_id_key";

-- AlterTable
ALTER TABLE "payment_transactions" DROP COLUMN "invoice_id";
