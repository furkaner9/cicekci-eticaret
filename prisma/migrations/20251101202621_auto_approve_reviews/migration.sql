-- DropIndex
DROP INDEX "public"."Review_isApproved_idx";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "isApproved" SET DEFAULT true;
