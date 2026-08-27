-- ============================================================
-- Migration 006: Create bot_status
-- ============================================================

CREATE TABLE IF NOT EXISTS public.bot_status (
  service_name  TEXT PRIMARY KEY,
  last_ping_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  status        TEXT NOT NULL DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'ERROR'))
);

ALTER TABLE public.bot_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bot_status_select" ON public.bot_status FOR SELECT TO authenticated USING (true);
-- service_role doesn't need RLS policies, so bot can update it directly
