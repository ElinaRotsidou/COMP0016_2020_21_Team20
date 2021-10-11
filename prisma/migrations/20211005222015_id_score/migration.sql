/*
  Warnings:

  - The migration will change the primary key for the `scores` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "scores" DROP CONSTRAINT "scores_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD PRIMARY KEY ("id");
