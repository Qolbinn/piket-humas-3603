-- ============================================================
-- Migration 002: Create template table
-- Template alokasi mingguan (Senin - Jumat)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.template (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER template_updated_at
  BEFORE UPDATE ON public.template
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.template ENABLE ROW LEVEL SECURITY;

CREATE POLICY "template_select" ON public.template
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "template_insert" ON public.template
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "template_update" ON public.template
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "template_delete" ON public.template
  FOR DELETE TO authenticated USING (true);
