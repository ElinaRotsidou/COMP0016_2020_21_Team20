/*
  Warnings:

  - You are about to drop the column `default_url` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `question_urls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "question_urls" DROP CONSTRAINT "question_urls_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "question_urls" DROP CONSTRAINT "question_urls_question_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "default_url";

-- DropTable
DROP TABLE "question_urls";
