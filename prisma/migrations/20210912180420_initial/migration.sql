-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('likert_scale');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('unknown', 'admin', 'user');

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "default_url" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "question_type" NOT NULL,
    "archived" BOOLEAN DEFAULT false,
    "platform_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "is_mentoring_session" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_type" "user_type" DEFAULT E'unknown',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platforms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "archived" BOOLEAN DEFAULT false,

    CONSTRAINT "platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_urls" (
    "question_id" INTEGER NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "question_urls_pkey" PRIMARY KEY ("question_id","platform_id")
);

-- CreateTable
CREATE TABLE "user_join_codes" (
    "platform_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "user_join_codes_pkey" PRIMARY KEY ("platform_id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "platform_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD CONSTRAINT "question_urls_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD CONSTRAINT "question_urls_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_join_codes" ADD CONSTRAINT "user_join_codes_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
