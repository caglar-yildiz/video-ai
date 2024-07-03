/*
  Warnings:

  - You are about to drop the column `taxNumber` on the `BillingInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillingInfo" DROP COLUMN "taxNumber",
ADD COLUMN     "taxId" TEXT;
