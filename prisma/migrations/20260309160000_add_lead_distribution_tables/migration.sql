CREATE TABLE IF NOT EXISTS "lead_distribution_state" (
  "id" TEXT NOT NULL,
  "counter" INTEGER NOT NULL DEFAULT 0,
  "lastSellerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lead_distribution_state_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "lead_session" (
  "sessionId" TEXT NOT NULL,
  "phone" TEXT,
  "responsavel" TEXT NOT NULL,
  "sellerId" TEXT,
  "counterValue" INTEGER,
  "channel" TEXT NOT NULL DEFAULT 'website',
  "source" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lead_session_pkey" PRIMARY KEY ("sessionId")
);

CREATE TABLE IF NOT EXISTS "lead_distribution_event" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT,
  "sellerId" TEXT,
  "responsavel" TEXT,
  "channel" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "target" TEXT,
  "leadName" TEXT,
  "phone" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lead_distribution_event_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "lead_session_phone_idx" ON "lead_session"("phone");
CREATE INDEX IF NOT EXISTS "lead_session_sellerId_idx" ON "lead_session"("sellerId");
CREATE INDEX IF NOT EXISTS "lead_session_createdAt_idx" ON "lead_session"("createdAt");

CREATE INDEX IF NOT EXISTS "lead_distribution_event_sessionId_idx" ON "lead_distribution_event"("sessionId");
CREATE INDEX IF NOT EXISTS "lead_distribution_event_sellerId_idx" ON "lead_distribution_event"("sellerId");
CREATE INDEX IF NOT EXISTS "lead_distribution_event_channel_idx" ON "lead_distribution_event"("channel");
CREATE INDEX IF NOT EXISTS "lead_distribution_event_eventType_idx" ON "lead_distribution_event"("eventType");
CREATE INDEX IF NOT EXISTS "lead_distribution_event_createdAt_idx" ON "lead_distribution_event"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'lead_session_sellerId_fkey'
      AND table_name = 'lead_session'
  ) THEN
    ALTER TABLE "lead_session"
      ADD CONSTRAINT "lead_session_sellerId_fkey"
      FOREIGN KEY ("sellerId") REFERENCES "user"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'lead_distribution_event_sessionId_fkey'
      AND table_name = 'lead_distribution_event'
  ) THEN
    ALTER TABLE "lead_distribution_event"
      ADD CONSTRAINT "lead_distribution_event_sessionId_fkey"
      FOREIGN KEY ("sessionId") REFERENCES "lead_session"("sessionId")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'lead_distribution_event_sellerId_fkey'
      AND table_name = 'lead_distribution_event'
  ) THEN
    ALTER TABLE "lead_distribution_event"
      ADD CONSTRAINT "lead_distribution_event_sellerId_fkey"
      FOREIGN KEY ("sellerId") REFERENCES "user"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
