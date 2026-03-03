-- Rename enum value from 'enrolled' to 'awaitingPayment' in LeadStatus enum
-- Execute this ENTIRE script at once in Supabase SQL Editor

-- Add new enum value 'awaitingPayment' to the LeadStatus enum
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'awaitingPayment';

-- The script will pause here automatically to commit the enum change
-- PostgreSQL requires this before the value can be used

COMMIT;

-- Now update all existing records that use 'enrolled' to use 'awaitingPayment'
BEGIN;

UPDATE "lead" 
SET status = 'awaitingPayment' 
WHERE status = 'enrolled';

UPDATE "lead_history" 
SET "fromStatus" = 'awaitingPayment' 
WHERE "fromStatus" = 'enrolled';

UPDATE "lead_history" 
SET "toStatus" = 'awaitingPayment' 
WHERE "toStatus" = 'enrolled';

COMMIT;

-- Verify the changes
SELECT 
    'enrolled' as old_status,
    COUNT(*) as count 
FROM "lead" 
WHERE status = 'enrolled'
UNION ALL
SELECT 
    'awaitingPayment' as new_status,
    COUNT(*) as count 
FROM "lead" 
WHERE status = 'awaitingPayment';
