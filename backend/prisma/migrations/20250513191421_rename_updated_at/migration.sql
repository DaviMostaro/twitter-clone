/*
  Warnings:

  - You are about to drop the column `updateAt` on the `Trend` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trend" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
