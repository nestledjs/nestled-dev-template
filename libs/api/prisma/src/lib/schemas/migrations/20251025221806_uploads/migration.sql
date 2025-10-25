/*
  Warnings:

  - You are about to drop the column `token` on the `ApiToken` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `orientation` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Upload` table. All the data in the column will be lost.
  - You are about to drop the column `versionInfo` on the `Upload` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenHash]` on the table `ApiToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenHash` to the `ApiToken` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `ApiToken` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `filename` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerFileId` to the `Upload` table without a default value. This is not possible if the table is not empty.
  - Made the column `size` on table `Upload` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Upload` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."StorageProvider" AS ENUM ('LOCAL', 'S3', 'CLOUDINARY', 'IMAGEKIT', 'GCS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."SecurityEventType" ADD VALUE 'API_TOKEN_CREATED';
ALTER TYPE "public"."SecurityEventType" ADD VALUE 'API_TOKEN_REVOKED';
ALTER TYPE "public"."SecurityEventType" ADD VALUE 'API_TOKEN_ROTATED';

-- DropIndex
DROP INDEX "public"."ApiToken_token_key";

-- AlterTable
ALTER TABLE "public"."ApiToken" DROP COLUMN "token",
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "tokenHash" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Upload" DROP COLUMN "fileId",
DROP COLUMN "filePath",
DROP COLUMN "fileType",
DROP COLUMN "name",
DROP COLUMN "orientation",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "type",
DROP COLUMN "versionInfo",
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "folder" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "provider" "public"."StorageProvider" NOT NULL,
ADD COLUMN     "providerFileId" TEXT NOT NULL,
ADD COLUMN     "publicUrl" TEXT,
ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_tokenHash_key" ON "public"."ApiToken"("tokenHash");

-- CreateIndex
CREATE INDEX "Upload_userId_idx" ON "public"."Upload"("userId");

-- CreateIndex
CREATE INDEX "Upload_organizationId_idx" ON "public"."Upload"("organizationId");

-- CreateIndex
CREATE INDEX "Upload_provider_idx" ON "public"."Upload"("provider");
