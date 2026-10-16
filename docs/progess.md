# Progress — RismaClick Tahap 1 (Landing & Dashboard)

Status requirement ada di `docs/requirement.md`. Desain revisi ada di `docs/superpowers/specs/2026-10-15-landing-dashboard-design.md`. Rencana tahap awal ada di `docs/implementation-plan.md`.

Legenda: `[ ]` belum · `[~]` sedang dikerjakan · `[x]` selesai dan terverifikasi · `[!]` terblokir

**Terakhir diperbarui:** 2026-10-15
**Posisi sekarang:** Revisi scope (landing + dashboard) selesai: implementasi, verifikasi otomatis, dan verifikasi manual di Chrome.

## Fase

### Tahap awal (login + homepage sederhana)

- [x] **Fase 0 — Revisi dokumen**
- [x] **Fase 1 — Scaffolding project** (Vite React TS, dependency, konfigurasi test)
- [x] **Fase 2 — Logika autentikasi** (`validation`, `authenticate`, `session`, test ditulis lebih dulu)
- [x] **Fase 3 — Halaman Login**
- [x] **Fase 4 — Proteksi route dan Homepage**
- [x] **Fase 5 — Responsif dan console bersih**
- [x] **Fase 6 — Verifikasi akhir dan pembaruan checklist**

### Revisi scope 2026-10-15 (landing + dashboard)

- [x] **Spec disetujui user** (`docs/superpowers/specs/2026-10-15-landing-dashboard-design.md`)
- [x] **Requirement direvisi** (A: landing di `/`, B: dashboard di `/dashboard`, C3 diperbarui)
- [x] **Data dummy** (`src/data/dashboard.ts`) dan fungsi `getStats`
- [x] **Routing** (`/` untuk landing, `/dashboard` terproteksi, `RedirectIfAuthed` di `/`)
- [x] **Landing** (navbar, hero + form login, fitur, langkah kerja, CTA, footer)
- [x] **Dashboard** (sidebar responsif, sapaan, kartu statistik, tabel project, daftar task)
- [x] **Perbaikan CSS** (dashboard tidak lagi melebar di 375px)
- [x] **Verifikasi manual di Chrome** (dilakukan 2026-10-15 di Chrome user, lihat bagian "Verifikasi manual")
- [x] **Perbaikan sidebar di layar kecil** (sidebar terbuka tidak bisa ditutup karena tombol Menu tertutup sidebar; ditambah tombol "Close menu")

## Hasil verifikasi

| Perintah | Lulus | Gagal | Catatan |
|---|---|---|---|
| `pnpm test` (Vitest, 8 file) | 60 | 0 | validation, authenticate, session, LoginForm, dashboard data, LandingPage, DashboardPage, App (routing) |
| `pnpm test:e2e` (Playwright, Chromium) | 11 | 0 | Termasuk landing, redirect, A3.6, dashboard, dan viewport 375px (buka dan tutup sidebar) |
| `pnpm build` (termasuk `tsc --noEmit`) | – | – | Berhasil |

Sebelum revisi, hasilnya 44 test unit dan 6 test e2e.

Checklist verifikasi minimum di `CLAUDE.md`: dicentang. Item requirement di `docs/requirement.md`: 32/32 dicentang.

## Pemetaan item ke bukti

| Item | Bukti |
|---|---|
| A1.1–A1.3 | `src/components/LoginForm.test.tsx` (tampilan), e2e "landing shows the hero…" |
| A1.4 | `src/pages/LandingPage.test.tsx`, e2e "Sign in link scrolls the login form into view" |
| A1.5–A1.8 | `src/pages/LandingPage.test.tsx`, e2e "landing shows the hero…" |
| A2.1–A2.5 | `src/auth/validation.test.ts`, `src/components/LoginForm.test.tsx` (validasi), e2e "empty input" |
| A3.1 | `src/auth/authenticate.test.ts`; logika di satu modul `src/auth/authenticate.ts` |
| A3.2–A3.4 | `src/components/LoginForm.test.tsx`, e2e "wrong credentials" dan "correct credentials" |
| A3.5 | `src/components/LoginForm.test.tsx`, e2e "submit button is disabled" |
| A3.6 | `src/App.test.tsx` (redirect `/` ke `/dashboard`), e2e "logged-in user opening /" |
| B1.1–B1.3 | `src/App.test.tsx` (routing), e2e (direct URL, refresh, tab baru) |
| B2.1–B2.2 | `src/pages/DashboardPage.test.tsx`, e2e "correct credentials…" |
| B2.3 | `src/pages/DashboardPage.test.tsx` (sidebar), sidebar di e2e mobile |
| B2.4 | `src/data/dashboard.test.ts`, `src/pages/DashboardPage.test.tsx` |
| B2.5–B2.6 | `src/pages/DashboardPage.test.tsx`, e2e "dashboard shows stat cards…" |
| B2.7 | Tinjauan kode: semua data dari `src/data/dashboard.ts` |
| C1 | e2e "mobile 375px" (landing dan dashboard tanpa scroll horizontal; sidebar bisa dibuka) |
| C2 | e2e: console error/warning dikumpulkan di alur utama dan harus kosong |
| C3 | Tinjauan kode: route hanya `/` dan `/dashboard`, dan pengalihan path tak dikenal ke `/` |

