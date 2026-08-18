-- ============================================================
-- Migration 008: Create bot_notif_log
-- ============================================================

CREATE TABLE IF NOT EXISTS public.bot_notif_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe_notif    TEXT NOT NULL,
  tujuan_lid    TEXT NOT NULL,
  status        TEXT NOT NULL,
  error_message TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bot_notif_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bot_notif_log_select" ON public.bot_notif_log FOR SELECT TO authenticated USING (true);
