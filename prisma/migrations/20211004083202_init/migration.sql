-- CreateTable
CREATE TABLE "admin_join_codes" (
    "platform_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("platform_id")
);

-- AddForeignKey
ALTER TABLE "admin_join_codes" ADD FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
