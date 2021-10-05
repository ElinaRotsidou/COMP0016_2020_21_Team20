/*
  Warnings:

  - You are about to drop the `admin_join_codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin_join_codes" DROP CONSTRAINT "admin_join_codes_platform_id_fkey";

-- DropTable
DROP TABLE "admin_join_codes";
