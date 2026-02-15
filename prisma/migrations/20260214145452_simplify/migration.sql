/*
  Warnings:

  - You are about to drop the column `score` on the `ResponseRisk` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `RiskItem` table. All the data in the column will be lost.
  - You are about to drop the column `maxScore` on the `RiskItem` table. All the data in the column will be lost.
  - You are about to drop the column `riskLevel` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `totalScore` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ResponseRisk" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "RiskItem" DROP COLUMN "category",
DROP COLUMN "maxScore";

-- AlterTable
ALTER TABLE "SurveyResponse" DROP COLUMN "riskLevel",
DROP COLUMN "totalScore";

-- DropTable
DROP TABLE "Admin";

-- DropEnum
DROP TYPE "RiskCategory";

-- DropEnum
DROP TYPE "RiskLevel";
