-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "socket_id" TEXT,
ADD COLUMN     "user_agent" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
