# 🏢 Piket Humas — Implementation Plan

## Ringkasan Proyek

Sistem chatbot WhatsApp rule-based + website manajemen untuk Humas Kantor, terdiri dari:

- **Chatbot WA**: Menyapa pelanggan, menyediakan menu interaktif (Informasi, Administrasi, Pengaduan, Mengobrol dengan Petugas), dan mencatat data ke database.
- **Website Manajemen**: Dashboard statistik, manajemen menu chatbot, jadwal piket pegawai, riwayat chat, dan notifikasi realtime saat pelanggan ingin bicara petugas.

---

## Arsitektur

| Komponen | Hosting | Waktu Aktif |
|---|---|---|
| **Baileys WA Bot** | PC Kantor (lokal) | Jam kerja saja |
| **Next.js Website** | Vercel (free tier) | 24/7 |
| **Database + Auth** | Supabase (free tier) | 24/7 |

**2 repo terpisah**, terhubung melalui **Supabase** sebagai single source of truth.

Kedua service **tidak berkomunikasi langsung** satu sama lain — masing-masing read/write ke Supabase secara independen.

---

## Skenario Operasional

Bot hanya aktif saat **PC kantor dinyalakan dan service dijalankan** (jam kerja). Tidak ada dedicated PC yang nyala 24/7.

| Waktu | Kondisi | Yang Terjadi |
|---|---|---|
| Jam kerja, bot online | PC nyala, bot running | Bot reply normal — sapaan, menu, rule-based |
| Di luar jam kerja | PC mati, bot offline | Tidak ada reply. Pesan pending di WhatsApp |
| Pagi berikutnya | PC nyala, bot start | Baileys reconnect, terima pesan pending, proses first reply |

Pesan yang masuk di luar jam kerja akan **otomatis diterima dan diproses oleh bot saat service online kembali**. Baileys akan reconnect menggunakan session yang tersimpan (tanpa perlu scan QR ulang) dan memproses pesan pending dengan first reply + menu.

---

## Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Language** | TypeScript | Digunakan di kedua repo |
| **WA Bot** | Baileys (WhiskeySockets) | Library open-source, gratis, support button/list |
| **Website** | Next.js 15 (App Router) | Fullstack — SSR, API routes, React |
| **Database** | Supabase PostgreSQL | Managed, free tier 500MB |
| **Auth** | Supabase Auth | Login petugas/admin ke dashboard |
| **Realtime** | Supabase Realtime | Push notification ke dashboard (gratis, hingga 200 koneksi) |
| **Styling** | Tailwind CSS + shadcn/ui | Komponen UI modern, siap pakai |
| **Process Manager** | PM2 (opsional) | Auto-restart bot jika crash di PC kantor |

---

## Struktur Repo

### Repo 1: `piket-humas-web` → Deploy ke Vercel

```
piket-humas-web/
├── src/
│   ├── app/                     # Next.js App Router (pages)
│   │   ├── (auth)/              # Halaman login
│   │   └── (dashboard)/         # Halaman terproteksi
│   │       ├── page.tsx         # Dashboard utama (statistik)
│   │       ├── chatbot/         # Manajemen menu bot (CRUD)
│   │       ├── piket/           # Jadwal piket pegawai
│   │       ├── chat-log/        # Riwayat percakapan
│   │       ├── pegawai/         # Data pegawai
│   │       └── laporan/         # Statistik & export
│   ├── components/              # Komponen UI reusable
│   ├── lib/                     # Supabase client, utilities
│   └── hooks/                   # Custom React hooks
├── .env.local                   # SUPABASE_URL, SUPABASE_ANON_KEY
└── package.json
```

### Repo 2: `piket-humas-bot` → Jalankan di PC Kantor

