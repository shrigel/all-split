/*
  Warnings:

  - A unique constraint covering the columns `[accessTokenHash]` on the table `Split` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessTokenHash` to the `Split` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Split" ADD COLUMN     "accessTokenHash" CHAR(64) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Split_accessTokenHash_key" ON "Split"("accessTokenHash");
