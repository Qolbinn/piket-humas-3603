// ============================================================
// Database Types — generated from ERD schema
// ============================================================

export type Gender = 'L' | 'P'
export type Role = 'admin' | 'petugas'
export type EskalasiStatus = 'waiting' | 'handled' | 'closed'
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 // 1=Senin ... 5=Jumat

// ============================================================
// Table Row Types
// ============================================================

export interface Pegawai {
  id: string
  name: string
  username: string
  email: string
  gender: Gender
  role: Role
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface TemplateDetail {
  id: string
  template_id: string
  day_of_week: DayOfWeek
  pegawai_id: string
  created_at: string
  // Joined relations
  pegawai?: Pegawai
  template?: Template
}

export interface JadwalPiket {
  id: string
  tanggal: string // ISO date string YYYY-MM-DD
  pegawai_id: string
  template_id: string | null
  created_at: string
  // Joined relations
  pegawai?: Pegawai
  template?: Template
}

export interface Eskalasi {
  id: string
  nomor_pelanggan: string
  nama_pelanggan: string
  keperluan: string
  detail: string | null
  pegawai_id: string | null
  status: EskalasiStatus
  waktu_respons: number | null // dalam menit
  created_at: string
  handled_at: string | null
  // Joined relations
  pegawai?: Pegawai
}

export interface RiwayatPelanggan {
  id: number
  nomor_hp: string
  created_at: string
}

// ============================================================
// Supabase Database Generic Type
// ============================================================

export interface Database {
  public: {
    Tables: {
      pegawai: {
        Row: Pegawai
        Insert: Omit<Pegawai, 'created_at' | 'updated_at'> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Pegawai, 'id' | 'created_at'>>
      }
      template: {
        Row: Template
        Insert: Omit<Template, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Template, 'id' | 'created_at'>>
      }
      template_detail: {
        Row: TemplateDetail
        Insert: Omit<TemplateDetail, 'id' | 'created_at' | 'pegawai' | 'template'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<TemplateDetail, 'id' | 'created_at'>>
      }
      jadwal_piket: {
        Row: JadwalPiket
        Insert: Omit<JadwalPiket, 'id' | 'created_at' | 'pegawai' | 'template'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<JadwalPiket, 'id' | 'created_at'>>
      }
      eskalasi: {
        Row: Eskalasi
        Insert: Omit<Eskalasi, 'id' | 'created_at' | 'pegawai'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Omit<Eskalasi, 'id' | 'created_at'>>
      }
      riwayat_pelanggan: {
        Row: RiwayatPelanggan
        Insert: Omit<RiwayatPelanggan, 'id' | 'created_at'> & {
          created_at?: string
        }
        Update: never
      }
    }
  }
}
