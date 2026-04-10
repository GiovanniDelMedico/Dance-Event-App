ALTER TABLE "EventRegistration"
DROP CONSTRAINT IF EXISTS "EventRegistration_eventId_fkey";

ALTER TABLE "EventRegistration"
ADD CONSTRAINT "EventRegistration_eventId_fkey"
FOREIGN KEY ("eventId") REFERENCES "Event"("id")
ON DELETE CASCADE;
