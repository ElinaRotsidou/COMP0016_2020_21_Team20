/*
  Warnings:

  - You are about to drop the column `archived` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "archived",
ADD COLUMN     "archive" BOOLEAN DEFAULT false;
