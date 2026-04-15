-- CreateTable
CREATE TABLE "SavedCalc" (
    "id" TEXT NOT NULL,
    "calcId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedCalc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedCalc_userId_calcId_idx" ON "SavedCalc"("userId", "calcId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCalc_userId_calcId_name_key" ON "SavedCalc"("userId", "calcId", "name");

-- AddForeignKey
ALTER TABLE "SavedCalc" ADD CONSTRAINT "SavedCalc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
