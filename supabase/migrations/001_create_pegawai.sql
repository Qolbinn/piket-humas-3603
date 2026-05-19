-- ============================================================
-- Migration 001: Create pegawai table
-- Linked to Supabase Auth via auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pegawai (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  username   TEXT NOT NULL UNIQUE,
  email      TEXT NOT NULL UNIQUE,
  phone      TEXT UNIQUE,
  gender     TEXT NOT NULL CHECK (gender IN ('L', 'P')),
  role       TEXT NOT NULL DEFAULT 'petugas' CHECK (role IN ('admin', 'petugas')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pegawai_updated_at
  BEFORE UPDATE ON public.pegawai
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.pegawai ENABLE ROW LEVEL SECURITY;

-- RLS: Pegawai hanya bisa melihat semua data pegawai (read-only untuk semua authenticated user)
CREATE POLICY "pegawai_select" ON public.pegawai
  FOR SELECT TO authenticated USING (true);

-- RLS: Hanya admin yang bisa insert/update/delete
CREATE POLICY "pegawai_insert_admin" ON public.pegawai
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "pegawai_update_admin" ON public.pegawai
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "pegawai_delete_admin" ON public.pegawai
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM public.pegawai WHERE id = auth.uid()) = 'admin'
  );
