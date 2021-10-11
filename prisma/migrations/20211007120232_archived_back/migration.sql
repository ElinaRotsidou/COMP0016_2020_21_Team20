/*
  Warnings:

  - You are about to drop the column `archive` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "archive",
ADD COLUMN     "archived" BOOLEAN DEFAULT false;
