// ============================================================
// Database Types — Manual definitions to match Supabase v2
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Gender = 'L' | 'P'
export type Role = 'admin' | 'pimpinan' | 'petugas'
export type EskalasiStatus = 'waiting' | 'handled' | 'closed'
export type DayOfWeek = 1 | 2 | 3 | 4 | 5

export type Pegawai = {
  id: string
  name: string
  username: string
  email: string
  phone: string
  lid_wa: string
  gender: Gender
  role: Role
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type KategoriLayanan = {
  id: string
  kode: string
  nama: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FaqMenu = {
  id: string
  parent_id: string | null
  kode: string | null
  title: string
  is_menu: boolean
  content: string
  urutan: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Template = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type TemplateDetail = {
  id: string
  template_id: string
  day_of_week: DayOfWeek
  pegawai_id: string
  created_at: string
  pegawai?: Pegawai
  template?: Template
}

export type JadwalPiket = {
  id: string
  tanggal: string
  pegawai_id: string
  template_id: string | null
  is_hadir: boolean
  hadir_at: string | null
  created_at: string
  pegawai?: Pegawai
  template?: Template
}

export type Eskalasi = {
  id: string
  nomor_pelanggan: string
  nama_pelanggan: string
  keperluan: string
  detail: string | null
  pegawai_id: string | null
  kategori_kode: string | null
  status: EskalasiStatus
  waktu_respons: number | null
  created_at: string
  handled_at: string | null
  pegawai?: Pegawai
}

export type RiwayatPelanggan = {
  id: number
  nomor_hp: string
  created_at: string
}

export type BotStatus = {
  id: number
  service_name: string
  status: string
  last_ping_at: string
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      pegawai: {
        Row: Pegawai
        Insert: {
          id: string
          name: string
          username: string
          email: string
          phone: string
          lid_wa: string
          gender: Gender
          role?: Role
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          email?: string
          phone?: string
          lid_wa?: string
          gender?: Gender
          role?: Role
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      kategori_layanan: {
        Row: KategoriLayanan
        Insert: {
          id?: string
          kode: string
          nama: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode?: string
          nama?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_menu: {
        Row: FaqMenu
        Insert: {
          id?: string
          parent_id?: string | null
          kode?: string | null
          title: string
          is_menu?: boolean
          content: string
          urutan?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          kode?: string | null
          title?: string
          is_menu?: boolean
          content?: string
          urutan?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faq_menu_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "faq_menu"
            referencedColumns: ["id"]
          }
        ]
      }
      template_piket: {
        Row: Template
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      template_piket_detail: {
        Row: TemplateDetail
        Insert: {
          id?: string
          template_id: string
          day_of_week: DayOfWeek
          pegawai_id: string
          created_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          day_of_week?: DayOfWeek
          pegawai_id?: string
          created_at?: string
        }
        Relationships: []
      }
      jadwal_piket: {
        Row: JadwalPiket
        Insert: {
          id?: string
          tanggal: string
          pegawai_id: string
          template_id?: string | null
          is_hadir?: boolean
          hadir_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tanggal?: string
          pegawai_id?: string
          template_id?: string | null
          is_hadir?: boolean
          hadir_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      eskalasi: {
        Row: Eskalasi
        Insert: {
          id?: string
          nomor_pelanggan: string
          nama_pelanggan: string
          keperluan: string
          detail?: string | null
          pegawai_id?: string | null
          kategori_kode?: string | null
          status?: EskalasiStatus
          waktu_respons?: number | null
          created_at?: string
          handled_at?: string | null
        }
        Update: {
          id?: string
          nomor_pelanggan?: string
          nama_pelanggan?: string
          keperluan?: string
          detail?: string | null
          pegawai_id?: string | null
          kategori_kode?: string | null
          status?: EskalasiStatus
          waktu_respons?: number | null
          created_at?: string
          handled_at?: string | null
        }
        Relationships: []
      }
      riwayat_pelanggan: {
        Row: RiwayatPelanggan
        Insert: {
          id?: number
          nomor_hp: string
          created_at?: string
        }
        Update: {
          id?: number
          nomor_hp?: string
          created_at?: string
        }
        Relationships: []
      }
      bot_status: {
        Row: BotStatus
        Insert: {
          id?: number
          service_name: string
          status: string
          last_ping_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          service_name?: string
          status?: string
          last_ping_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
