-- Add 'boleto' to PaymentType enum
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'PaymentType'
  ) THEN
    ALTER TYPE "PaymentType" ADD VALUE IF NOT EXISTS 'boleto';
  END IF;
END $$;