```
piket-humas-bot/
├── src/
│   ├── index.ts                 # Entry point
│   ├── connection.ts            # Koneksi WA + session management
│   ├── handler.ts               # Router pesan masuk
│   ├── rules/                   # Logic rule-based per menu
│   │   ├── greeting.ts          # First reply (sapaan + menu)
│   │   ├── menu.ts              # Handler pilihan menu
│   │   ├── informasi.ts         # Sub-menu informasi
│   │   ├── administrasi.ts      # Sub-menu administrasi
│   │   ├── pengaduan.ts         # Sub-menu pengaduan
│   │   └── escalation.ts       # Flow "Mengobrol dengan Petugas"
│   └── lib/                     # Supabase client, utilities
├── auth-state/                  # Session Baileys (gitignored)
├── .env                         # SUPABASE_URL, SUPABASE_SERVICE_KEY
└── package.json
```

---

## Fitur Chatbot WA

### Flow Utama

1. **First Reply** — Menyapa pelanggan dengan sapaan + menu button. Hanya berlaku 1x per hari per pelanggan. Jika pelanggan sudah disapa hari ini, langsung tampilkan menu.

2. **Menu Utama** — 4 pilihan button:
   - **Informasi** → sub-menu dinamis (konten dari database, bisa di-manage via website)
   - **Administrasi** → sub-menu dinamis
   - **Pengaduan** → sub-menu dinamis
   - **Mengobrol dengan Petugas** → flow formulir

3. **Kembali ke Menu** — Setiap response sub-menu memiliki opsi kembali ke menu utama.

4. **Mengobrol dengan Petugas** — Bot meminta nama dan keperluan → data disimpan ke Supabase → notifikasi muncul di dashboard petugas secara realtime → petugas merespons langsung via WhatsApp.

### Pencatatan Data

Setiap interaksi dicatat ke Supabase:
- Log percakapan (pesan masuk/keluar)
- Jumlah pelanggan harian
- Kategori menu yang dipilih (untuk statistik)
- Data eskalasi ke petugas

---

## Fitur Website Manajemen

| Halaman | Fungsi |
|---|---|
| **Dashboard** | Statistik harian — jumlah pelanggan, pesan, eskalasi, tren chart |
| **Manajemen Menu Chatbot** | CRUD kategori menu & item response yang digunakan bot |
| **Jadwal Piket** | Assign pegawai per hari/shift, tampilan kalender |
| **Live Monitor** | List pelanggan yang sedang menunggu petugas (realtime via Supabase) |
| **Riwayat Chat** | Log semua percakapan, filter by tanggal/status/kategori |
| **Data Pegawai** | CRUD data petugas |
| **Laporan** | Export statistik ke Excel/PDF |

### Notifikasi Realtime

Saat pelanggan memilih "Mengobrol dengan Petugas":
- Bot insert data ke Supabase
- Dashboard yang sedang dibuka oleh petugas **menerima push notification secara instan** melalui Supabase Realtime (WebSocket)
- Notifikasi muncul di dashboard tanpa perlu refresh halaman
- Gratis di Supabase free tier (hingga 200 koneksi simultan)

---

## Deployment

| Komponen | Cara Deploy |
|---|---|
| **Next.js** | Push ke GitHub → Vercel auto-deploy |
| **Baileys Bot** | Di PC kantor: `npm start` / buat shortcut untuk menjalankan saat login Windows |
| **Supabase** | Setup via dashboard Supabase (cloud, managed) |

---

## Hal yang Perlu Diperhatikan

- **WhatsApp Policy**: Baileys adalah unofficial API. Ada risiko nomor di-ban oleh WhatsApp. Untuk mitigasi: gunakan nomor khusus (bukan nomor pribadi), hindari spam, dan gunakan secara wajar sesuai jam kerja.

- **Session Persistence**: Baileys menyimpan session ke folder `auth-state/`. Folder ini harus di-gitignore dan tidak boleh dihapus, agar tidak perlu scan QR ulang setiap kali start bot.

- **Button WhatsApp**: WhatsApp kadang membatasi button untuk unofficial API. Jika button tidak berfungsi, fallback ke numbered menu (ketik 1, 2, 3, 4) sebagai alternatif.
