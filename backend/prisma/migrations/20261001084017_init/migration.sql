-- EnableExtension
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "Split" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Split_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" UUID NOT NULL,
    "splitId" UUID NOT NULL,
    "name" CITEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" UUID NOT NULL,
    "splitId" UUID NOT NULL,
    "payerId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillItem" (
    "id" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" BIGINT NOT NULL,

    CONSTRAINT "BillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemShare" (
    "itemId" UUID NOT NULL,
    "participantId" UUID NOT NULL,

    CONSTRAINT "ItemShare_pkey" PRIMARY KEY ("itemId","participantId")
);

-- CreateTable
CREATE TABLE "BillAdjustment" (
    "id" UUID NOT NULL,
    "billId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "allocationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Split_expiresAt_idx" ON "Split"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_splitId_name_key" ON "Participant"("splitId", "name");

-- CreateIndex
CREATE INDEX "Bill_splitId_idx" ON "Bill"("splitId");

-- CreateIndex
CREATE INDEX "Bill_payerId_idx" ON "Bill"("payerId");

-- CreateIndex
CREATE INDEX "BillItem_billId_idx" ON "BillItem"("billId");

-- CreateIndex
CREATE INDEX "ItemShare_participantId_idx" ON "ItemShare"("participantId");

-- CreateIndex
CREATE INDEX "BillAdjustment_billId_idx" ON "BillAdjustment"("billId");

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_splitId_fkey" FOREIGN KEY ("splitId") REFERENCES "Split"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "Participant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillItem" ADD CONSTRAINT "BillItem_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemShare" ADD CONSTRAINT "ItemShare_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "BillItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemShare" ADD CONSTRAINT "ItemShare_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillAdjustment" ADD CONSTRAINT "BillAdjustment_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
