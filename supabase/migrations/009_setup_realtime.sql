-- ============================================================
-- Migration 009: Setup Realtime
-- ============================================================

BEGIN;

DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE public.eskalasi;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.riwayat_chat_harian;

COMMIT;
