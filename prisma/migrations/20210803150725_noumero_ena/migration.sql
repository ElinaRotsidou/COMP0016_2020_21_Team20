/*
  Warnings:

  - The migration will remove the values [words] on the enum `question_type`. If these variants are still used in the database, the migration will fail.
  - The migration will remove the values [platform_administrator,health_board,hospital,department_manager,clinician] on the enum `user_type`. If these variants are still used in the database, the migration will fail.
  - The migration will change the primary key for the `question_urls` table. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `question_urls` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `department_id` on the `responses` table. All the data in the column will be lost.
  - You are about to drop the `clinician_join_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department_join_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `health_boards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hospitals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `words` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `platform_id` to the `question_urls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `responses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "question_type_new" AS ENUM ('likert_scale');
ALTER TABLE "public"."questions" ALTER COLUMN "type" TYPE "question_type_new" USING ("type"::text::"question_type_new");
ALTER TYPE "question_type" RENAME TO "question_type_old";
ALTER TYPE "question_type_new" RENAME TO "question_type";
DROP TYPE "question_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "user_type_new" AS ENUM ('unknown', 'admin', 'user');
ALTER TABLE "public"."users" ALTER COLUMN "user_type" TYPE "user_type_new" USING ("user_type"::text::"user_type_new");
ALTER TYPE "user_type" RENAME TO "user_type_old";
ALTER TYPE "user_type_new" RENAME TO "user_type";
DROP TYPE "user_type_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "clinician_join_codes" DROP CONSTRAINT "clinician_join_codes_department_id_fkey";

-- DropForeignKey
ALTER TABLE "department_join_codes" DROP CONSTRAINT "department_join_codes_department_id_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_hospital_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_department_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_user_id_fkey";

-- DropForeignKey
ALTER TABLE "hospitals" DROP CONSTRAINT "hospitals_health_board_id_fkey";

-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_question_id_fkey";

-- DropForeignKey
ALTER TABLE "words" DROP CONSTRAINT "words_response_id_fkey";

-- DropForeignKey
ALTER TABLE "question_urls" DROP CONSTRAINT "question_urls_department_id_fkey";

-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_department_id_fkey";

-- AlterTable
ALTER TABLE "question_urls" DROP CONSTRAINT "question_urls_pkey",
DROP COLUMN "department_id",
ADD COLUMN     "platform_id" INTEGER NOT NULL,
ADD PRIMARY KEY ("question_id", "platform_id");

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "category",
ADD COLUMN     "platform_id" INTEGER NOT NULL,
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "responses" DROP COLUMN "department_id",
ADD COLUMN     "platform_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "clinician_join_codes";

-- DropTable
DROP TABLE "department_join_codes";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "feedback";

-- DropTable
DROP TABLE "health_boards";

-- DropTable
DROP TABLE "hospitals";

-- DropTable
DROP TABLE "words";

-- CreateTable
CREATE TABLE "platforms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "archived" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_join_codes" (
    "platform_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("platform_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_join_codes" ADD FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
