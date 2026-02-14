-- CreateEnum
CREATE TYPE "RiskAnswer" AS ENUM ('WITHIN_YEAR', 'TWO_TO_FIVE_YEARS', 'NONE');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "RiskCategory" AS ENUM ('INDIVIDUAL', 'ECONOMIC', 'ENVIRONMENT', 'SOCIAL');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "id" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalScore" INTEGER NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskItem" (
    "id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "category" "RiskCategory" NOT NULL,
    "maxScore" INTEGER NOT NULL,

    CONSTRAINT "RiskItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseRisk" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "riskItemId" INTEGER NOT NULL,
    "answer" "RiskAnswer" NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ResponseRisk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "ResponseRisk" ADD CONSTRAINT "ResponseRisk_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "SurveyResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseRisk" ADD CONSTRAINT "ResponseRisk_riskItemId_fkey" FOREIGN KEY ("riskItemId") REFERENCES "RiskItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
