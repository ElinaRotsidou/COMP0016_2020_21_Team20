-- DropForeignKey
ALTER TABLE "platforms" DROP CONSTRAINT "platforms_user_id_fkey";

-- CreateTable
CREATE TABLE "_platformsTousers" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_platformsTousers_AB_unique" ON "_platformsTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_platformsTousers_B_index" ON "_platformsTousers"("B");

-- AddForeignKey
ALTER TABLE "_platformsTousers" ADD FOREIGN KEY ("A") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_platformsTousers" ADD FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
