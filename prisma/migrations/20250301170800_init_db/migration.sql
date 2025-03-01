-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('EDUCATION', 'ENTERTAINMENT', 'FOOD', 'HEALTH', 'HOUSING', 'INSURANCE', 'OTHER', 'SALARY', 'TRANSPORTATION', 'UTILITIES');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('DEPOSIT', 'EXPENSE', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "TransactionPaymentMethod" AS ENUM ('BANK_SLIP', 'BANK_TRANSFER', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'OTHER', 'PAYPAL', 'PIX');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "paymentMethod" "TransactionPaymentMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
