# Implementation Plan — RismaClick Tahap 1 (Login & Homepage)

Dokumen ini adalah urutan kerja tanpa kode implementasi. Sumber kebenaran tetap `docs/requirement.md`. Aturan kerja dan cara verifikasi ada di `CLAUDE.md`.

## Context

RismaClick adalah aplikasi project management berbasis web. Tahap 1 hanya membangun fondasi: halaman Login dan Homepage yang dilindungi. Project masih kosong (hanya `CLAUDE.md` dan `docs/`), jadi seluruh kode dibuat dari nol.

Sesuai `CLAUDE.md` aturan 3, kode baru ditulis setelah user menyetujui requirement yang sudah direvisi (Fase 0).

## Keputusan yang sudah ditetapkan

| Topik | Keputusan |
|---|---|
| Stack | React + Vite + TypeScript, frontend saja. Test: Vitest, Testing Library, Playwright |
| Autentikasi | Data dummy di satu modul (fungsi `authenticate`), mudah diganti API nanti |
| Field login | **Email** (menggantikan `username` di seluruh requirement) |
| Validasi email | Wajib diisi, format alamat email valid |
| Validasi password | Wajib diisi, minimal 8 karakter, wajib mengandung minimal 1 huruf, 1 angka, dan 1 karakter spesial |
| Persistensi | `sessionStorage` (bertahan saat refresh, hilang saat tab ditutup), akses dibungkus `try/catch` |
| Logout | Tidak ada |
| Bahasa UI | Inggris untuk label dan pesan error; **sapaan tetap `Halo, {email}`** |

### Asumsi (belum diputuskan user, memakai rekomendasi)

Asumsi berikut harus dicantumkan di `docs/requirement.md` (CLAUDE.md aturan 2) dan bisa diubah user kapan saja:

- Layout Login: kartu terpusat.
- Error validasi: inline di bawah field, tampil bersamaan saat submit, hilang saat field dikoreksi.
- Homepage: hanya heading sapaan di tengah halaman, tanpa header atau elemen lain.
- Teks pesan error (Inggris):
  - "Email is required"
  - "Enter a valid email address"
  - "Password is required"
  - "Password must be at least 8 characters and include a letter, a number, and a special character"
  - "Incorrect email or password"

## Fase 0 — Revisi dokumen (tanpa kode)

1. `docs/requirement.md`:
   - Ganti `username` menjadi `email` di A1.1, A2.1–A2.3, B2.1, B2.2. B2.1 menjadi `Halo, {email}`.
   - A2.4: email wajib valid. A2.5: password minimal 8 karakter dengan huruf, angka, dan karakter spesial.
   - A3.1: kredensial dicek terhadap data dummy. B1.3: status login tetap setelah refresh.
   - Hapus tanda `[?]` pada A2.4, A2.5, A3.1, B1.3.
   - Rapikan Pertanyaan Terbuka nomor 3 agar kata "email" konsisten, dan tambahkan bagian **Asumsi**.
2. `CLAUDE.md`: ganti `username` dengan `email` di bagian 1, 2, 4; isi stack dan tahap di bagian 5.
3. **Gerbang:** user menyetujui requirement yang direvisi. Belum ada scaffolding sebelum persetujuan.

## Fase 1 — Scaffolding project

- Buat project Vite React TS di root repo. Tambahkan `react-router-dom`, Vitest, Testing Library (`@testing-library/react`, `jest-dom`, `user-event`), dan Playwright.
- Konfigurasi skrip `dev`, `build`, `test`, `test:e2e`; Vitest memakai jsdom; Playwright menjalankan dev server otomatis.
- `.gitignore` standar. Tidak ada commit kecuali diminta user.

## Fase 2 — Logika autentikasi (test dulu, lalu implementasi)

Modul di `src/auth/`:

