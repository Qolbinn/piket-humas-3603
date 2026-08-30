# Implementation Plan — Overhaul UI/UX Internal Petugas SIPASTI

Rencana komprehensif perbaikan antarmuka (UI) dan pengalaman pengguna (UX) untuk seluruh modul internal petugas & admin (`/dashboard`, `/eskalasi`, `/piket`, `/pegawai`, `/master/*`, `/monitoring/*`, `/profile`). 

Semua perubahan berfokus **100% pada estetika visual, konsistensi warna/sistem desain, serta kemudahan navigasi**, **TANPA mengubah logika bisnis, query database, maupun fungsionalitas sistem saat ini**.

---

## Status Progres Implementasi (Tracking Progress)

- [x] **Modul 1: Layout Shell & Navigasi Utama** (`Sidebar`, `Navbar`, `PageHeader`)
- [x] **Modul 2: Dasbor Utama** (`/dashboard`)
- [x] **Modul 3: Eskalasi Pelanggan** (`/eskalasi`)
- [x] **Modul 4: Manajemen Jadwal Piket** (`/piket`)
- [x] **Modul 5: Master Data** (`/master/layanan`, `/master/faq`, `/master/template`)
- [ ] **Modul 6: Monitoring & Log Sistem** (`/monitoring/petugas`, `/monitoring/notif-log`)
- [ ] **Modul 7: Data Pegawai** (`/pegawai`)
- [ ] **Modul 8: Profil Saya** (`/profile`)

---

## Rincian Modul Perbaikan (Step-by-Step Execution Plan)

### Modul 1: Layout Shell & Navigasi Utama (`Sidebar`, `Navbar`, `PageHeader`)
- **Branding Sidebar**: Ganti teks `"Humas"` di header sidebar menjadi logo **SIPASTI (BPS 3603)** yang konsisten dengan halaman utama.
- **Active Navigation Style**: Perbarui gaya item menu aktif dengan aksen indikator visual (left border / subtle background pill).
- **User Avatar & Role Badge Navbar**: Tambahkan *badge* peran pengguna yang berwarna (*Admin*, *Pimpinan*, *Petugas Humas*) di samping avatar navbar.
- **Bot Status Integration**: Rapikan indikator status bot online di header navbar agar serasi dengan skema warna.

### Modul 2: Dasbor Utama (`/dashboard`)
- **Stat Cards Enhancement**: Tingkatkan visual 4 kartu ringkasan (*Chat Masuk*, *Eskalasi OPEN*, *ON PROCESS*, *Rata-rata SLA*) dengan efek gradien halus, ikon *rounded*, dan indikator tren.
- **Presence Checklist (Absen Piket)**: Perbaiki kartu checklist piket hari ini dengan pill status animasi (*🟢 Hadir / 🟡 Belum Absen*).
- **Chart density & Pie Distribution**: Rapikan container grafik kepadatan obrolan dan distribusi kategori/channel dengan *border radius* dan *shadow* yang konsisten.
- **Modal Cek Petugas Piket**: Perbarui tampilan modal daftar petugas piket aktif dengan chip gender dan status kehadiran yang menarik.

### Modul 3: Eskalasi Pelanggan (`/eskalasi`)
- **Status Filter Tabs**: Tambahkan badge jumlah counter pada setiap tab filter (*SEMUA*, *OPEN*, *ON PROCESS*, *RESOLVED*).
- **Tabel & Kartu Tiket**: Desain ulang badge status tiket (*OPEN* = merah/amber glow, *ON PROCESS* = biru/oranye, *RESOLVED* = hijau emerald).
- **Action Buttons & Details**: Pertajam tombol aksi (*Ambil Tiket*, *Selesaikan*) dan beri tombol *Quick Copy* untuk nomor WhatsApp/LID pelanggan.

### Modul 4: Manajemen Jadwal Piket (`/piket`)
- **Tampilan Kalender & Shift**: Pertegas perbedaan visual antara jadwal piket hari ini (highlight khusus), jadwal mendatang, dan jadwal lampau.
- **Filter & Action Header**: Rapikan tombol pembuatan template piket dan filter range tanggal.

### Modul 5: Master Data (`/master/layanan`, `/master/faq`, `/master/template`)
- **Kategori Layanan (`/master/layanan`)**: Tampilan tabel/grid kategori dengan chip kode numerik yang bersih.
- **Hierarki FAQ Menu (`/master/faq`)**: Tampilan pohon hirarki menu FAQ dengan indikator pembeda antara *Menu Pilihan* (`is_menu=true`) dan *Konten Teks/Trigger*.
- **Template Chat (`/master/template`)**: Perbaiki formulir edit template pesan dengan highlight variabel otomatis (misal: `{{customerName}}`).

### Modul 6: Monitoring & Log Sistem (`/monitoring/petugas`, `/monitoring/notif-log`)
- **Kinerja Petugas (`/monitoring/petugas`)**: Tampilan ringkasan performa petugas dengan progress bar kepatuhan piket (`compliancePercentage`), statistik tiket selesai, dan rata-rata SLA.
- **Log Notifikasi Bot (`/monitoring/notif-log`)**: Tabel log notifikasi bot dengan badge status pengiriman (*SUCCESS* = hijau, *ERROR* = merah) dan penyaringan berdasarkan tanggal.

### Modul 7: Data Pegawai (`/pegawai`)
- **Daftar Pegawai**: Kartu/tabel pegawai dengan badge peran berwarna (*Admin*, *Pimpinan*, *Petugas*) dan avatar gender (`L`/`P`).
- **Modal Tambah/Edit Pegawai**: Tampilan formulir modal yang bersih dan aman.

### Modul 8: Profil Saya (`/profile`)
- **Ringkasan Profil**: Tampilan kartu profil petugas dengan badge peran dan form ganti password dengan indikator keamanan.

---

## Mapping Berkas yang Diperbarui

#### [dashboard-sidebar.tsx](file:///c:/laragon/www/sipasti-web-app/src/components/layout/dashboard-sidebar.tsx)
#### [dashboard-navbar.tsx](file:///c:/laragon/www/sipasti-web-app/src/components/layout/dashboard-navbar.tsx)
#### [page-header.tsx](file:///c:/laragon/www/sipasti-web-app/src/components/layout/page-header.tsx)
#### [dashboard/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/dashboard/page.tsx)
#### [eskalasi/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/eskalasi/page.tsx)
#### [piket/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/piket/page.tsx)
#### [layanan/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/master/layanan/page.tsx)
#### [faq/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/master/faq/page.tsx)
#### [template/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/master/template/page.tsx)
#### [petugas/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/monitoring/petugas/page.tsx)
#### [notif-log/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/monitoring/notif-log/page.tsx)
#### [pegawai/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/pegawai/page.tsx)
#### [profile/page.tsx](file:///c:/laragon/www/sipasti-web-app/src/app/%28dashboard%29/profile/page.tsx)

---

## Plan Verifikasi

### Testing Otomatis
- Jalankan `npm run test` untuk memastikan 37 unit test Server Actions tetap lulus 100%.

### Verifikasi Manual
- Periksa keselarasan UI pada setiap rute internal pasca perbaikan tiap modul.
