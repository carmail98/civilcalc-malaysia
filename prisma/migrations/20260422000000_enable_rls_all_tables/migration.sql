-- Enable Row Level Security on all application tables.
--
-- Context: Supabase exposes every table in the `public` schema via its
-- PostgREST API using the project's anon key (which ships in client bundles).
-- Without RLS, that API lets anyone read/write these tables directly.
--
-- Prisma connects as the Postgres owner, which bypasses RLS. Enabling RLS
-- with no policies therefore blocks the public REST API while leaving the
-- Prisma-based Next.js app fully functional.

ALTER TABLE "User"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Answer"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vote"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Feedback"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedCalc"         ENABLE ROW LEVEL SECURITY;

-- Belt-and-braces: revoke all grants from Supabase's public API roles.
-- Wrapped in DO blocks so the migration still applies on non-Supabase
-- Postgres instances (e.g. local dev) where these roles may not exist.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM anon';
    EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon';
    EXECUTE 'REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES    IN SCHEMA public FROM authenticated';
    EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated';
    EXECUTE 'REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated';
  END IF;
END$$;
