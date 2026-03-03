-- Revert all 'awaitingPayment' records back to 'enrolled'
-- Execute this script in Supabase SQL Editor

-- Check current status distribution
SELECT 
    status::text as status_value,
    COUNT(*) as count
FROM "lead"
GROUP BY status::text
ORDER BY count DESC;

-- Update all 'awaitingPayment' records to 'enrolled'
UPDATE "lead" 
SET status = 'enrolled'::text::"LeadStatus"
WHERE status::text = 'awaitingPayment';

UPDATE "lead_history" 
SET "fromStatus" = 'enrolled'::text::"LeadStatus"
WHERE "fromStatus"::text = 'awaitingPayment';

UPDATE "lead_history" 
SET "toStatus" = 'enrolled'::text::"LeadStatus"
WHERE "toStatus"::text = 'awaitingPayment';

-- Verify the changes
SELECT 
    status::text as status_value,
    COUNT(*) as count
FROM "lead"
GROUP BY status::text
ORDER BY count DESC;

-- Should show 0 awaitingPayment records
SELECT COUNT(*) as awaiting_payment_remaining 
FROM "lead" 
WHERE status::text = 'awaitingPayment';
