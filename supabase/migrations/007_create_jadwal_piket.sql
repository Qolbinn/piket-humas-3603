-- ============================================================
-- Migration 007: Create template_piket and jadwal_piket
-- ============================================================

CREATE TABLE IF NOT EXISTS public.template_piket (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER template_piket_updated_at
  BEFORE UPDATE ON public.template_piket
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.template_piket_detail (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.template_piket(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
  pegawai_id  UUID NOT NULL REFERENCES public.pegawai(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(template_id, day_of_week, pegawai_id)
);

CREATE TABLE IF NOT EXISTS public.jadwal_piket (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tanggal     DATE NOT NULL,
  pegawai_id  UUID NOT NULL REFERENCES public.pegawai(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.template_piket(id) ON DELETE SET NULL,
  is_hadir    BOOLEAN NOT NULL DEFAULT false,
  hadir_at    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tanggal, pegawai_id)
);

CREATE INDEX idx_jadwal_piket_tanggal ON public.jadwal_piket(tanggal DESC);
CREATE INDEX idx_jadwal_piket_pegawai_id ON public.jadwal_piket(pegawai_id);

ALTER TABLE public.template_piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_piket_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_piket ENABLE ROW LEVEL SECURITY;

-- Select
CREATE POLICY "jadwal_piket_select" ON public.jadwal_piket FOR SELECT TO authenticated USING (true);
CREATE POLICY "template_piket_select" ON public.template_piket FOR SELECT TO authenticated USING (true);
CREATE POLICY "template_piket_detail_select" ON public.template_piket_detail FOR SELECT TO authenticated USING (true);

-- Admin can mutate template
CREATE POLICY "template_piket_all" ON public.template_piket FOR ALL TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "template_piket_detail_all" ON public.template_piket_detail FOR ALL TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');

-- Admin can mutate jadwal, but users can update their own presence
CREATE POLICY "jadwal_piket_insert" ON public.jadwal_piket FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "jadwal_piket_delete" ON public.jadwal_piket FOR DELETE TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "jadwal_piket_update" ON public.jadwal_piket FOR UPDATE TO authenticated USING (
  pegawai_id = auth.uid() OR (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
);
