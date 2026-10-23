-- CreateTable
CREATE TABLE "ResultShare" (
    "id" UUID NOT NULL,
    "splitId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResultShare_tokenHash_key" ON "ResultShare"("tokenHash");

-- CreateIndex
CREATE INDEX "ResultShare_splitId_idx" ON "ResultShare"("splitId");

-- AddForeignKey
ALTER TABLE "ResultShare" ADD CONSTRAINT "ResultShare_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split"("id") ON DELETE CASCADE ON UPDATE CASCADE;
