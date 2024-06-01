/*
  Warnings:

  - You are about to drop the column `langId` on the `FAQ` table. All the data in the column will be lost.
  - Added the required column `lang` to the `FAQ` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupportedLang" AS ENUM ('en', 'tr', 'de');

-- DropForeignKey
ALTER TABLE "FAQ" DROP CONSTRAINT "FAQ_langId_fkey";

-- AlterTable
ALTER TABLE "FAQ" DROP COLUMN "langId",
ADD COLUMN     "lang" "SupportedLang" NOT NULL;
