-- Add 'boleto' to PaymentType enum
ALTER TYPE "PaymentType" ADD VALUE IF NOT EXISTS 'boleto';