## Catatan dan keputusan

- Route `/login` dihapus. Halaman login sekarang berada di `/` sebagai landing.
- Komponen `LoginPage` dan `HomePage` dihapus. Form dipindah ke `src/components/LoginForm.tsx`.
- Spec tidak di-commit, dan tidak ada commit lain, sesuai `CLAUDE.md` aturan 7.
- Istilah "Homepage" di requirement berarti halaman `/dashboard`.
- Angka statistik dihitung dari data dummy: task "aktif" = semua task yang belum Done (termasuk yang terlambat).
- Menu Projects dan Tasks di sidebar tidak berfungsi, sesuai asumsi 9 di requirement.
- Penundaan buatan 300 ms tetap ada di `authenticate` supaya A3.5 bisa diuji.
- Akun dummy: `risma@example.com` / `Passw0rd!` (di `src/auth/authenticate.ts`).
- `npm` tidak tersedia di mesin ini, jadi semua perintah memakai `pnpm`.
- Bug yang ditemukan dan diperbaiki saat verifikasi: tabel dashboard membuat halaman melebar di 375px. Diperbaiki dengan `minmax(0, 1fr)` pada grid konten dashboard.

## Verifikasi manual

Dilakukan di Chrome user pada http://localhost:5173 (`pnpm dev`):

| Langkah | Hasil |
|---|---|
| Buka `/dashboard` tanpa login | Diarahkan ke `/` (B1.2) |
| Login kosong | "Email is required" dan "Password is required" tampil, tetap di `/` (A2.3) |
| Login salah (`risma@example.com` / `Wrong1234!`) | "Incorrect email or password", tetap di `/` (A3.2) |
| Login benar (`Passw0rd!`) | Ke `/dashboard`, sapaan `Halo, risma@example.com`, `sessionStorage` berisi email (A3.4, B2.1) |
| Dashboard desktop (1440px) | Sidebar, empat kartu (4 / 3 / 2 / 1), tabel project, dan daftar task tampil sesuai data dummy |
| Refresh `/dashboard` | Tetap di dashboard (B1.3) |
| Lebar 375px (iframe) | Tidak ada scroll horizontal; menu terbuka dan tertutup dengan benar |
| Console | Tidak ada error atau warning pada alur di atas (C2) |

Catatan: console hanya diperiksa setelah tracking aktif, sehingga pesan saat pemuatan awal tidak sepenuhnya tercatat. Pesan yang tercatat hanya log Vite dan saran React DevTools.

Temuan saat verifikasi manual: sidebar yang terbuka di layar kecil menutupi tombol Menu, sehingga tidak bisa ditutup. Sudah diperbaiki dengan tombol "Close menu" di dalam sidebar.

## Belum diverifikasi

- Hanya Chromium yang diuji (Firefox/Safari tidak).
- Verifikasi 375px dilakukan dengan iframe karena ukuran window browser tidak bisa diubah lewat tool di sesi ini.

## Usulan (tidak dikerjakan, di luar scope)

- Redirect kembali ke halaman asal setelah login.
- Tombol "show password".
- Logout, registrasi, lupa password.
- Halaman Projects dan Tasks yang berfungsi.

## Masalah dan blokir

Tidak ada. Sebelumnya ekstensi Claude in Chrome tidak terhubung, tetapi sekarang sudah terhubung dan verifikasi manual selesai.
