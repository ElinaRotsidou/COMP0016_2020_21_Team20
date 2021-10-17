/*
  Warnings:

  - You are about to drop the `_platformsTousers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_platformsTousers" DROP CONSTRAINT "_platformsTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_platformsTousers" DROP CONSTRAINT "_platformsTousers_B_fkey";

-- DropTable
DROP TABLE "_platformsTousers";

-- AddForeignKey
ALTER TABLE "platforms" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
