-- ============================================================
-- Migration 005: Create template_pesan
-- ============================================================

CREATE TABLE IF NOT EXISTS public.template_pesan (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipe       TEXT NOT NULL UNIQUE,
  konten     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER template_pesan_updated_at
  BEFORE UPDATE ON public.template_pesan
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.template_pesan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "template_pesan_select" ON public.template_pesan FOR SELECT TO authenticated USING (true);
CREATE POLICY "template_pesan_insert" ON public.template_pesan FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "template_pesan_update" ON public.template_pesan FOR UPDATE TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "template_pesan_delete" ON public.template_pesan FOR DELETE TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
