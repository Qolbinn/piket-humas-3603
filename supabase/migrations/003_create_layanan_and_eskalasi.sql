-- ============================================================
-- Migration 003: Create kategori_layanan and eskalasi
-- ============================================================

CREATE TABLE IF NOT EXISTS public.kategori_layanan (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode       TEXT NOT NULL UNIQUE,
  nama       TEXT NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER kategori_layanan_updated_at
  BEFORE UPDATE ON public.kategori_layanan
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.eskalasi (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pelanggan_lid     TEXT NOT NULL,
  nama_pelanggan    TEXT NOT NULL,
  kategori_kode     TEXT REFERENCES public.kategori_layanan(kode) ON DELETE SET NULL,
  channel           TEXT NOT NULL DEFAULT 'whatsapp',
  keperluan         TEXT NOT NULL,
  detail            TEXT,
  pegawai_id        UUID REFERENCES public.pegawai(id) ON DELETE SET NULL,
  status            TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ON_PROCESS', 'RESOLVED')),
  feedback_notified BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at       TIMESTAMPTZ
);

CREATE INDEX idx_eskalasi_status ON public.eskalasi(status);
CREATE INDEX idx_eskalasi_created_at ON public.eskalasi(created_at DESC);
CREATE INDEX idx_eskalasi_pegawai_id ON public.eskalasi(pegawai_id);

-- Enable RLS
ALTER TABLE public.kategori_layanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eskalasi ENABLE ROW LEVEL SECURITY;

-- Kategori Layanan RLS (Admin Only for Mutations)
CREATE POLICY "kategori_layanan_select" ON public.kategori_layanan FOR SELECT TO authenticated USING (true);
CREATE POLICY "kategori_layanan_insert" ON public.kategori_layanan FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "kategori_layanan_update" ON public.kategori_layanan FOR UPDATE TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');
CREATE POLICY "kategori_layanan_delete" ON public.kategori_layanan FOR DELETE TO authenticated USING ((SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin');

-- Eskalasi RLS (All authenticated can view and update, bot can insert via service_role)
CREATE POLICY "eskalasi_select" ON public.eskalasi FOR SELECT TO authenticated USING (true);
CREATE POLICY "eskalasi_update" ON public.eskalasi FOR UPDATE TO authenticated USING (true);
-- Insert via bot (service_role) doesn't need policy because service_role bypasses RLS, but we allow web to insert walk-ins
CREATE POLICY "eskalasi_insert" ON public.eskalasi FOR INSERT TO authenticated WITH CHECK (true);
