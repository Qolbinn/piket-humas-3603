# Skenario UAT (User Acceptance Testing) - SIPASTI Web App

Dokumen ini berisi langkah-langkah manual untuk menguji seluruh fungsi sistem (*End-to-End*) dari sudut pandang pengguna akhir (*Admin, Pimpinan, dan Petugas*).

---

## Modul 1: Autentikasi & RBAC (Role-Based Access Control)

### 1.1 Login & Akses Sesuai Role
- **Langkah**: Buka halaman utama aplikasi (`/login`). Masukkan kredensial untuk akun Petugas (contoh: `arzudaqolbin`).
- **Ekspektasi**: Berhasil masuk ke *Dashboard*. Di *Sidebar*, menu "Master Data" **TIDAK** terlihat/bisa diklik. Jika mencoba mengakses secara paksa via URL (misal `/master/pegawai`), akan dialihkan atau ditolak.
- **Langkah Tambahan**: *Logout*, lalu masuk dengan akun Admin (contoh: `humasbps3603`).
- **Ekspektasi**: Semua menu di *Sidebar* terbuka (Dashboard, Eskalasi, Master Data, Monitoring, dll). URL `/master/pegawai` bisa diakses.

---

## Modul 2: Master Data

### 2.1 Manajemen Pegawai
- **Langkah**: Admin masuk ke menu **Master Data > Pegawai**. Klik "Tambah Pegawai" atau edit pegawai yang ada. Masukkan nomor `lid_wa` dengan format yang salah (tanpa `@s.whatsapp.net`).
- **Ekspektasi**: Sistem menolak dengan pesan validasi.
- **Langkah**: Ubah `lid_wa` dengan format yang benar (misal `62812345678@s.whatsapp.net`), klik Simpan.
- **Ekspektasi**: Muncul notifikasi sukses (*toast*), data pegawai di tabel ter- *update* seketika.

### 2.2 Template Pesan Dinamis
- **Langkah**: Buka menu **Master Data > Template Pesan**. Buka tab "Sambutan".
- **Ekspektasi**: Muncul form textarea dengan 2 variabel yang bisa disisipkan: `{{timeGreeting}}` dan `{{customerName}}`.
- **Langkah**: Klik tombol variabel `{{timeGreeting}}`.
- **Ekspektasi**: Teks variabel muncul di posisi kursor di textarea. Klik tombol "Preview WA". Tampilan akan berubah menyerupai tampilan aplikasi WhatsApp.

### 2.3 FAQ Menu Bersarang
- **Langkah**: Buka menu **Master Data > FAQ Menu**. Tambah Menu Utama baru. Lalu, klik "Sub-menu" pada menu yang baru dibuat untuk menambah sub-menu.
- **Ekspektasi**: Menu utama dan anak menu muncul sesuai hirarki (*tree* atau identasi) di dalam daftar FAQ. Data baru tersimpan dengan baik dan bisa dihapus.

---

## Modul 3: Piket & Penjadwalan

### 3.1 Alokasi Jadwal Piket
- **Langkah**: Buka menu **Piket > Alokasi Template**. Buat template harian/mingguan dan _assign_ petugas untuk Senin - Jumat.
- **Ekspektasi**: Tabel jadwal minggu ini terisi otomatis berdasarkan *template* tersebut.

### 3.2 Checklist Kehadiran
- **Langkah**: Login menggunakan akun Petugas yang dijadwalkan piket hari ini. Buka halaman **Dashboard**.
- **Ekspektasi**: Muncul kartu (*card*) khusus untuk mengisi kehadiran: "Anda memiliki jadwal piket hari ini!".
- **Langkah**: Klik tombol "Hadir".
- **Ekspektasi**: Status berubah menjadi "Sudah Hadir" dengan catatan jam klik (timestamp) aktual. Kartu tidak bisa diklik ulang.

---

## Modul 4: Eskalasi & Realtime

### 4.1 Tabel Realtime & Perubahan Status
- **Langkah**: Buka halaman **Layanan > Eskalasi Pelanggan**. Pastikan ada tiket berstatus `OPEN`.
- **Langkah (Simulasi Bot)**: Tambahkan 1 row eskalasi secara langsung via Supabase *Studio* atau dari bot backend (status `OPEN`).
- **Ekspektasi**: Di layar web app, tanpa me- *refresh* halaman, baris data baru langsung muncul di baris paling atas tabel.
- **Langkah**: Klik tombol aksi pada salah satu tiket `OPEN`, pilih ubah status menjadi `ON_PROCESS`.
- **Ekspektasi**: Kolom status di UI langsung berubah seketika, dan nilai di database ikut berubah.

### 4.2 Trigger Survei Kepuasan
- **Langkah**: Pilih salah satu tiket `ON_PROCESS`, ubah status menjadi `RESOLVED`.
- **Langkah**: Klik menu opsi (*dropdown*), lalu pilih "Kirim Link Survei".
- **Ekspektasi**: Kolom _Feedback_ berubah menjadi `PENDING`. (Nantinya bot WA akan membaca `PENDING` dan mengirimkan chat template `feedback` ke nomor pelanggan, lalu mengubahnya menjadi `SENT`).

---

## Modul 5: Analitik & Monitoring

### 5.1 Kalkulasi Dashboard
- **Langkah**: Buka **Dashboard**. Ubah filter "Hari Ini", "Minggu Ini", "Bulan Ini".
- **Ekspektasi**: Angka pada kartu *Total Eskalasi*, *OPEN*, *ON PROCESS* dan Grafik (Pie chart/Bar chart) berubah dinamis menghitung data sesuai rentang waktu yang dipilih.

### 5.2 Bot Status & Notif Log
- **Langkah**: Buka menu **Monitoring > Bot Status & Notif Log**.
- **Ekspektasi**: Terlihat status 🟢 Online/Offline dari bot WhatsApp (berdasarkan tabel `bot_status`). Tabel Notif Log memunculkan daftar pengingat jadwal atau notifikasi *feedback* yang telah ditembakkan oleh sistem backend kepada WhatsApp pengguna.

---
> [!NOTE]
> UAT ini dilakukan *tanpa* *automation test tools* seperti Cypress/Playwright atas permintaan. Cukup baca panduan ini dan klik/uji aplikasi Anda secara perlahan dari awal sampai akhir.