- `validation` — validasi email dan password, mengembalikan pesan error atau tidak ada error (A2.1–A2.5).
- `authenticate` — mencocokkan email dan password dengan daftar user dummy (A3.1). Ini satu-satunya tempat yang diganti saat pindah ke API. User dummy harus memenuhi aturan password.
- `session` — baca, simpan, dan hapus status login di `sessionStorage` dengan `try/catch` (A3.3, B1.3).

Urutan: tulis test (kosong, email tidak valid, password kurang 8, password tanpa huruf/angka/spesial, kredensial salah, kredensial benar) → pastikan gagal → implementasi → lulus.

## Fase 3 — Halaman Login

- Form dengan input `email`, input `password` bertipe masked, dan tombol submit (A1.1–A1.3). Validasi bawaan browser dimatikan (`noValidate`) agar pesan kustom yang tampil.
- Error inline di bawah field, tampil bersamaan saat submit (A2.1–A2.3).
- Kredensial salah: satu pesan umum, user tetap di Login (A3.2).
- Sukses: simpan sesi lalu pindah ke Homepage (A3.3, A3.4).
- Tombol nonaktif selama pengecekan (A3.5). Beri penundaan buatan singkat pada `authenticate` agar perilaku ini bisa diuji.
- Test komponen dengan Testing Library untuk setiap item di atas.

## Fase 4 — Proteksi route dan Homepage

- Route `/login` dan `/` (Homepage). Komponen penjaga mengalihkan ke `/login` dengan `replace` bila sesi tidak ada (B1.1, B1.2).
- Homepage hanya heading `Halo, {email}` dari sesi, tanpa elemen lain (B2.1–B2.3).
- Test komponen: tanpa sesi → redirect; dengan sesi → sapaan sesuai email.
- Perilaku user yang sudah login lalu membuka `/login` belum ada di requirement, jadi tidak ditambahkan. Cukup dicatat sebagai usulan.

## Fase 5 — Tampilan responsif dan console bersih

- CSS sederhana tanpa framework: kartu dengan lebar maksimal dan padding cukup, nyaman di 375px ke atas (C1).
- Jalankan dalam `StrictMode`. Tidak ada error atau peringatan di console (C2).

## Fase 6 — Verifikasi akhir dan pembaruan checklist

1. `npm test` (Vitest): laporkan jumlah lulus dan gagal.
2. `npm run test:e2e` (Playwright), mencakup:
   - input kosong → pesan validasi, tidak redirect;
   - kredensial salah → pesan error, tidak redirect;
   - kredensial benar → Homepage dengan `Halo, {email}`;
   - refresh → tetap login;
   - akses langsung ke `/` tanpa login → `/login`;
   - tidak ada error console;
   - viewport 375px dan desktop.
3. Verifikasi manual di browser sesuai `CLAUDE.md` bagian 4a, termasuk membuka console.
4. Tandai `[x]` di `docs/requirement.md` hanya untuk item yang terbukti lulus. Item yang gagal dilaporkan apa adanya dengan bukti.
5. Lengkapi 6 butir checklist verifikasi minimum di `CLAUDE.md`.

## Pemetaan requirement → fase

| Item | Fase |
|---|---|
| A1.1–A1.3 | 3 |
| A2.1–A2.5 | 2, 3 |
| A3.1 | 2 |
| A3.2–A3.5 | 2, 3 |
| B1.1–B1.3 | 2, 4 |
| B2.1–B2.3 | 4 |
| C1–C3 | 5, 6 |

## Di luar scope (hanya usulan, tidak dikerjakan)

Registrasi, lupa password, logout, redirect kembali ke halaman asal setelah login, tombol "show password", rate limiting, dan fitur project management.

## File yang akan dibuat atau diubah

- Diubah: `docs/requirement.md`, `CLAUDE.md`
- Dibuat: `package.json`, `vite.config.ts`, `playwright.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx` (router), `src/auth/*`, `src/pages/Login*`, `src/pages/Home*`, file test di samping masing-masing modul, `e2e/*`
