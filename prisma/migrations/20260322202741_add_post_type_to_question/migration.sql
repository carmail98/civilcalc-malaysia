-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('QUESTION', 'FACT', 'TERM');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "postType" "PostType" NOT NULL DEFAULT 'QUESTION';
