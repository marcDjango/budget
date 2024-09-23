-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "provider" DROP NOT NULL,
ALTER COLUMN "provider_account_id" DROP NOT NULL;
