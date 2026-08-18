-- ============================================================
-- Migration 002: Create faq_menu table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.faq_menu (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id  UUID REFERENCES public.faq_menu(id) ON DELETE CASCADE,
  kode       TEXT,
  title      TEXT NOT NULL,
  is_menu    BOOLEAN NOT NULL DEFAULT false,
  content    TEXT NOT NULL,
  urutan     INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_faq_menu_parent_id ON public.faq_menu(parent_id);

CREATE TRIGGER faq_menu_updated_at
  BEFORE UPDATE ON public.faq_menu
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.faq_menu ENABLE ROW LEVEL SECURITY;

-- Select for all authenticated (termasuk bot via service_role)
CREATE POLICY "faq_menu_select" ON public.faq_menu
  FOR SELECT TO authenticated USING (true);

-- Mutations admin only
CREATE POLICY "faq_menu_insert" ON public.faq_menu
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "faq_menu_update" ON public.faq_menu
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "faq_menu_delete" ON public.faq_menu
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );
