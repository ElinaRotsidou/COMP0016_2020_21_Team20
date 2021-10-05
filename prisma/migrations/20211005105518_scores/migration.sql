/*
  Warnings:

  - You are about to drop the column `score` on the `responses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "responses" DROP COLUMN "score";

-- CreateTable
CREATE TABLE "scores" (
    "response_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("response_id")
);

-- AddForeignKey
ALTER TABLE "scores" ADD FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
