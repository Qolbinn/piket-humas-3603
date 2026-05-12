-- ============================================================
-- Migration 003: Create template_detail table
-- Isi template per hari kerja (max 3 pegawai per hari)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.template_detail (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.template(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 5),
  -- 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat
  pegawai_id  UUID NOT NULL REFERENCES public.pegawai(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query yang sering digunakan
CREATE INDEX idx_template_detail_template_id ON public.template_detail(template_id);
CREATE INDEX idx_template_detail_pegawai_id ON public.template_detail(pegawai_id);

-- Unique: satu pegawai hanya bisa 1x di hari yang sama dalam satu template
CREATE UNIQUE INDEX idx_template_detail_unique
  ON public.template_detail(template_id, day_of_week, pegawai_id);

-- Enable RLS
ALTER TABLE public.template_detail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "template_detail_select" ON public.template_detail
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "template_detail_insert" ON public.template_detail
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "template_detail_update" ON public.template_detail
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "template_detail_delete" ON public.template_detail
  FOR DELETE TO authenticated USING (true);
