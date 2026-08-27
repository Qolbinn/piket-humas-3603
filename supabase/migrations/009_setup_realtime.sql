-- ============================================================
-- Migration 009: Setup Realtime
-- ============================================================

BEGIN;

DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;

ALTER PUBLICATION supabase_realtime ADD TABLE public.eskalasi;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bot_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.riwayat_chat_harian;
ALTER PUBLICATION supabase_realtime ADD TABLE public.faq_menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.template_pesan;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kategori_layanan;

COMMIT;
