# CLAUDE.md — RismaClick

Panduan kerja untuk Claude Code di project ini. Baca file ini sebelum mengerjakan apa pun.

## 1. Tujuan

RismaClick adalah aplikasi project management berbasis web, terinspirasi dari ClickUp, Trello, dan Jira.

Tahap ini hanya membangun fondasi: **autentikasi dasar (Login)** dan **Homepage** sebagai halaman yang dilindungi.

## 2. Scope

### Termasuk (In Scope)
- **Halaman Login**
  - Input `email` dan `password`
  - Validasi input
  - Sukses login → redirect ke Homepage
- **Homepage**
  - Hanya bisa diakses setelah login
  - Menampilkan teks `Halo, {email}` (sesuai email yang login)

### Di Luar Scope (Out of Scope)
Semua hal berikut **tidak boleh dikerjakan** sampai ada keputusan tertulis dari user:
- Registrasi / sign up
- Lupa password / reset password
- Logout (kecuali user menyatakan secara eksplisit)
- Manajemen project, task, board, list, atau workspace
- Role, permission, atau tim
- Notifikasi, profil user, pengaturan
- Fitur lain yang tidak tertulis di `docs/requirement.md`

## 3. Aturan Kerja

1. **Jangan tambah fitur di luar scope.** Jika ada ide tambahan, catat sebagai usulan saja, jangan dikerjakan.
2. **Tanya jika ambigu.** Jika requirement tidak jelas atau bisa ditafsirkan lebih dari satu cara, tanyakan ke user sebelum mengerjakan. Jangan menebak diam-diam. Jika terpaksa memakai asumsi, tulis asumsinya secara eksplisit di `docs/requirement.md` dan di pesan balasan.
3. **Jangan tulis kode sebelum requirement disetujui.** Tahap awal fokus pada dokumen. Kode baru ditulis setelah user menyetujui `docs/requirement.md`.
4. **Requirement adalah sumber kebenaran.** Setiap perubahan kode harus bisa ditelusuri ke satu item di `docs/requirement.md`. Jika tidak ada item-nya, jangan dikerjakan.
5. **Ubah status checklist saat selesai.** Setelah item requirement selesai dan terverifikasi, tandai `[x]` di `docs/requirement.md`.
6. **Jangan melaporkan selesai tanpa verifikasi.** Klaim "berhasil" hanya boleh dibuat setelah langkah verifikasi di bagian 4 dijalankan dan hasilnya dilaporkan apa adanya. Jika ada yang gagal, katakan gagal beserta bukti.
7. **Jangan commit atau push kecuali diminta.**
8. **Bahasa.** Komunikasi dengan user memakai Bahasa Indonesia. Istilah teknis dan identifier kode tetap dalam bentuk aslinya.

## 4. Cara Verifikasi

Setiap item di `docs/requirement.md` diverifikasi dengan salah satu atau kedua cara berikut:

### a. Verifikasi manual
1. Jalankan aplikasi di browser (alamat dan perintah akan ditentukan setelah stack dipilih).
2. Ikuti langkah pada item yang diuji.
3. Bandingkan hasil dengan **Hasil yang diharapkan** pada item tersebut.

### b. Verifikasi otomatis (jika stack mendukung)
- Tulis test untuk setiap item validasi dan alur login/redirect.
- Jalankan seluruh test sebelum melaporkan selesai. Laporkan jumlah test lulus dan gagal.

### Checklist verifikasi minimum sebelum tahap dianggap selesai
- [x] Login dengan input kosong menampilkan pesan validasi dan tidak redirect
- [x] Login dengan kredensial salah menampilkan pesan error dan tidak redirect
- [x] Login dengan kredensial benar redirect ke `/dashboard`
- [x] Homepage menampilkan `Halo, {email}` sesuai user yang login
- [x] Membuka `/dashboard` tanpa login (akses langsung via URL) redirect ke landing `/`
- [x] Tidak ada error di console browser pada alur di atas

## 5. Status

- Tahap: **Tahap 1 (landing + dashboard) terverifikasi** (60 test unit/komponen lulus, 11 test e2e lulus, build produksi berhasil, dan verifikasi manual di Chrome).
- Menjalankan: `pnpm dev` (http://localhost:5173), `pnpm test`, `pnpm test:e2e`, `pnpm build`
- Akun dummy untuk login: lihat `src/auth/authenticate.ts`
- Stack teknologi: **React + Vite + TypeScript** (frontend saja); test dengan Vitest, Testing Library, Playwright
- Daftar requirement: lihat `docs/requirement.md`
- Urutan pengerjaan: lihat `docs/implementation-plan.md`
- Pemantauan progres: lihat `docs/progess.md`
