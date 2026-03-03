-- Fix remaining 'enrolled' records in the database
-- Execute this script in Supabase SQL Editor

-- First, check how many records still have 'enrolled' status
SELECT 
    'lead' as table_name,
    COUNT(*) as enrolled_count
FROM "lead" 
WHERE status::text = 'enrolled'
UNION ALL
SELECT 
    'lead_history (fromStatus)' as table_name,
    COUNT(*) as enrolled_count
FROM "lead_history" 
WHERE "fromStatus"::text = 'enrolled'
UNION ALL
SELECT 
    'lead_history (toStatus)' as table_name,
    COUNT(*) as enrolled_count
FROM "lead_history" 
WHERE "toStatus"::text = 'enrolled';

-- Update all remaining 'enrolled' records to 'awaitingPayment'
-- Using ::text cast to bypass enum validation during update

UPDATE "lead" 
SET status = 'awaitingPayment'::text::"LeadStatus"
WHERE status::text = 'enrolled';

UPDATE "lead_history" 
SET "fromStatus" = 'awaitingPayment'::text::"LeadStatus"
WHERE "fromStatus"::text = 'enrolled';

UPDATE "lead_history" 
SET "toStatus" = 'awaitingPayment'::text::"LeadStatus"
WHERE "toStatus"::text = 'enrolled';

-- Verify all records were updated
SELECT 
    'lead' as table_name,
    COUNT(*) as enrolled_remaining
FROM "lead" 
WHERE status::text = 'enrolled'
UNION ALL
SELECT 
    'lead' as table_name,
    COUNT(*) as awaiting_payment_count
FROM "lead" 
WHERE status::text = 'awaitingPayment';
