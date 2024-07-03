-- AlterTable
ALTER TABLE "BillingInfo" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyTitle" TEXT,
ADD COLUMN     "isCorporate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxNumber" TEXT,
ADD COLUMN     "taxOffice" TEXT;
